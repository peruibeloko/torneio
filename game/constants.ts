import { Signal } from "@preact/signals";

declare const tags: unique symbol;

export const PARTS = {
  ROOT: "games",
  INFO: "info",
  PLAYERS: "players",
  THINGS: "things",
};

export const KEYS = {
  ALL_GAMES: [PARTS.ROOT, PARTS.INFO],
  ALL_PLAYERS: [PARTS.ROOT, PARTS.PLAYERS],
  ALL_THINGS: [PARTS.ROOT, PARTS.THINGS],

  LOBBY_INFO: (code: string) => [PARTS.ROOT, PARTS.INFO, code],
  LOBBY_PLAYERS: (code: string) => [PARTS.ROOT, PARTS.PLAYERS, code],
  LOBBY_THINGS: (code: string) => [PARTS.ROOT, PARTS.THINGS, code],
};

export interface ServerPlayer {
  name: string;
  ready: boolean;
  socket: WebSocket;
}

export interface ClientPlayer {
  name: string;
  ready: boolean;
}

export type Thing = string & { [tags]: { "Thing": void } };

export type Votes = { [thing: Thing]: Signal<string[]> };

export interface JoinMsg {
  lobbyCode: string;
  player: string;
}

export interface LeaveMsg {
  lobbyCode: string;
  player: string;
}

export interface SuggestMsg {
  lobbyCode: string;
  thing: string;
}

export interface ReadyMsg {
  lobbyCode: string;
  player: string;
}

export interface VoteMsg {
  lobbyCode: string;
  player: string;
  thing: Thing;
}

export type InMsg =
  | { type: "create" }
  | { type: "join"; data: JoinMsg }
  | { type: "leave"; data: LeaveMsg }
  | { type: "suggest"; data: SuggestMsg }
  | { type: "ready"; data: ReadyMsg }
  | { type: "vote"; data: VoteMsg };

export type AllPlayersMsg = {
  name: string;
  ready: boolean;
}[];

export type AllSuggestionsMsg = string[];

export interface AllVotesMsg {
  [thing: Thing]: string[];
}

export interface RoundStartMsg {
  things: [Thing, Thing];
  round: number;
}

export interface RoundEndMsg {
  winner: string;
  gameEnd: boolean;
}

export type OutMsg =
  | { type: "allPlayers"; data: AllPlayersMsg }
  | { type: "allVotes"; data: AllVotesMsg }
  | { type: "allSuggestions"; data: AllSuggestionsMsg }
  | { type: "playerJoined"; data: string }
  | { type: "playerReady"; data: string }
  | { type: "playerLeft"; data: string }
  | { type: "newVote"; data: VoteMsg }
  | { type: "newSuggestion"; data: string }
  | { type: "roundStart"; data: RoundStartMsg }
  | { type: "roundEnd"; data: RoundEndMsg };
