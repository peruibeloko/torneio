<template>
  <dialog ref="winnerModal" id="winner">
    <h2>Vencedor{{ game.gameEnd ? null : ' da rodada' }}</h2>
    <span>{{ game.winner }}</span>
  </dialog>

  <header>
    <h1>RODADA {{ game.round }}</h1>
  </header>

  <main>
    <section>
      <span>{{ internal.thingL }}</span>
      <button @click="voteL" :disabled="disabledL">VOTAR</button>
      <ul>
        <li v-for="v in internal.votesL" :key="v">{{ v }}</li>
      </ul>
    </section>
    <div className="vbar"></div>
    <section>
      <span>{{ internal.thingR }}</span>
      <button @click="voteR" :disabled="disabledR">VOTAR</button>
      <ul>
        <li v-for="v in internal.votesR" :key="v">{{ v }}</li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { useGameStore } from '../stores/game';
import { useVotesInternalStore } from '../stores/votesInternal';

const game = useGameStore();
const internal = useVotesInternalStore();

const disabledL = ref(false);
const disabledR = ref(false);

const winnerModal = useTemplateRef('winnerModal');

game.roundEndLogic(() => {
  winnerModal.value?.showModal();
});

game.roundStartLogic(() => {
  winnerModal.value?.close();
  disabledL.value = false;
  disabledR.value = false;
});

const voteL = () => {
  game.vote(internal.thingL);
  disabledL.value = true;
  disabledR.value = false;
};

const voteR = () => {
  game.vote(internal.thingR);
  disabledL.value = false;
  disabledR.value = true;
};
</script>

<style src="../assets/game.css" scoped></style>
