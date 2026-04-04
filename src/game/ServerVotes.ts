export class ServerVotes {
  #thingL = '';
  #thingR = '';
  #votesL = new Set<string>();
  #votesR = new Set<string>();

  constructor(thingL: string, thingR: string) {
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
    this.#thingL = '';
    this.#thingR = '';
    this.#votesL = new Set();
    this.#votesR = new Set();
  }

  setThing(which: 'l' | 'r', thing: string) {
    if (which === 'l') this.#thingL = thing;
    else this.#thingR = thing;
  }

  vote(thing: string, player: string) {
    if (thing === this.#thingL) {
      this.#votesR.delete(player);
      this.#votesL.add(player);
      return;
    }

    this.#votesL.delete(player);
    this.#votesR.add(player);
  }

  setVotes(thingL: string, votesL: string[], thingR: string, votesR: string[]) {
    this.#thingL = thingL;
    this.#thingR = thingR;
    this.#votesL = new Set(votesL);
    this.#votesR = new Set(votesR);
  }
}
