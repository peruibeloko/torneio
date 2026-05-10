import { useGameInternalStore } from '@/client/stores/internal.ts';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useGameStore = defineStore('game', () => {
  const internal = useGameInternalStore();

  const playerName = computed(() => internal.playerName);
  const lobbyCode = computed(() => internal.lobbyCode);
  const players = computed(() => internal.players);
  const things = computed(() => internal.things);
  const round = computed(() => internal.round);
  const winner = computed(() => internal.winner);
  const gameEnd = computed(() => internal.isGameEnd);

  return {
    lobbyCode,
    playerName,
    players,
    things,
    round,
    winner,
    gameEnd,
    client: internal.client!
  };
});
