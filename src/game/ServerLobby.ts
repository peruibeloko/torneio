import { GameState, ServerPlayer, Thing } from '@/game/shared/constants.ts';
import { Tournament } from '@/game/Tournament.ts';
import { ServerVotes } from '@/game/ServerVotes.ts';
import { OutMsg } from '@/game/server/ServerMessages.ts';

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

  #sendMsg(msg: OutMsg, socket: WebSocket) {
    console.log('sending message', msg);
    socket.send(JSON.stringify(msg));
  }

  #shoutMsg(msg: OutMsg) {
    console.log('shouting message', msg);
    for (const { socket } of this.#players.values())
      socket.send(JSON.stringify(msg));
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
            { type: 'allVotes', data: this.#state.votes.all },
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
      data: { player, thing }
    });

    this.#state.votes.vote(thing, player);
    this.#state.totalVotes += 1;

    console.log('total votes', this.#state.totalVotes);
    console.log('total players', this.#players.size);

    if (this.#state.totalVotes === this.#players.size) this.endRound();
  }

  startGame() {
    if (this.#state.stage !== 'lobby') return;
    console.log('starting game');
    this.#tournament.setup(this.#state.things as Thing[]);
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
      votes: new ServerVotes(things[0], things[1])
    };

    this.#shoutMsg({
      type: 'roundStart',
      data: { round: this.#state.round, things }
    });
  }

  endRound() {
    if (this.#state.stage !== 'game') return;

    const winner = this.#tournament.handleMatchEnd(this.#state.votes);

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
