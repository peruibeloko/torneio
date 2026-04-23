import { defineStore } from 'pinia';
import { useGameInternalStore } from '@/stores/internal.ts';
import type { JoinMsg } from '@/game/client/ClientMessages.ts';
import type { GameInfo, GameStages } from '@/game/shared/constants.ts';

export const useHomeStore = defineStore('home', () => {
  const internal = useGameInternalStore();

  async function createLobby() {
    const lobbyCode = await fetch('/api/createLobby', { method: 'POST' }).then(
      r => r.text()
    );
    return lobbyCode;
  }

  async function joinLobby(name: string, lobbyCode: string) {
    internal.lobbyCode = lobbyCode;

    const res = await fetch('/api/joinLobby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player: name,
        lobbyCode: internal.lobbyCode
      } as JoinMsg)
    });

    if (res.status === 404) return null;

    const gameInfo: GameInfo = await res.json();

    internal.playerName = gameInfo.uniqueName;

    internal.sendMsg({
      type: 'join',
      data: {
        lobbyCode: internal.lobbyCode,
        player: internal.playerName
      }
    });

    return gameInfo.stage as GameStages;
  }

  return {
    createLobby,
    joinLobby
  };
});
