<template>
  <header>
    <h1>LOBBY</h1>
  </header>
  <main>
    <div>
      <section>
        <h2>Jogadores</h2>
        <ul>
          <li v-for="p in client.players.value" :key="p">{{ p }}</li>
        </ul>
      </section>
      <div className="vbar"></div>
      <section>
        <h2>Coisas</h2>
        <div className="inputgroup">
          <input
            type="text"
            placeholder="Qual sua sugestão?"
            v-model="suggestion"
            @keydown="onEnter(suggest)"
          />
          <button type="button" @click="suggest">Enviar</button>
        </div>
        <ul>
          <li v-for="t in client.things.value" :key="t">{{ t }}</li>
        </ul>
      </section>
    </div>
    <button @click="client.ready">ESTOU PRONTO!</button>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useGameClient } from '../composables/client.ts';
import { onEnter } from '../composables/enter.ts';

const client = useGameClient();

const suggestion = ref('');
const suggest = () => {
  client.suggest(suggestion.value);
  suggestion.value = '';
};
</script>

<style src="../assets/lobby.css" scoped></style>
