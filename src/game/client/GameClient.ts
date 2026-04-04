import type { AllVotesMsg, OutMsg } from '@/game/server/ServerMessages.ts';
import type { ClientPlayer } from '@/game/shared/constants.ts';
import { voteState } from '@/game/shared/votes.ts';
import { useGameInternalStore } from '@/stores/internal.ts';

export class GameClient {
  #game = useGameInternalStore();
  #votes = voteState();

  constructor() {}

  setup() {
    this.#game.socket.addEventListener('message', e =>
      this.#handleMsg(JSON.parse(e.data))
    );
  }

  #updateInfo(uniqueName: string) {
    this.#game.playerName = uniqueName;
  }

  #startGame() {
    this.#game.gameStartCallback();
  }

  #startRound(things: [string, string], round: number) {
    this.#game.round = round;

    this.#votes.reset();
    this.#votes.setThings(things);

    this.#game.roundStartCallback();
    console.log('new round', this.#votes.thingsTuple);
  }

  #endRound(winner: string, gameEnd: boolean) {
    this.#game.winner = winner;
    this.#game.isGameEnd = gameEnd;
    this.#game.roundEndCallback();
    console.log('round winner:', winner, 'game ended:', gameEnd);
  }

  #newSuggestion(thing: string) {
    this.#game.things.unshift(thing);
    console.log('got suggestion', thing);
  }

  #newPlayer(name: string) {
    this.#game.players.push({ name, ready: false });
    console.log(name, 'joined');
  }

  #playerReady(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players[idx]!.ready = true;
  }

  #playerLeft(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players.splice(idx, 1);
    console.log(name, 'left');
  }

  #newVote(player: string, thing: string) {
    this.#votes.vote(thing, player);
    console.log(player, 'voted for', thing);
  }

  #setSuggestions(things: string[]) {
    this.#game.things = things;
    console.log('suggestions so far:', things);
  }

  #setPlayers(players: ClientPlayer[]) {
    this.#game.players = players;
    console.log('current players:', players);
  }

  #setVotes({ things, votes }: AllVotesMsg) {
    this.#votes.setThings(things);
    this.#votes.setVotes(votes);

    console.log('current votes:', { things, votes });
  }

  #handleMsg(msg: OutMsg) {
    switch (msg.type) {
      case 'allPlayers':
        this.#setPlayers(msg.data);
        break;

      case 'allVotes':
        this.#setVotes(msg.data);
        break;

      case 'allSuggestions':
        this.#setSuggestions(msg.data);
        break;

      case 'playerJoined':
        this.#newPlayer(msg.data);
        break;

      case 'playerReady':
        this.#playerReady(msg.data);
        break;

      case 'playerLeft':
        this.#playerLeft(msg.data);
        break;

      case 'newVote':
        this.#newVote(msg.data.player, msg.data.thing);
        break;

      case 'newSuggestion':
        this.#newSuggestion(msg.data);
        break;

      case 'gameStart':
        this.#startGame();
        break;

      case 'gameInfo':
        this.#updateInfo(msg.data.uniqueName);
        break;

      case 'roundStart':
        this.#startRound(msg.data.things, msg.data.round);
        break;

      case 'roundEnd':
        this.#endRound(msg.data.winner, msg.data.gameEnd);
        break;
    }
  }
}
