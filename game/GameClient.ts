import {
  AllVotesMsg,
  ClientPlayer,
  InMsg,
  OutMsg,
  Thing,
  Votes,
} from "@/game/constants.ts";
import { computed, signal } from "@preact/signals";

export class GameClient {
  #socket: WebSocket;
  #playerName = "";
  #lobbyCode = "";

  #players = signal<ClientPlayer[]>([]);
  #things = signal<string[]>([]);

  #round = signal(0);
  #votes: Votes = {};
  #winner = signal("");
  #isGameEnd = signal(false);
  #roundEndCallback = () => {};
  #roundStartCallback = () => {};

  constructor() {
    this.#socket = new WebSocket("/api/game");
    this.#setupHandler();
  }

  get players() {
    return this.#players;
  }

  get things() {
    return this.#things;
  }

  get round() {
    return this.#round;
  }

  get roundThings() {
    return Object.keys(this.#votes) as [Thing, Thing];
  }

  get votes() {
    const [thingL, thingR] = Object.keys(this.#votes) as [Thing, Thing];
    const votesL = computed(() => this.#votes[thingL].value);
    const votesR = computed(() => this.#votes[thingR].value);

    return [votesL, votesR];
  }

  get winner() {
    return this.#winner;
  }

  get gameEnd() {
    return this.#isGameEnd;
  }

  async createLobby(name: string) {
    this.#playerName = name;
    this.#lobbyCode = await fetch("/api/createLobby", { method: "POST" })
      .then((r) => r.text());
    console.log(this.#playerName, "created lobby", this.#lobbyCode);
  }

  joinLobby(name: string, lobbyCode: string) {
    this.#playerName = name;
    this.#lobbyCode = lobbyCode;
    this.#sendMsg({
      type: "join",
      data: { lobbyCode: this.#lobbyCode, player: name },
    });
    console.log(this.#playerName, "joined lobby", this.#lobbyCode);
  }

  leaveLobby() {
    this.#sendMsg({
      type: "leave",
      data: { lobbyCode: this.#lobbyCode, player: this.#playerName },
    });
  }

  suggest(thing: string) {
    this.#sendMsg({
      type: "suggest",
      data: { thing, lobbyCode: this.#lobbyCode },
    });
    console.log("suggesting", thing);
  }

  ready() {
    this.#sendMsg({
      type: "ready",
      data: {
        lobbyCode: this.#lobbyCode,
        player: this.#playerName,
      },
    });
    console.log(this.#playerName, "is ready");
  }

  vote(thing: Thing) {
    this.#sendMsg({
      type: "vote",
      data: { player: this.#playerName, thing, lobbyCode: this.#lobbyCode },
    });
    console.log("voting for", thing);
  }

  set roundEndLogic(cb: () => void) {
    this.#roundEndCallback = cb;
  }

  set roundStartLogic(cb: () => void) {
    this.#roundStartCallback = cb;
  }

  #startRound(things: [Thing, Thing], round: number) {
    this.#round.value = round;
    this.#votes = {
      [things[0]]: signal([]),
      [things[1]]: signal([]),
    };
    this.#roundStartCallback();
    console.log("new round", this.#votes);
  }

  #endRound(winner: string, gameEnd: boolean) {
    this.#winner.value = winner;
    this.#isGameEnd.value = gameEnd;
    this.#roundEndCallback();
    console.log("round winner:", winner, "game ended:", gameEnd);
  }

  #newSuggestion(thing: string) {
    console.log("got suggestion", thing);
    this.#things.value = [...this.#things.value, thing];
  }

  #newPlayer(name: string) {
    console.log(name, "joined");
    this.#players.value = [...this.#players.value, { name, ready: false }];
  }

  #playerLeft(name: string) {
    console.log(name, "left");
    const idx = this.#players.value.findIndex((p) => p.name === name);
    this.#players.value = this.#players.value.toSpliced(idx, 1);
  }

  #newVote(player: string, thing: Thing) {
    const currentVotes = this.#votes[thing].value;
    this.#votes[thing].value = [...currentVotes, player];
    console.log(player, "voted for", thing);
  }

  #setSuggestions(things: string[]) {
    console.log("suggestions so far:", things);
    this.#things.value = things;
  }

  #setPlayers(players: ClientPlayer[]) {
    console.log("current players:", players);
    this.#players.value = players;
  }

  #setVotes(votes: AllVotesMsg) {
    console.log("current votes:", votes);
    for (const key in votes) {
      this.#votes[key as Thing].value = votes[key as Thing];
    }
  }

  #setupHandler() {
    this.#socket.addEventListener(
      "message",
      (e) => this.#handleMsg(JSON.parse(e.data)),
    );
  }

  #sendMsg(msg: InMsg) {
    console.log("sending message", msg);
    this.#socket.send(JSON.stringify(msg));
  }

  #handleMsg(msg: OutMsg) {
    switch (msg.type) {
      case "allPlayers":
        this.#setPlayers(msg.data);
        break;

      case "allVotes":
        this.#setVotes(msg.data);
        break;

      case "allSuggestions":
        this.#setSuggestions(msg.data);
        break;

      case "playerJoined":
        this.#newPlayer(msg.data);
        break;

      case "playerLeft":
        this.#playerLeft(msg.data);
        break;

      case "newVote":
        this.#newVote(msg.data.player, msg.data.thing);
        break;

      case "newSuggestion":
        this.#newSuggestion(msg.data);
        break;

      case "roundStart":
        this.#startRound(msg.data.things, msg.data.round);
        break;

      case "roundEnd":
        this.#endRound(msg.data.winner, msg.data.gameEnd);
        break;
    }
  }
}
