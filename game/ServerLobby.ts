import { OutMsg, ServerPlayer, Thing } from "./constants.ts";

export type GameState =
  | { stage: "lobby"; things: string[]; remainingReady: number }
  | { stage: "roundEnd"; round: number; winner: string; gameEnd: boolean }
  | {
    stage: "game";
    round: number;
    remainingVotes: number;
    votes: {
      [thing: string]: string[];
    };
  };

export class ServerLobby {
  lobbyCode: string;
  players: ServerPlayer[];
  state: GameState;
  battleCount: number = 1;

  constructor(lobbyCode: string) {
    this.players = [];
    this.lobbyCode = lobbyCode;
    this.state = {
      stage: "lobby",
      things: [],
      remainingReady: 0,
    };
  }

  sendMsg(msg: OutMsg, socket: WebSocket) {
    socket.send(JSON.stringify(msg));
  }

  shoutMsg(msg: OutMsg) {
    for (const { socket } of this.players) this.sendMsg(msg, socket);
  }

  addPlayer(
    player: ServerPlayer,
  ) {
    const createPlayerCode = () => {
      const randomInt = () => Math.ceil(Math.random() * 9);
      const code = new Array(4)
        .fill(0)
        .map(randomInt);
      return code.join("");
    };

    const newPlayer = {
      ...player,
      name: player.name + "#" + createPlayerCode(),
    };

    this.shoutMsg({ type: "playerJoined", data: newPlayer.name });

    switch (this.state.stage) {
      case "lobby":
        {
          this.sendMsg(
            {
              type: "allPlayers",
              data: this.players.map((p) => ({ name: p.name, ready: p.ready })),
            },
            newPlayer.socket,
          );

          this.sendMsg(
            { type: "allSuggestions", data: this.state.things },
            newPlayer.socket,
          );

          this.state.remainingReady++;
        }
        break;

      case "game":
        {
          this.sendMsg(
            { type: "allVotes", data: this.state.votes },
            newPlayer.socket,
          );

          this.state.remainingVotes++;
        }
        break;

      case "roundEnd": {
        this.sendMsg({
          type: "roundEnd",
          data: { gameEnd: this.state.gameEnd, winner: this.state.winner },
        }, newPlayer.socket);
      }
    }

    this.players.push(newPlayer);
  }

  removePlayer(player: string) {
    // notify everyone of the leaving player
    this.shoutMsg({ type: "playerLeft", data: player });

    // remove player from lobby
    const idx = this.players.findIndex((p) => p.name === player);
    this.players.splice(idx, 1);
  }

  suggestThing(thing: string) {
    if (this.state.stage !== "lobby") return;

    this.shoutMsg({ type: "newSuggestion", data: thing });

    this.state.things.push(thing);
  }

  playerReady(player: string) {
    if (this.state.stage !== "lobby") return;

    this.shoutMsg({ type: "playerReady", data: player });

    const idx = this.players.findIndex((p) => p.name === player);

    this.players[idx].ready = true;
    this.state.remainingReady--;

    if (this.state.remainingReady === 0) this.startGame();
  }

  voteFor(thing: Thing, player: string) {
    if (this.state.stage !== "game") return;

    this.shoutMsg({
      type: "newVote",
      data: { lobbyCode: this.lobbyCode, player, thing },
    });

    this.state.votes[thing].push(player);
    this.state.remainingVotes--;

    if (this.state.remainingVotes === 0) this.endRound();
  }

  startGame() {
    if (this.state.stage !== "lobby") return;

    // TODO, calculate brackets
    // TODO, calculate match count

    this.startRound();
  }

  startRound() {
    if (this.state.stage === "game") return;

    let prevRound = 0;
    if (this.state.stage === "lobby") prevRound = 0;
    if (this.state.stage === "roundEnd") prevRound = this.state.round;

     // TODO, probably based on match number
    const things: [Thing, Thing] = ["a" as Thing, "b" as Thing];

    this.state = {
      stage: "game",
      remainingVotes: this.players.length,
      round: prevRound + 1,
      votes: Object.fromEntries(things.map((t) => [t, []])),
    };

    this.shoutMsg({
      type: "roundStart",
      data: { round: this.state.round, things },
    });
  }

  endRound() {
    if (this.state.stage !== "game") return;

    const round = this.state.round;
    const gameEnd = round === this.battleCount;

    const [thingL, thingR] = Object.keys(this.state.votes);
    const votesL = this.state.votes[thingL].length;
    const votesR = this.state.votes[thingR].length;

    let winner = "";
    if (votesL === votesR) {
      winner = "Empate!";
    } else if (votesL > votesR) {
      winner = thingL;
    } else {
      winner = thingR;
    }

    this.state = {
      stage: "roundEnd",
      round,
      winner,
      gameEnd,
    };

    this.shoutMsg({ type: "roundEnd", data: { gameEnd, winner } });
    if (!gameEnd) setTimeout(() => this.startRound(), 5000);
  }
}
