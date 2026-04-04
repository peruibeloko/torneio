import { GameStages, Thing } from "@/game/shared/constants.ts";

export type OutMsg =
  | { type: 'allPlayers'; data: AllPlayersMsg }
  | { type: 'allVotes'; data: AllVotesMsg }
  | { type: 'allSuggestions'; data: AllSuggestionsMsg }
  | { type: 'playerJoined'; data: string }
  | { type: 'playerReady'; data: string }
  | { type: 'playerLeft'; data: string }
  | { type: 'newVote'; data: VoteMsg }
  | { type: 'newSuggestion'; data: string }
  | { type: 'gameStart' }
  | { type: 'gameInfo'; data: GameInfoMsg }
  | { type: 'roundStart'; data: RoundStartMsg }
  | { type: 'roundEnd'; data: RoundEndMsg };

  export type AllPlayersMsg = {
  name: string;
  ready: boolean;
}[];

export type AllSuggestionsMsg = string[];

export interface AllVotesMsg {
  thingL: Thing;
  thingR: Thing;
  votesL: string[];
  votesR: string[];
}

export interface GameInfoMsg {
  uniqueName: string;
  stage: GameStages;
}

export interface RoundStartMsg {
  things: [Thing, Thing];
  round: number;
}

export interface RoundEndMsg {
  winner: string;
  gameEnd: boolean;
}

export type VoteMsg = {
  player: string;
  thing: Thing;
};