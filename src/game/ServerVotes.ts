import { SERVFAIL } from 'node:dns';
import type { Thing } from './constants.ts';

export class ServerVotes {
  #thingL = '' as Thing;
  #thingR = '' as Thing;
  #votesL = new Set() as Set<string>;
  #votesR = new Set() as Set<string>;

  constructor(thingL: Thing, thingR: Thing) {
    this.#thingL = thingL;
    this.#thingR = thingR;
  }

  get things() {
    return [this.#thingL, this.#thingR]
  }

  get votes() {
    return {
      [this.#thingL]: this.#votesL.values().toArray(),
      [this.#thingR]: this.#votesR.values().toArray()
    };
  }

  get all() {
    return {
      thingL: this.#thingL,
      thingR: this.#thingR,
      votesL: this.#votesL.values().toArray(),
      votesR: this.#votesR.values().toArray()
    };
  }

  reset() {
    this.#thingL = '' as Thing;
    this.#thingR = '' as Thing;
    this.#votesL = new Set();
    this.#votesR = new Set();
  }

  setThing(which: 'l' | 'r', thing: Thing) {
    if (which === 'l') this.#thingL = thing;
    else this.#thingR = thing;
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

  setVotes(thingL: Thing, votesL: string[], thingR: Thing, votesR: string[]) {
    this.#thingL = thingL;
    this.#thingR = thingR;
    this.#votesL = new Set(votesL);
    this.#votesR = new Set(votesR);
  }
}
