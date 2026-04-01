import { AllVotesMsg, ClientPlayer, OutMsg, Thing } from '@/game/constants.ts';
import { useGameInternalStore } from '../stores/gameInternal.ts';
import { useVotesInternalStore } from '../stores/votesInternal.ts';

export class GameClient {
  #game = useGameInternalStore();
  #votes = useVotesInternalStore();

  constructor() {
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

  #startRound(things: [Thing, Thing], round: number) {
    this.#game.round = round;
    
    this.#votes.reset();
    this.#votes.thingL = things[0];
    this.#votes.thingR = things[1];
    
    this.#game.roundStartCallback();
    console.log('new round', this.#votes.thingL, this.#votes.thingR);
  }

  #endRound(winner: string, gameEnd: boolean) {
    this.#game.winner = winner;
    this.#game.isGameEnd = gameEnd;
    this.#game.roundEndCallback();
    console.log('round winner:', winner, 'game ended:', gameEnd);
  }

  #newSuggestion(thing: string) {
    this.#game.things.push(thing);
    console.log('got suggestion', thing);
  }

  #newPlayer(name: string) {
    this.#game.players.push({ name, ready: false });
    console.log(name, 'joined');
  }

  #playerReady(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players[idx].ready = true;
  }

  #playerLeft(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players.splice(idx, 1);
    console.log(name, 'left');
  }

  #newVote(player: string, thing: Thing) {
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

  #setVotes(votes: AllVotesMsg) {
    this.#votes.setAll(votes);
    console.log('current votes:', votes);
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
