import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { GameInfo, GameStages, JoinMsg, Thing } from '@/game/shared/constants.ts';
import { useGameInternalStore } from '@/stores/gameInternal.ts';
import { useVotesInternalStore } from '@/stores/votesInternal.ts';

export const useGameStore = defineStore('game', () => {
  const internal = useGameInternalStore();
  const votesInternal = useVotesInternalStore();

  const lobbyCode = computed(() => internal.lobbyCode);
  const playerName = computed(() => internal.playerName);

  const players = computed(() => internal.players);
  const things = computed(() => internal.things);
  const round = computed(() => internal.round);
  const winner = computed(() => internal.winner);
  const gameEnd = computed(() => internal.isGameEnd);

  function roundStartLogic(cb: () => void) {
    internal.roundStartCallback = cb;
  }

  function roundEndLogic(cb: () => void) {
    internal.roundEndCallback = cb;
  }

  function gameStartLogic(cb: () => void) {
    internal.gameStartCallback = cb;
  }

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

  function leaveLobby() {
    internal.sendMsg({
      type: 'leave',
      data: { lobbyCode: internal.lobbyCode, player: internal.playerName }
    });
  }

  function suggest(thing: string) {
    internal.sendMsg({
      type: 'suggest',
      data: { thing, lobbyCode: internal.lobbyCode }
    });
    console.log('suggesting', thing);
  }

  function ready() {
    internal.sendMsg({
      type: 'ready',
      data: {
        lobbyCode: internal.lobbyCode,
        player: internal.playerName
      }
    });
    console.log(internal.playerName, 'is ready');
  }

  function vote(thing: Thing) {
    votesInternal.vote(thing, internal.playerName);
    internal.sendMsg({
      type: 'vote',
      data: {
        player: internal.playerName,
        thing,
        lobbyCode: internal.lobbyCode
      }
    });
    console.log('voting for', thing);
  }

  return {
    lobbyCode,
    playerName,
    players,
    things,
    round,
    winner,
    gameEnd,
    roundStartLogic,
    roundEndLogic,
    gameStartLogic,
    createLobby,
    joinLobby,
    leaveLobby,
    suggest,
    ready,
    vote
  };
});
