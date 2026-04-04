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
    console.log('created lobby', lobbyCode);
    return lobbyCode;
  }

  async function joinLobby(name: string, lobbyCode: string) {
    internal.lobbyCode = lobbyCode;

    // TODO check if lobby exists
    const gameInfo: GameInfo = await fetch('/api/joinLobby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player: name,
        lobbyCode: internal.lobbyCode
      } as JoinMsg)
    }).then(r => r.json());

    internal.playerName = gameInfo.uniqueName;

    internal.sendMsg({
      type: 'join',
      data: {
        lobbyCode: internal.lobbyCode,
        player: internal.playerName
      }
    });

    console.log(internal.playerName, 'joined lobby', internal.lobbyCode);
    return gameInfo.stage as GameStages;
  }

  return {
    createLobby,
    joinLobby
  };
});
