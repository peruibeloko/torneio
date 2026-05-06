import { useGameInternalStore } from '@/client/stores/internal.ts';
import { useVoteStore } from '@/client/stores/votes.ts';
import { GameInfo } from '@/game/shared/constants.ts';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useGameStore = defineStore('game', () => {
  const internal = useGameInternalStore();
  const votes = useVoteStore();

  const playerName = computed(() => internal.playerName);

  const players = computed(() => internal.players);
  const things = computed(() => internal.things);
  const round = computed(() => internal.round);
  const winner = computed(() => internal.winner);
  const gameEnd = computed(() => internal.isGameEnd);

  function createLobbyLogic(cb: (lobbyCode: string) => void) {
    internal.createLobbyCallback = cb;
  }

  function joinLobbyLogic(cb: (info: GameInfo | null) => void) {
    internal.joinLobbyCallback = cb;
  }

  function gameStartLogic(cb: () => void) {
    internal.gameStartCallback = cb;
  }

  function roundStartLogic(cb: () => void) {
    internal.roundStartCallback = cb;
  }

  function roundEndLogic(cb: () => void) {
    internal.roundEndCallback = cb;
  }

  function createLobby() {
    internal.sendMsg({
      type: 'create',
      data: null
    });
  }

  function joinLobby(plainName: string, lobbyCode: string) {
    internal.sendMsg({
      type: 'join',
      data: { lobbyCode, player: plainName }
    });
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

  function vote(thing: string) {
    votes.vote(thing, internal.playerName);
    internal.sendMsg({
      type: 'vote',
      data: {
        player: internal.playerName,
        thing,
        lobbyCode: internal.lobbyCode
      }
    });
  }

  return {
    lobbyCode: internal.lobbyCode,
    playerName,
    players,
    things,
    round,
    winner,
    gameEnd,
    createLobbyLogic,
    joinLobbyLogic,
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
