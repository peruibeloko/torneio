import type { Ref } from 'vue';
import { ServerVotes } from "@/game/ServerVotes.ts";

declare const tags: unique symbol;

export type ServerPlayer = {
  ready: boolean;
  socket: WebSocket;
};

export interface ClientPlayer {
  name: string;
  ready: boolean;
}

export type Thing = string & { [tags]: { Thing: void } };

export type ClientVotes = { [thing: Thing]: Ref<string[]> };

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




