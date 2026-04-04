import type { Ref } from 'vue';
import { ServerVotes } from "@/game/ServerVotes.ts";

export type ServerPlayer = {
  ready: boolean;
  socket: WebSocket;
};

export interface ClientPlayer {
  name: string;
  ready: boolean;
}

export type ClientVotes = { [thing: string]: Ref<string[]> };

export type GameState =
  | { stage: 'lobby'; things: string[]; remainingReady: number }
  | { stage: 'roundEnd'; round: number; winner: string; gameEnd: boolean }
  | {
      stage: 'game';
      round: number;
      totalVotes: number;
      votes: ServerVotes;
    };

export type GameStages = GameState['stage'];

export interface GameInfo {
  uniqueName: string;
  stage: GameStages;
}




