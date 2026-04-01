import { Thing } from '@/src/game/constants.ts';
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

    if (this.#winner === '') {
      const r = this.#contestants.pop()!;
      const l = this.#contestants.pop()!;
      console.log('remaining contestants', this.#contestants);
      return [l, r];
    }
    const result = [this.#winner, this.#contestants.pop()!];
    console.log('remaining contestants', this.#contestants);
    return result as [Thing, Thing];
  }

  handleMatchEnd(votes: ServerVotes) {
    const allVotes = votes.all;
    const { thingL, thingR } = allVotes;
    const votesL = allVotes.votesL.length;
    const votesR = allVotes.votesL.length;

    // handle ties
    if (votesL === votesR) {
      const prevWinner = thingL === this.#winner ? thingL : thingR;
      const newContestant = thingL === this.#winner ? thingR : thingL;
      this.#contestants = [newContestant, ...this.#contestants];
      return prevWinner;
    }

    this.#winner = votesL > votesR ? thingL : thingR;
    return this.#winner;
  }
}
