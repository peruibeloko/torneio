<template>
  <dialog ref="winnerModal" id="winner">
    <span class="left">🎉 </span
    ><span class="fancytext_tiny"
      >Vencedor{{ game.gameEnd ? null : ' da rodada' }}</span
    ><span> 🎉</span>
    <h2 class="fancytext_big">{{ game.winner }}</h2>
  </dialog>

  <header>
    <h1 class="fancytext_big">RODADA {{ game.round }}</h1>
    <h2 class="fancytext_tiny">{{ game.lobbyCode }}</h2>
  </header>

  <main>
    <section>
      <span class="fancytext_mid">{{ votes.thingL }}</span>
      <button @click="voteL" :disabled="disabledL">VOTAR</button>
      <ul>
        <li class="fancytext_tiny" v-for="v in votes.votesL" :key="v">
          {{ v }}
        </li>
      </ul>
    </section>
    <section>
      <span class="fancytext_mid">{{ votes.thingR }}</span>
      <button @click="voteR" :disabled="disabledR">VOTAR</button>
      <ul>
        <li class="fancytext_tiny" v-for="v in votes.votesR" :key="v">
          {{ v }}
        </li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { useGameStore } from '@/client/stores/game';
import { useVoteStore } from '@/client/stores/votes';
import { ClientEventBus } from '@/game/client/ClientEventBus';
import { ref, useTemplateRef } from 'vue';

const game = useGameStore();
const votes = useVoteStore();

const disabledL = ref(false);
const disabledR = ref(false);

const winnerModal = useTemplateRef('winnerModal');

ClientEventBus.getBus().subscribe('roundEnd', () => {
  winnerModal.value?.showModal();
});

ClientEventBus.getBus().subscribe('roundStart', () => {
  winnerModal.value?.close();
  disabledL.value = false;
  disabledR.value = false;
});

const voteL = () => {
  game.client.vote(votes.thingL);
  disabledL.value = true;
  disabledR.value = false;
};

const voteR = () => {
  game.client.vote(votes.thingR);
  disabledL.value = false;
  disabledR.value = true;
};
</script>

<style src="@/client/assets/game.css" scoped></style>
