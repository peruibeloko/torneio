import { useGameInternalStore } from '@/client/stores/internal.ts';
import { defineStore } from 'pinia';

export const useLobbyStore = defineStore('lobby', () => {
  const internal = useGameInternalStore();

  function setGameStartLogic(cb: () => void) {
    internal.gameStartCallback = cb;
  }

  function suggest(thing: string) {
    internal.sendMsg({
      type: 'suggest',
      data: { thing, lobbyCode: internal.lobbyCode }
    });
  }

  function ready() {
    internal.sendMsg({
      type: 'ready',
      data: {
        lobbyCode: internal.lobbyCode,
        player: internal.playerName
      }
    });
  }

  return {
    setGameStartLogic,
    suggest,
    ready
  };
});
