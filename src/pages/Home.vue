<template>
  <header>
    <h1 class="fancytext_big">BEM VINDO AO TORNEIO DAS COISAS</h1>
  </header>
  <main>
    <input
      type="text"
      placeholder="Como quer ser chamado?"
      :disabled="disableButtons"
      v-model.trim="playerName"
      required
    />
    <section class="join">
      <div class="side">
        <h2 class="fancytext_small">Entrar em uma sala</h2>
        <div class="inputGroup">
          <input
            :disabled="disableButtons"
            type="text"
            placeholder="ABCXYZ"
            v-model.trim="lobbyCode"
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
      <span>OU</span>
      <div class="side">
        <h2 class="fancytext_small">Criar uma nova sala</h2>
        <button
          id="createLobby"
          @click="createLobby"
          :disabled="disableButtons || !isNameValid"
        >
          Criar
        </button>
      </div>
    </section>
    <hr />
    <section class="howto">
      <h3 class="fancytext_small">Como que funciona?</h3>
      <ol>
        <li>Escolha seu nome</li>
        <li>Entre ou crie uma sala</li>
        <li>Envie sugestões</li>
        <li>Vote</li>
      </ol>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { useHomeStore } from '@/stores/home.ts';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onEnter } from '@/composables/enter.ts';

const router = useRouter();
const game = useHomeStore();
const disableButtons = ref(false);

const playerName = ref('');
const lobbyCode = ref('');

const isCodeValid = computed(() => /[A-Z]{6}/.test(lobbyCode.value));
const isNameValid = computed(() => playerName.value.length > 0);

const joinLobby = async () => {
  if (!isCodeValid) return false;
  if (!isNameValid) return false;

  disableButtons.value = true;
  const stage = await game.joinLobby(playerName.value, lobbyCode.value);
  if (stage === 'lobby') return router.push({ name: 'lobby' });
  router.push({ name: 'game' });
};

const createLobby = async () => {
  if (!isNameValid) return false;

  disableButtons.value = true;
  const lobbyCode = await game.createLobby();
  await game.joinLobby(playerName.value, lobbyCode);
  router.push({ name: 'lobby' });
};
</script>

<style src="../assets/home.css" scoped></style>
