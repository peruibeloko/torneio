import type { ClientMessage } from '@/game/client/ClientMessages.ts';
import type {
  ClientPlayer,
  GameInfo
} from '@/game/shared/constants.ts';
import { encode } from 'msgpack';
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

  const createLobbyCallback = ref((_lobbyCode: string) => {});
  const joinLobbyCallback = ref((_info: GameInfo | null) => {});
  const gameStartCallback = ref(() => {});
  const roundStartCallback = ref(() => {});
  const roundEndCallback = ref(() => {});

  function sendMsg(msg: ClientMessage) {
    socket.value.send(encode(msg));
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
    createLobbyCallback,
    joinLobbyCallback,
    gameStartCallback,
    roundStartCallback,
    roundEndCallback,
    sendMsg
  };
});
