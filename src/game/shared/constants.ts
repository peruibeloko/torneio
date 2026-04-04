import type { Votes } from '@/game/shared/votes.ts';

export type ServerPlayer = {
  ready: boolean;
  socket: WebSocket;
};

export interface ClientPlayer {
  name: string;
  ready: boolean;
}

export type VotesDict = { [thing: string]: Set<string> };

export type GameState =
  | { stage: 'lobby'; things: string[]; remainingReady: number }
  | { stage: 'roundEnd'; round: number; winner: string; gameEnd: boolean }
  | {
      stage: 'game';
      round: number;
      totalVotes: number;
      votes: Votes;
    };

export type GameStages = GameState['stage'];

export interface GameInfo {
  uniqueName: string;
  stage: GameStages;
}
