import { voteState } from '@/game/shared/votes.ts';
import { useGameInternalStore } from '@/stores/internal.ts';
import { defineStore } from 'pinia';
import { computed } from 'vue';

export const useGameStore = defineStore('game', () => {
  const internal = useGameInternalStore();
  const votes = voteState();

  const playerName = computed(() => internal.playerName);

  const players = computed(() => internal.players);
  const things = computed(() => internal.things);
  const round = computed(() => internal.round);
  const winner = computed(() => internal.winner);
  const gameEnd = computed(() => internal.isGameEnd);

  function setRoundStartLogic(cb: () => void) {
    internal.roundStartCallback = cb;
  }

  function setRoundEndLogic(cb: () => void) {
    internal.roundEndCallback = cb;
  }

  function leaveLobby() {
    internal.sendMsg({
      type: 'leave',
      data: { lobbyCode: internal.lobbyCode, player: internal.playerName }
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
    console.log('voting for', thing);
  }

  return {
    lobbyCode: internal.lobbyCode,
    playerName,
    players,
    things,
    round,
    winner,
    gameEnd,
    roundStartLogic: setRoundStartLogic,
    roundEndLogic: setRoundEndLogic,
    leaveLobby,
    vote
  };
});
