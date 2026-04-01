<template>
  <header>
    <h1>LOBBY ({{ game.lobbyCode }})</h1>
  </header>
  <main>
    <div>
      <section>
        <h2>Jogadores</h2>
        <ul>
          <li v-for="p in game.players" :key="p.name">
            {{ p.name }}{{ p.ready ? '🟩' : '🟥' }}
          </li>
        </ul>
      </section>
      <div className="vbar"></div>
      <section>
        <h2>Coisas</h2>
        <ul class="things">
          <li v-for="t in game.things" :key="t">{{ t }}</li>
        </ul>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="Qual sua sugestão?"
            v-model="suggestion"
            @keydown="suggestOnEnter"
          />
          <button type="button" @click="suggest">Enviar</button>
        </div>
      </section>
    </div>
    <button id="ready" @click="game.ready">ESTOU PRONTO!</button>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { onEnter } from '../composables/enter.ts';
import { useGameStore } from '../stores/game.ts';

const game = useGameStore();
const router = useRouter();

const suggestion = ref('');

const suggest = () => {
  console.log('suggesting', suggestion.value);

  game.suggest(suggestion.value);
  suggestion.value = '';
};
const suggestOnEnter = onEnter(suggest);

game.gameStartLogic(() => {
  // TODO countdown
  router.push({ name: 'game' });
});
</script>

<style src="../assets/lobby.css" scoped></style>
