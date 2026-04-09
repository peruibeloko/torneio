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
    const voteL = thing === this.#thingL.value;

    if (voteL && this.#votesR.value.has(player)) {
      this.#votesR.value.delete(player);
      this.#votesL.value.add(player);
      return 0;
    }

    if (voteL) {
      this.#votesL.value.add(player);
      return 1;
    }

    if (this.#votesL.value.has(player)) {
      this.#votesL.value.delete(player);
      this.#votesR.value.add(player);
      return 0;
    }

    this.#votesR.value.add(player);
    return 1;
  }

  reset() {
    this.#thingL.value = '';
    this.#thingR.value = '';
    this.#votesL.value = new Set();
    this.#votesR.value = new Set();
  }
}
