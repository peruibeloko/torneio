import { computed, ref } from 'vue';

export type ThingTuple = [thingL: string, thingR: string];
export type VotesTuple = [votesL: string[], votesR: string[]];

export const voteState = () => Votes.instance;

export class Votes {
  #thingL = ref('');
  #thingR = ref('');
  #votesL = ref(new Set<string>());
  #votesR = ref(new Set<string>());

  private constructor() {}

  static #instance: Votes;

  static get instance() {
    if (!Votes.#instance) Votes.#instance = new Votes();
    return Votes.#instance;
  }

  get thingsTuple() {
    return computed(
      () => [this.#thingL.value, this.#thingR.value] as ThingTuple
    );
  }
  get votesTuple() {
    return computed(
      () =>
        [
          this.#votesL.value.values().toArray(),
          this.#votesR.value.values().toArray()
        ] as VotesTuple
    );
  }
  get votesDict() {
    return computed(() => ({
      [this.#thingL.value]: this.#votesL.value.values().toArray(),
      [this.#thingR.value]: this.#votesR.value.values().toArray()
    }));
  }

  setThings([left, right]: [string, string]) {
    this.#thingL.value = left;
    this.#thingR.value = right;
  }

  setVotes([left, right]: [string[], string[]]) {
    this.#votesL.value = new Set(left);
    this.#votesR.value = new Set(right);
  }

  vote(thing: string, player: string) {
    if (thing === this.#thingL.value) {
      this.#votesR.value.delete(player);
      this.#votesL.value.add(player);
      return;
    }

    this.#votesL.value.delete(player);
    this.#votesR.value.add(player);
  }

  reset() {
    this.#thingL.value = '';
    this.#thingR.value = '';
    this.#votesL.value = new Set();
    this.#votesR.value = new Set();
  }
}
