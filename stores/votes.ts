import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useVotesInternalStore } from './votesInternal.ts';

export const useVotesStore = defineStore('votes', () => {
  const internal = useVotesInternalStore();

  const things = computed(() => [internal.thingL, internal.thingR]);
  const votes = computed(() => [internal.votesL, internal.votesR]);

  return { things, votes };
});
