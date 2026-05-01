import type {
  AllVotesMsg,
  ServerMessage
} from '@/game/server/ServerMessages.ts';
import type { ClientPlayer } from '@/game/shared/constants.ts';
import { useGameInternalStore } from '@/stores/internal.ts';
import { useVoteStore } from '@/stores/votes.ts';
import { decode } from 'msgpack';

export class GameClient {
  #game = useGameInternalStore();
  #votes = useVoteStore();

  constructor() {}

  setup() {
    this.#game.socket.addEventListener('message', e => {
      (e.data as Blob)
        .bytes()
        .then(b => this.#handleMsg(decode(b) as ServerMessage));
    });
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
  }

  #endRound(winner: string, gameEnd: boolean) {
    this.#game.winner = winner;
    this.#game.isGameEnd = gameEnd;
    this.#game.roundEndCallback();
  }

  #newSuggestion(thing: string) {
    this.#game.things.unshift(thing);
  }

  #newPlayer(name: string) {
    this.#game.players.push({ name, ready: false });
  }

  #playerReady(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players[idx]!.ready = true;
  }

  #playerLeft(name: string) {
    const idx = this.#game.players.findIndex(p => p.name === name);
    this.#game.players.splice(idx, 1);
    this.#votes.removePlayer(name);
  }

  #newVote(player: string, thing: string) {
    this.#votes.vote(thing, player);
  }

  #setSuggestions(things: string[]) {
    this.#game.things = things;
  }

  #setPlayers(players: ClientPlayer[]) {
    this.#game.players = players;
  }

  #setVotes({ things, votes }: AllVotesMsg) {
    this.#votes.setThings(things);
    this.#votes.setVotes(votes);
  }

  #handleMsg(msg: ServerMessage) {
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
