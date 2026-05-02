import type { GameStages } from '@/game/shared/constants.ts';
import { ThingTuple, VotesTuple } from '@/game/server/Votes.ts';

export type ServerMessage =
  | { type: 'allPlayers'; data: AllPlayersMsg }
  | { type: 'allVotes'; data: AllVotesMsg }
  | { type: 'allSuggestions'; data: AllSuggestionsMsg }
  | { type: 'playerJoined'; data: string }
  | { type: 'playerReady'; data: string }
  | { type: 'playerLeft'; data: string }
  | { type: 'newVote'; data: VoteMsg }
  | { type: 'newSuggestion'; data: string }
  | { type: 'roundStart'; data: RoundStartMsg }
  | { type: 'roundEnd'; data: RoundEndMsg }
  | { type: 'gameInfo'; data: GameInfoMsg }
  | { type: 'gameStart' };

export type AllPlayersMsg = {
  name: string;
  ready: boolean;
}[];

export type AllSuggestionsMsg = string[];

export type AllVotesMsg = {
  things: ThingTuple;
  votes: VotesTuple;
};

export type GameInfoMsg = {
  uniqueName: string;
  stage: GameStages;
};

export type RoundStartMsg = {
  things: [string, string];
  round: number;
};

export type RoundEndMsg = {
  winner: string;
  gameEnd: boolean;
};

export type VoteMsg = {
  player: string;
  thing: string;
};
