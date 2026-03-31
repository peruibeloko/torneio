<template>
  <dialog ref="winnerModal" id="winner">
    <h2>Vencedor{{ client.gameEnd.value ? null : ' da rodada' }}</h2>
    <span>{{ client.winner.value }}</span>
  </dialog>

  <header>
    <h1>RODADA {{ client.round }}</h1>
  </header>

  <main>
    <section>
      <span>{{ thingL }}</span>
      <button @click="vote('L')" :disabled="disabledL">VOTAR</button>
      <ul>
        <li v-for="v in votesL" :key="v">{{ v }}</li>
      </ul>
    </section>
    <div className="vbar"></div>
    <section>
      <span>{{ thingR }}</span>
      <button @click="vote('R')" :disabled="disabledR">VOTAR</button>
      <ul>
        <li v-for="v in votesR" :key="v">{{ v }}</li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import { useGameClient } from '../composables/client';

const client = useGameClient();

const [votesL, votesR] = client.votes;
const [thingL, thingR] = client.roundThings;

const disabledL = ref(false);
const disabledR = ref(false);

const winnerModal = useTemplateRef('winnerModal');

client.roundEndLogic = () => {
  winnerModal.value?.showModal();
};

client.roundStartLogic = () => {
  winnerModal.value?.close();
  disabledL.value = false;
  disabledR.value = false;
};

const vote = (thing: 'L' | 'R') => () => {
  const isL = thing === 'L';
  client.vote(isL ? thingL : thingR);
  if (isL) {
    disabledL.value = true;
    disabledR.value = false;
  } else {
    disabledL.value = false;
    disabledR.value = true;
  }
};
</script>

<style src="../assets/game.css" scoped></style>
