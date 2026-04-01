import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ClientPlayer, InMsg } from '../game/constants.ts';

export const useGameInternalStore = defineStore('gameInternal', () => {
  const socket = ref({} as WebSocket);
  const playerName = ref('');
  const lobbyCode = ref('');

  const players = ref<ClientPlayer[]>([]);
  const things = ref<string[]>([]);

  const round = ref(0);
  const winner = ref('');
  const isGameEnd = ref(false);

  const gameStartCallback = ref(() => {});
  const roundStartCallback = ref(() => {});
  const roundEndCallback = ref(() => {});

  function sendMsg(msg: InMsg) {
    console.log('sending message', msg);
    socket.value.send(JSON.stringify(msg));
  }

  return {
    socket,
    playerName,
    lobbyCode,
    players,
    things,
    round,
    winner,
    isGameEnd,
    gameStartCallback,
    roundStartCallback,
    roundEndCallback,
    sendMsg
  };
});
