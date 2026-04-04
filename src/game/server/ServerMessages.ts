import type { GameStages } from '@/game/shared/constants.ts';

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
  things: [thingL: string, thingR: string];
  votes: [votesL: string[], votesR: string[]];
}

export interface GameInfoMsg {
  uniqueName: string;
  stage: GameStages;
}

export interface RoundStartMsg {
  things: [string, string];
  round: number;
}

export interface RoundEndMsg {
  winner: string;
  gameEnd: boolean;
}

export type VoteMsg = {
  player: string;
  thing: string;
};
