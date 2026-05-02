import type { ServerMessage } from '@/game/server/ServerMessages.ts';
import { Tournament } from '@/game/server/Tournament.ts';
import { voteState } from '@/game/server/Votes.ts';
import type { GameState, ServerPlayer } from '@/game/shared/constants.ts';
import { encode } from 'msgpack';

export class ServerLobby {
  #lobbyCode: string;
  #players = new Map<string, ServerPlayer>();
  #state: GameState;
  #tournament = new Tournament();

  constructor(lobbyCode: string) {
    this.#lobbyCode = lobbyCode;
    this.#state = {
      stage: 'lobby',
      things: [],
      remainingReady: 0
    };
  }

  #sendMsg(msg: ServerMessage, socket: WebSocket) {
    console.log('sending message', msg);
    socket.send(encode(msg));
  }

  #shoutMsg(msg: ServerMessage) {
    console.log('shouting message', msg);
    for (const { socket } of this.#players.values()) socket.send(encode(msg));
  }

  get stage() {
    return this.#state.stage;
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

  addPlayer(name: string, player: ServerPlayer) {
    this.#shoutMsg({
      type: 'playerJoined',
      data: name
    });

    this.#players.set(name, player);

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
            {
              type: 'allVotes',
              data: {
                things: this.#state.votes.thingsTuple(),
                votes: this.#state.votes.votesTuple()
              }
            },
            player.socket
          );
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
    this.#shoutMsg({ type: 'playerLeft', data: player });

    this.#players.delete(player);

    if (this.#state.stage === 'game') {
      this.#state.votes.removePlayer(player);
      this.#state.totalVotes -= 1;

      if (this.#state.totalVotes === this.#players.size) this.endRound();
    }

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

  voteFor(thing: string, player: string) {
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
    this.#tournament.setup(this.#state.things as string[]);
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

    const votes = voteState();
    votes.setThings(things);

    this.#state = {
      stage: 'game',
      totalVotes: 0,
      round: this.#tournament.currentRound,
      votes: votes
    };

    this.#shoutMsg({
      type: 'roundStart',
      data: { round: this.#state.round, things }
    });
  }

  endRound() {
    if (this.#state.stage !== 'game') return;

    const winner = this.#tournament.handleMatchEnd([
      this.#state.votes.thingsTuple(),
      this.#state.votes.votesTuple()
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
