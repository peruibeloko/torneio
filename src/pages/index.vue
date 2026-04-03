<template>
  <header>
    <h1>BEM VINDO AO TORNEIO DAS COISAS</h1>
  </header>
  <main>
    <input
      type="text"
      placeholder="Como quer ser chamado?"
      :disabled="disableButtons"
      v-model.trim="internal.playerName"
      required
    />
    <section>
      <div class="side">
        <h2>Entrar em uma sala</h2>
        <div class="inputGroup">
          <input
            :disabled="disableButtons"
            type="text"
            placeholder="Código de sala"
            v-model.trim="internal.lobbyCode"
            @keydown="onEnter(joinLobby)"
            required
          />
          <button
            id="joinLobby"
            type="button"
            @click="joinLobby"
            :disabled="disableButtons || !isCodeValid"
          >
            Entrar
          </button>
        </div>
      </div>
      <div class="vbar"></div>
      <div class="side">
        <h2>Criar uma nova sala</h2>
        <button
          id="createLobby"
          @click="createLobby"
          :disabled="disableButtons || !isNameValid"
        >
          Criar
        </button>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { onEnter } from '../composables/enter.ts';
import { useGameStore } from '../stores/game.ts';
import { useGameInternalStore } from '../stores/gameInternal.ts';
import { computed, ref } from 'vue';

const router = useRouter();
const game = useGameStore();
const internal = useGameInternalStore();
const disableButtons = ref(false);

const isCodeValid = computed(() => /[A-Z]{6}/.test(internal.lobbyCode));
const isNameValid = computed(() => internal.playerName.length > 0);

const joinLobby = async () => {
  if (!isCodeValid) return false;
  if (!isNameValid) return false;

  disableButtons.value = true;
  const stage = await game.joinLobby(internal.playerName, internal.lobbyCode);
  if (stage === 'lobby') return router.push({ name: 'lobby' });
  router.push({ name: 'game' });
};

const createLobby = async () => {
  if (!isNameValid) return false;

  disableButtons.value = true;
  const lobbyCode = await game.createLobby();
  await game.joinLobby(internal.playerName, lobbyCode);
  router.push({ name: 'lobby' });
};
</script>

<style src="../assets/home.css" scoped></style>
