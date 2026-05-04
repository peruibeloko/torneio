import { ThingTuple } from '@/game/server/Votes.ts';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useVoteStore = defineStore('votes', () => {
  const thingL = ref('');
  const thingR = ref('');
  const votesL = ref(new Set<string>());
  const votesR = ref(new Set<string>());

  function setThings([left, right]: ThingTuple) {
    thingL.value = left;
    thingR.value = right;
  }

  function setVotes([left, right]: [string[], string[]]) {
    votesL.value = new Set(left);
    votesR.value = new Set(right);
  }

  function removePlayer(player: string) {
    votesL.value.delete(player);
    votesR.value.delete(player);
  }

  function vote(thing: string, player: string) {
    const isVoteL = thing === thingL.value;

    if (isVoteL && votesR.value.has(player)) {
      votesR.value.delete(player);
      votesL.value.add(player);
      return 0;
    }

    if (isVoteL) {
      votesL.value.add(player);
      return 1;
    }

    if (votesL.value.has(player)) {
      votesL.value.delete(player);
      votesR.value.add(player);
      return 0;
    }

    votesR.value.add(player);
    return 1;
  }

  function reset() {
    thingL.value = '';
    thingR.value = '';
    votesL.value.clear();
    votesR.value.clear();
  }

  return {
    thingL,
    thingR,
    votesL,
    votesR,
    setThings,
    setVotes,
    removePlayer,
    vote,
    reset
  };
});
