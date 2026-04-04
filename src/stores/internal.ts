import type { ClientMessage } from "@/game/client/ClientMessages.ts";
import type { ClientPlayer } from '@/game/shared/constants.ts';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameInternalStore = defineStore('gameInternal', () => {
  const socket = ref({} as WebSocket);
  const playerName = ref('');
  const lobbyCode = ref('');

  const players = ref<ClientPlayer[]>([]);
  const things = ref<string[]>([]);

  const round = ref(1);
  const winner = ref('');
  const isGameEnd = ref(false);

  const gameStartCallback = ref(() => {});
  const roundStartCallback = ref(() => {});
  const roundEndCallback = ref(() => {});

  function sendMsg(msg: ClientMessage) {
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
