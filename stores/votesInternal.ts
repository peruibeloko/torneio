import { defineStore } from 'pinia';
import { AllVotesMsg, Thing } from '../game/constants.ts';
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
    votesL.value = new Set();
    votesR.value = new Set();
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

  function setAll(all: AllVotesMsg) {
    thingL.value = all.thingL;
    thingR.value = all.thingR;
    votesL.value = new Set(all.votesL);
    votesR.value = new Set(all.votesR);
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
    setAll
  };
});
