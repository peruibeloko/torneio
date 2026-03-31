import { OutMsg, ServerPlayer, ServerVotes, Thing } from '@/game/constants.ts';
import { Tournament } from '@/game/Tournament.ts';

export type GameState =
  | { stage: 'lobby'; things: string[]; remainingReady: number }
  | { stage: 'roundEnd'; round: number; winner: string; gameEnd: boolean }
  | {
      stage: 'game';
      round: number;
      remainingVotes: number;
      votes: ServerVotes;
    };

export class ServerLobby {
  #lobbyCode: string;
  #players = new Map<string, ServerPlayer>();
  #state: GameState;
  #battleCount: number = 1;
  #tournament = new Tournament();

  constructor(lobbyCode: string) {
    this.#lobbyCode = lobbyCode;
    this.#state = {
      stage: 'lobby',
      things: [],
      remainingReady: 0
    };
  }

  #sendMsg(msg: OutMsg, socket: WebSocket) {
    console.log('sending message', msg);
    socket.send(JSON.stringify(msg));
  }

  #shoutMsg(msg: OutMsg) {
    console.log('shouting message', msg);
    for (const { socket } of this.#players.values()) this.#sendMsg(msg, socket);
  }

  addPlayer(name: string, player: ServerPlayer) {
    const createPlayerCode = () => {
      const randomInt = () => Math.ceil(Math.random() * 9);
      const code = new Array(4).fill(0).map(randomInt);
      return code.join('');
    };

    let uniqueName = name + '#' + createPlayerCode();
    while (this.#players.has(uniqueName)) {
      uniqueName = name + '#' + createPlayerCode();
    }

    this.#shoutMsg({
      type: 'playerJoined',
      data: uniqueName
    });

    this.#players.set(uniqueName, player);

    switch (this.#state.stage) {
      case 'lobby':
        {
          this.#sendMsg(
            {
              type: 'allPlayers',
              data: this.#players
                .entries()
                .map(([name, p]) => ({
                  name,
                  ready: p.ready
                }))
                .toArray()
            },
            player.socket
          );

          this.#sendMsg(
            { type: 'allSuggestions', data: this.#state.things },
            player.socket
          );

          this.#state.remainingReady++;
        }
        break;

      case 'game':
        {
          this.#sendMsg(
            { type: 'allVotes', data: this.#state.votes },
            player.socket
          );

          this.#state.remainingVotes++;
        }
        break;

      case 'roundEnd': {
        this.#sendMsg(
          {
            type: 'roundEnd',
            data: { gameEnd: this.#state.gameEnd, winner: this.#state.winner }
          },
          player.socket
        );
      }
    }
  }

  removePlayer(player: string) {
    // notify everyone of the leaving player
    this.#shoutMsg({ type: 'playerLeft', data: player });

    // remove player from lobby
    this.#players.delete(player);

    return this.#players.size;
  }

  suggestThing(thing: string) {
    if (this.#state.stage !== 'lobby') return;

    this.#shoutMsg({ type: 'newSuggestion', data: thing });

    this.#state.things.push(thing);
  }

  playerReady(player: string) {
    if (this.#state.stage !== 'lobby') return;

    this.#shoutMsg({ type: 'playerReady', data: player });

    const playerData = this.#players.get(player)!;
    playerData.ready = true;
    this.#players.set(player, playerData);

    this.#state.remainingReady--;

    if (this.#state.remainingReady === 0) this.startGame();
  }

  voteFor(thing: Thing, player: string) {
    if (this.#state.stage !== 'game') return;

    this.#shoutMsg({
      type: 'newVote',
      data: { lobbyCode: this.#lobbyCode, player, thing }
    });

    this.#state.votes[thing].push(player);
    this.#state.remainingVotes--;

    if (this.#state.remainingVotes === 0) this.endRound();
  }

  startGame() {
    if (this.#state.stage !== 'lobby') return;
    console.log('starting game');
    this.#tournament.setup(this.#state.things as Thing[]);
    this.startRound();
  }

  startRound() {
    if (this.#state.stage === 'game') return;
    const things = this.#tournament.getNextMatch();

    console.log(
      'starting match',
      this.#tournament.currentRound,
      'with',
      things
    );

    this.#state = {
      stage: 'game',
      remainingVotes: this.#players.size,
      round: this.#tournament.currentRound,
      votes: Object.fromEntries(things.map(t => [t, []]))
    };

    this.#shoutMsg({
      type: 'roundStart',
      data: { round: this.#state.round, things }
    });
  }

  endRound() {
    if (this.#state.stage !== 'game') return;

    const round = this.#state.round;
    const gameEnd = round === this.#battleCount;

    const winner = this.#tournament.handleMatchEnd(this.#state.votes);
    const winnerMsg = winner ?? 'Empate!';

    console.log('match', round, 'ended, winner is', winner);
    if (gameEnd) console.log('game end');

    this.#state = {
      stage: 'roundEnd',
      round,
      winner: winnerMsg,
      gameEnd
    };

    this.#shoutMsg({ type: 'roundEnd', data: { gameEnd, winner: winnerMsg } });
    if (!gameEnd) setTimeout(() => this.startRound(), 5000);
  }
}
