import type { ServerMessage } from '@/game/server/ServerMessages.ts';
import { Tournament } from '@/game/server/Tournament.ts';
import { Votes } from '@/game/server/Votes.ts';
import type { GameState, ServerPlayer } from '@/game/shared/constants.ts';
import { encode } from 'msgpack';
import { ClientMessage } from '@/game/client/ClientMessages.ts';
import { EventBus } from '@/game/events/EventBus.ts';

export class ServerLobby {
  #lobbyCode: string; // telemetria
  #players = new Map<string, ServerPlayer>();
  #state: GameState;
  #tournament = new Tournament();

  constructor(lobbyCode: string) {
    this.#lobbyCode = lobbyCode;
    this.#state = {
      stage: 'lobby',
      things: new Set<string>(),
      remainingReady: 0
    };

    const bus = EventBus.getInstance();

    bus.subscribe('join', this.addPlayer);
    bus.subscribe('leave', this.removePlayer);
    bus.subscribe('ready', this.playerReady);
    bus.subscribe('suggest', this.suggestThing);
    bus.subscribe('vote', this.voteFor);
  }

  get stage() {
    return this.#state.stage;
  }

  get size() {
    return this.#players.size;
  }

  #sendMsg(msg: ServerMessage, socket: WebSocket) {
    console.log('sending message', msg);
    socket.send(encode(msg));
  }

  #shoutMsg(msg: ServerMessage) {
    console.log('shouting message', msg);
    for (const { socket } of this.#players.values()) socket.send(encode(msg));
  }

  static generateRoomCode() {
    const randomIntBetween = (min: number, max: number) => {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled
      );
    };

    // A - Z in ASCII
    const getRandomChar = () => randomIntBetween(65, 90);

    const codes = new Array(6)
      .fill(0) // map doesnt work on empty arrays
      .map(getRandomChar);

    return String.fromCodePoint(...codes);
  }

  getUniqueName(name: string) {
    const createPlayerCode = () => {
      const randomInt = () => Math.ceil(Math.random() * 9);
      const code = new Array(4).fill(0).map(randomInt);
      return code.join('');
    };

    let uniqueName = name + '#' + createPlayerCode();
    while (this.#players.has(uniqueName)) {
      uniqueName = name + '#' + createPlayerCode();
    }

    return uniqueName;
  }

  addPlayer({ player, socket }: { player: string; socket: WebSocket }) {
    this.#shoutMsg({
      type: 'playerJoined',
      data: player
    });

    this.#players.set(player, { ready: false, socket });

    this.#syncPlayer(socket);
  }

  #syncPlayer(socket: WebSocket) {
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
            socket
          );

          this.#sendMsg(
            {
              type: 'allSuggestions',
              data: this.#state.things.values().toArray()
            },
            socket
          );

          this.#state.remainingReady++;
        }
        break;

      case 'game':
        {
          this.#sendMsg(
            {
              type: 'allVotes',
              data: {
                things: this.#state.votes.thingsTuple(),
                votes: this.#state.votes.votesTuple()
              }
            },
            socket
          );
        }
        break;

      case 'roundEnd': {
        this.#sendMsg(
          {
            type: 'roundEnd',
            data: { gameEnd: this.#state.gameEnd, winner: this.#state.winner }
          },
          socket
        );
      }
    }
  }

  removePlayer({ player }: { player: string }) {
    this.#shoutMsg({ type: 'playerLeft', data: player });

    this.#players.delete(player);

    if (this.#state.stage === 'game') {
      this.#state.totalVotes = this.#state.votes.removePlayer(player);

      console.log('total votes', this.#state.totalVotes);
      console.log('total players', this.#players.size);

      if (this.#state.totalVotes === this.#players.size) this.endRound();
    }

    return this.#players.size;
  }

  suggestThing({ thing }: { thing: string }) {
    if (this.#state.stage !== 'lobby') return;
    this.#shoutMsg({ type: 'newSuggestion', data: thing });
    this.#state.things.add(thing);
  }

  playerReady({ player }: { player: string }) {
    if (this.#state.stage !== 'lobby') return;

    this.#shoutMsg({ type: 'playerReady', data: player });

    const playerData = this.#players.get(player)!;
    playerData.ready = true;
    this.#players.set(player, playerData);

    this.#state.remainingReady--;

    if (this.#state.remainingReady === 0) this.startGame();
  }

  voteFor({ thing, player }: { thing: string; player: string }) {
    if (this.#state.stage !== 'game') return;

    this.#state.totalVotes = this.#state.votes.vote(thing, player);

    this.#shoutMsg({
      type: 'newVote',
      data: { player, thing }
    });

    console.log('total votes', this.#state.totalVotes);
    console.log('total players', this.#players.size);

    if (this.#state.totalVotes === this.#players.size) this.endRound();
  }

  startGame() {
    if (this.#state.stage !== 'lobby') return;
    console.log('starting game');
    this.#tournament.setup(this.#state.things);
    this.#shoutMsg({ type: 'gameStart' });
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
      totalVotes: 0,
      round: this.#tournament.currentRound,
      votes: Votes.getInstance()
    };

    this.#state.votes.startRound(things);

    this.#shoutMsg({
      type: 'roundStart',
      data: { round: this.#state.round, things }
    });
  }

  endRound() {
    if (this.#state.stage !== 'game') return;

    const winner = this.#tournament.handleMatchEnd([
      this.#state.votes.thingsTuple(),
      this.#state.votes.voteCount()
    ]);

    const round = this.#state.round;
    const gameEnd = this.#tournament.isTournamentDone;
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
    if (!gameEnd) setTimeout(() => this.startRound(), 1000);
  }
}
