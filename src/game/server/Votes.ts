export type ThingTuple = [thingL: string, thingR: string];
export type VotesTuple = [votesL: string[], votesR: string[]];

export type VotesChangeCb = (votes: VotesTuple) => void;
export type ThingsChangeCb = (things: ThingTuple) => void;

export const voteState = () => Votes.instance;

export class Votes {
  #thingL = '';
  #thingR = '';
  #votesL = new Set<string>();
  #votesR = new Set<string>();

  private constructor() {}

  static #instance: Votes;

  static get instance() {
    if (!Votes.#instance) Votes.#instance = new Votes();
    return Votes.#instance;
  }

  thingsTuple() {
    return [this.#thingL, this.#thingR] as ThingTuple;
  }

  votesTuple() {
    return [
      this.#votesL.values().toArray(),
      this.#votesR.values().toArray()
    ] as VotesTuple;
  }

  votesDict() {
    return {
      [this.#thingL]: this.#votesL.values().toArray(),
      [this.#thingR]: this.#votesR.values().toArray()
    };
  }

  setThings([left, right]: [string, string]) {
    this.#thingL = left;
    this.#thingR = right;
  }

  setVotes([left, right]: [string[], string[]]) {
    this.#votesL = new Set(left);
    this.#votesR = new Set(right);    
  }

  removePlayer(player: string) {
    this.#votesL.delete(player);
    this.#votesR.delete(player);
  }

  vote(thing: string, player: string) {
    const voteL = thing === this.#thingL;

    if (voteL && this.#votesR.has(player)) {
      this.#votesR.delete(player);
      this.#votesL.add(player);
      return 0;
    }

    if (voteL) {
      this.#votesL.add(player);
      return 1;
    }

    if (this.#votesL.has(player)) {
      this.#votesL.delete(player);
      this.#votesR.add(player);
      return 0;
    }

    this.#votesR.add(player);
    return 1;
  }

  reset() {
    this.#thingL = '';
    this.#thingR = '';
    this.#votesL.clear();
    this.#votesR.clear();
  }
}
