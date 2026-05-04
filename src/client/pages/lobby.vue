<template>
  <header>
    <h1 class="fancytext_big">
      LOBBY - <span>{{ game.lobbyCode }}</span>
    </h1>
  </header>
  <main>
    <section class="players">
      <h2 class="fancytext_small">Jogadores</h2>
      <ul>
        <li v-for="p in game.players" :key="p.name">
          {{ p.ready ? '🟩' : '🟥' }} {{ p.name }}
        </li>
      </ul>
      <button
        @click="handleReady"
        :disabled="disabledInputs || game.things.length < 2"
        class="ready"
      >
        {{isReady ? 'Aguardando jogadores...':  'Começar partida' }}
      </button>
    </section>
    <section class="things">
      <h2 class="fancytext_small">Coisas</h2>
      <ul class="things">
        <li v-for="t in game.things" :key="t">{{ t }}</li>
      </ul>
      <div className="inputGroup">
        <input
          type="text"
          placeholder="Qual sua sugestão?"
          v-model="suggestion"
          :disabled="disabledInputs"
          @keydown="suggestOnEnter"
          required
        />
        <button
          type="button"
          @click="suggest"
          :disabled="disabledInputs || suggestion.length === 0"
        >
          Enviar
        </button>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { useLobbyStore } from '@/client/stores/lobby.ts';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onEnter } from '@/client/composables/enter.ts';
import { useGameStore } from '@/client/stores/game.ts';

const game = useGameStore();
const lobby = useLobbyStore();
const router = useRouter();

const suggestion = ref('');
const disabledInputs = ref(false);
const isReady = ref(false);

const handleReady = () => {
  disabledInputs.value = true;
  isReady.value = true;
  lobby.ready();
};

const suggest = () => {
  lobby.suggest(suggestion.value);
  suggestion.value = '';
};
const suggestOnEnter = onEnter(suggest);

lobby.setGameStartLogic(() => {
  // TODO countdown
  router.push({ name: 'game' });
});
</script>

<style src="../assets/lobby.css" scoped></style>
