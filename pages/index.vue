<template>
  <header>
    <h1>BEM VINDO AO TORNEIO DAS COISAS</h1>
  </header>
  <main>
    <input
      type="text"
      placeholder="Como quer ser chamado?"
      v-model="internal.playerName"
    />
    <section>
      <div class="side">
        <h2>Entrar em uma sala</h2>
        <input
          type="text"
          placeholder="Código de sala"
          v-model="internal.lobbyCode"
          @keydown="onEnter(joinLobby)"
        />
        <button id="joinLobby" type="button" @click="joinLobby">Entrar</button>
      </div>
      <div class="vbar"></div>
      <div class="side">
        <h2>Criar uma nova sala</h2>
        <button id="createLobby" @click="createLobby">Criar</button>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onEnter } from '../composables/enter.ts';
import { useGameStore } from '../stores/game.ts';
import { useGameInternalStore } from '../stores/gameInternal.ts';

const router = useRouter();
const game = useGameStore();
const internal = useGameInternalStore();

const joinLobby = async () => {
  const stage = await game.joinLobby(internal.playerName, internal.lobbyCode);
  if (stage === 'lobby') return router.push({ name: 'lobby' });
  router.push({ name: 'game' });
};

const createLobby = async () => {
  const lobbyCode = await game.createLobby();
  await game.joinLobby(internal.playerName, lobbyCode);
  router.push({ name: 'lobby' });
};
</script>

<style src="../assets/home.css" scoped></style>
