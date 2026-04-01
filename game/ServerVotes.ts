import { Thing } from './constants.ts';

export class ServerVotes {
  #thingL = '' as Thing;
  #thingR = '' as Thing;
  #votesL = new Set() as Set<string>;
  #votesR = new Set() as Set<string>;

  constructor(thingL: Thing, thingR: Thing) {
    this.#thingL = thingL;
    this.#thingR = thingR;
  }

  get votes() {
    return {
      [this.#thingL]: this.#votesL.values().toArray(),
      [this.#thingR]: this.#votesR.values().toArray()
    };
  }

  reset() {
    this.#thingL = '' as Thing;
    this.#thingR = '' as Thing;
    this.#votesL.clear();
    this.#votesR.clear();
  }

  setThings([left, right]: [Thing, Thing]) {
    this.#thingL = left;
    this.#thingR = right;
  }

  vote(thing: Thing, player: string) {
    if (thing === this.#thingL) {
      this.#votesR.delete(player);
      this.#votesL.add(player);
      return;
    }

    this.#votesL.delete(player);
    this.#votesR.add(player);
  }

  setVotes(left: [Thing, string[]], right: [Thing, string[]]) {
    this.#thingL = left[0];
    this.#thingR = right[0];
    this.#votesL = new Set(left[1]);
    this.#votesR = new Set(right[1]);
  }
}
