import { Thing } from '@/game/shared/constants.ts';
import { ServerVotes } from '@/game/ServerVotes.ts';

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

  getNextMatch() {
    this.#round++;

    const l = this.#winner ? this.#winner : this.#contestants.pop()!;
    const r = this.#contestants.pop()!;

    return [l, r] as [Thing, Thing];
  }

  handleMatchEnd(votes: ServerVotes) {
    const allVotes = votes.votes;
    const [thingL, thingR] = votes.things;

    const votesL = allVotes[thingL].length;
    const votesR = allVotes[thingR].length;

    // handle ties
    if (votesL === votesR) {
      const newContestant = thingL === this.#winner ? thingR : thingL;
      this.#contestants = [newContestant, ...this.#contestants];
      return null;
    }

    this.#winner = votesL > votesR ? thingL : thingR;
    return this.#winner;
  }
}
