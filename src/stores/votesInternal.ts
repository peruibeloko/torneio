import type { AllVotesMsg } from "@/game/server/ServerMessages.ts";
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useVotesInternalStore = defineStore('votesInternal', () => {
  const thingL = ref('');
  const thingR = ref('');

  const votesL = ref(new Set<string>());
  const votesR = ref(new Set<string>());

  const votes = computed(() => ({
    [thingL.value]: votesL.value.values().toArray(),
    [thingR.value]: votesR.value.values().toArray()
  }));

  function reset() {
    thingL.value = '';
    thingR.value = '';
    votesL.value = new Set();
    votesR.value = new Set();
  }

  function setThings([left, right]: [string, string]) {
    thingL.value = left;
    thingR.value = right;
  }

  function vote(thing: string, player: string) {
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
