import { Thing } from '@/game/constants.ts';
import { ServerVotes } from './ServerVotes.ts';

export class Tournament {
  #round: number;
  #contestants: Thing[];
  #winner: Thing;

  constructor() {
    this.#contestants = [];
    this.#winner = '' as Thing;
    this.#round = 0;
  }

  get currentRound() {
    return this.#round;
  }

  get isTournamentDone() {
    return this.#contestants.length === 0;
  }

  #shuffleArray<T>(arr: T[]) {
    const out = [...arr];
    for (let i = 0; i < out.length - 1; i++) {
      const randomPos = Math.floor(Math.random() * out.length);
      [out[i], out[randomPos]] = [out[randomPos], out[i]];
    }
    return out;
  }

  setup(things: Thing[]) {
    this.#contestants = this.#shuffleArray(things);
  }

  getNextMatch(): [Thing, Thing] {
    this.#round++;
    if (this.#winner === '')
      return [this.#contestants.pop()!, this.#contestants.pop()!];
    return [this.#winner, this.#contestants.pop()!];
  }

  handleMatchEnd(votes: ServerVotes) {
    const allVotes = votes.votes;
    const [thingL, thingR] = Object.keys(allVotes) as [Thing, Thing];
    const votesL = allVotes[thingL].length;
    const votesR = allVotes[thingR].length;

    // handle ties
    if (votesL === votesR) {
      const prevWinner = thingL === this.#winner ? thingL : thingR;
      const newContestant = thingL === this.#winner ? thingR : thingL;
      this.#contestants.unshift(newContestant);
      return prevWinner;
    }

    this.#winner = votesL > votesR ? thingL : thingR;
    return this.#winner;
  }
}
