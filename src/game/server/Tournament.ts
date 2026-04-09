import { ThingTuple, VotesTuple } from '@/game/shared/votes.ts';

export class Tournament {
  #round: number;
  #contestants: string[];
  #winner: string;

  constructor() {
    this.#contestants = [];
    this.#winner = '';
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

  setup(things: string[]) {
    this.#contestants = this.#shuffleArray(things);
  }

  getNextMatch() {
    this.#round++;

    const l = this.#winner ? this.#winner : this.#contestants.pop()!;
    const r = this.#contestants.pop()!;

    return [l, r] as [string, string];
  }

  handleMatchEnd([things, votes]: [ThingTuple, VotesTuple]) {
    const [thingL, thingR] = things;

    const votesL = votes[0].length;
    const votesR = votes[1].length;

    console.log(
      'round result: %s (%d) x %s (%d)',
      thingL,
      votesL,
      thingR,
      votesR
    );

    if (votesL === votesR) {
      if (this.#contestants.length === 0) {
        this.#contestants = [thingR, thingL];
        return null;
      }

      const newContestant = thingL === this.#winner ? thingR : thingL;
      this.#contestants = [newContestant, ...this.#contestants];
      return null;
    }

    this.#winner = votesL > votesR ? thingL : thingR;
    return this.#winner;
  }
}
