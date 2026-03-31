<template>
  <header>
    <h1>BEM VINDO AO TORNEIO DAS COISAS</h1>
  </header>
  <main>
    <input
      type="text"
      placeholder="Como quer ser chamado?"
      v-model="playerName"
    />
    <section>
      <div class="side">
        <h2>Entrar em uma sala</h2>
        <input
          type="text"
          placeholder="Código de sala"
          v-model="lobbyCode"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameClient } from '../composables/client.ts';
import { onEnter } from '../composables/enter.ts';

const client = useGameClient();
const router = useRouter();
const playerName = ref('');
const lobbyCode = ref('');

const joinLobby = () => {
  client.joinLobby(playerName.value, lobbyCode.value);
  router.push({ name: 'lobby' });
};

const createLobby = async () => {
  const lobbyCode = await client.createLobby(playerName.value);
  client.joinLobby(playerName.value, lobbyCode);
  router.push({ name: 'lobby' });
};
</script>

<style src="../assets/home.css" scoped></style>
