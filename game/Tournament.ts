import { ServerVotes, Thing } from "@/game/constants.ts";
import { Queue } from "@/game/Queue.ts";

export class Tournament {
  #matches: Queue<[Thing, Thing]>;
  #round: number;
  #things: Thing[];
  /**
   * This is a FILO data structure (queue)
   *
   * ```txt
   * Matches are added first to last ---------------->>>
   * ┌────0────┬────1────┬────2────┬─────────┬────N────┐
   * │ Match N │Match N-1│Match N-2│   ...   │ Match 1 │
   * └─────────┴─────────┴─────────┴─────────┴─────────┘
   * <<<------------- Matches are consumed last to first
   * ```
   */

  constructor() {
    this.#things = [];
    this.#matches = new Queue();
    this.#round = 0;
  }

  get currentRound() {
    return this.#round;
  }

  get isTournamentDone() {
    return this.#matches.length === 0;
  }

  #shuffleArray<T>(arr: T[]) {
    const out = [...arr];
    for (let i = 0; i < out.length - 1; i++) {
      const randomPos = Math.floor(Math.random() * out.length);
      [out[i], out[randomPos]] = [out[randomPos], out[i]];
    }
    return out;
  }

  #chunk<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];

    let index = 0;
    while (index < array.length) {
      result.push(array.slice(index, index + size));
      index += size;
    }

    return result;
  }

  setup(things: Thing[]) {
    const input = this.#shuffleArray(this.#things);
    const [byeRounds, remaining] = this.#setupByeRounds(input);

    // setup remaining rounds
    while (remaining.length !== 0) {
      this.#matches.nq([remaining.pop()!, remaining.pop()!]);
    }

    this.#matches.nq(...byeRounds);
  }

  #setupByeRounds(things: Thing[]) {
    const thingCount = things.length;

    // next power of 2 bigger than bandCount
    const fullBracket = 2 ** Math.ceil(Math.log2(thingCount));
    const byeCount = fullBracket - thingCount;

    if (byeCount === 0) return [];

    const byes: Thing[] = [];

    // get <byeCount> random bands
    for (let i = 0; i < byeCount; i++) {
      byes.push(things.pop()!);
    }

    // store <byes/2> pairs into #matches
    const byeRounds = this.#chunk(byes, 2);

    if (byeRounds.at(-1)?.length === 1) {
      byeRounds.at(-1)?.push("" as Thing);
    }

    return [byeRounds, things] as [[Thing, Thing][], Thing[]];
  }

  getNextMatch(): [Thing, Thing] {
    this.#round++;
    let [thingL, thingR] = this.#matches.dq();

    if (thingR === "") {
      this.#matches.nq([thingL, thingR]);
      [thingL, thingR] = this.#matches.dq();
    }

    return [thingL, thingR];
  }

  handleMatchEnd(votes: ServerVotes) {
    const nothing = "" as Thing;
    const [thingL, thingR] = Object.keys(votes) as [Thing, Thing];
    const votesL = votes[thingL].length;
    const votesR = votes[thingR].length;

    // handle ties
    if (votesL === votesR) {
      this.#matches.nq([thingL, thingR]);
      return null;
    }

    const winner = votesL > votesR ? thingL : thingR;

    // if tournament has a match awaiting a competitor fill it in
    const lastMatch = this.#matches.peekLast();
    if (lastMatch[1] === "") this.#matches.setLast([lastMatch[0], winner]);
    // if not, we create a new match
    else this.#matches.nq([winner, nothing]);

    return winner;
  }
}
