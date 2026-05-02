export type ThingTuple = [thingL: string, thingR: string];
export type VotesTuple = [votesL: number, votesR: number];

export type VotesChangeCb = (votes: VotesTuple) => void;
export type ThingsChangeCb = (things: ThingTuple) => void;

export const voteState = () => Votes.instance;

export class Votes {
  #thingL = '';
  #thingR = '';
  #votesL = new Set<string>();
  #votesR = new Set<string>();
  #total = new Set<string>();

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
    return [this.#votesL.size, this.#votesR.size] as VotesTuple;
  }

  setThings([left, right]: [string, string]) {
    this.#thingL = left;
    this.#thingR = right;
  }

  removePlayer(player: string) {
    this.#votesL.delete(player);
    this.#votesR.delete(player);
  }

  vote(thing: string, player: string) {
    const isVoteForL = thing === this.#thingL;

    this.#total.add(player);

    if (isVoteForL) {
      this.#votesR.delete(player);
      this.#votesL.add(player);
    } else {
      this.#votesL.delete(player);
      this.#votesR.add(player);
    }

    return this.#total.size;
  }
}
