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

export interface JoinMsg {
  code: string;
  name: string;
}

export interface LeaveMsg {
  code: string;
  name: string;
}

export interface SuggestMsg {
  thing: string;
}

export interface VoteMsg {
  thing: string;
}

export type AllPlayersMsg = string[];
export type AllVotesMsg = {
  [thing: string]: string[];
};
export type AllSuggestionsMsg = string[];

export type InMsg =
  | { type: "join"; data: JoinMsg }
  | { type: "vote"; data: VoteMsg }
  | { type: "leave"; data: LeaveMsg }
  | { type: "suggest"; data: SuggestMsg };

export type OutMsg =
  | { type: "allPlayers"; data: AllPlayersMsg }
  | { type: "allVotes"; data: AllVotesMsg }
  | { type: "allSuggestions"; data: AllSuggestionsMsg };
