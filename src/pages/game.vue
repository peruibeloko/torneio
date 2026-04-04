<template>
  <dialog ref="winnerModal" id="winner">
    <h2>Vencedor{{ game.gameEnd ? null : ' da rodada' }}</h2>
    <span>{{ game.winner }}</span>
  </dialog>

  <header>
    <h1>RODADA {{ game.round }}</h1>
    <h2>{{ game.lobbyCode }}</h2>
  </header>

  <main>
    <section>
      <span>{{ thingsTuple[0] }}</span>
      <button @click="voteL" :disabled="disabledL">VOTAR</button>
      <ul>
        <li v-for="v in votesTuple[0]" :key="v">{{ v }}</li>
      </ul>
    </section>
    <div className="vbar"></div>
    <section>
      <span>{{ thingsTuple[1] }}</span>
      <button @click="voteR" :disabled="disabledR">VOTAR</button>
      <ul>
        <li v-for="v in votesTuple[1]" :key="v">{{ v }}</li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { voteState } from '@/game/shared/votes';
import { ref, useTemplateRef } from 'vue';
import { useGameStore } from '@/stores/game';

const game = useGameStore();

const votes = voteState();
const thingsTuple = votes.thingsTuple;
const votesTuple = votes.votesTuple;

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
  game.vote(thingsTuple.value[0]);
  disabledL.value = true;
  disabledR.value = false;
};

const voteR = () => {
  game.vote(thingsTuple.value[1]);
  disabledL.value = false;
  disabledR.value = true;
};
</script>

<style src="../assets/game.css" scoped></style>
