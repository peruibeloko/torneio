import { defineStore } from 'pinia';
import { Thing } from '../game/constants.ts';
import { ref } from 'vue';
import { computed } from 'vue';

export const useVotesInternalStore = defineStore('votesInternal', () => {
  const thingL = ref('' as Thing);
  const thingR = ref('' as Thing);

  const votesL = ref(new Set() as Set<string>);
  const votesR = ref(new Set() as Set<string>);

  const votes = computed(() => ({
    [thingL.value]: votesL.value.values().toArray(),
    [thingR.value]: votesR.value.values().toArray()
  }));

  function reset() {
    thingL.value = '' as Thing;
    thingR.value = '' as Thing;
    votesL.value.clear();
    votesR.value.clear();
  }

  function setThings([left, right]: [Thing, Thing]) {
    thingL.value = left;
    thingR.value = right;
  }

  function vote(thing: Thing, player: string) {
    if (thing === thingL.value) {
      votesR.value.delete(player);
      votesL.value.add(player);
      return;
    }

    votesL.value.delete(player);
    votesR.value.add(player);
  }

  function setVotes(left: [Thing, string[]], right: [Thing, string[]]) {
    thingL.value = left[0];
    thingR.value = right[0];
    votesL.value = new Set(left[1]);
    votesR.value = new Set(right[1]);
  }

  return {
    thingL,
    thingR,
    votesL,
    votesR,
    votes,
    reset,
    setThings,
    vote,
    setVotes
  };
});
