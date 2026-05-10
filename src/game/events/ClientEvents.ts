import { GenericHandlers } from '@/game/events/EventBus.ts';
import { GameState } from '@/game/server/ServerLobby.ts';
import { ThingTuple, VotesTuple } from '@/game/server/Votes.ts';

interface GameInfo {
  uniqueName: string;
  stage: GameState['stage'];
}

export type ClientEvents = {
  createLobbyResponse: LobbyCreatedEvt;
  joinLobbyResponse: LobbyJoinedEvt;
  allPlayers: AllPlayersEvt;
  allVotes: AllVotesEvt;
  allSuggestions: AllSuggestionsEvt;
  playerJoined: PlayerJoinedEvt;
  playerReady: PlayerReadyEvt;
  playerLeft: PlayerLeftEvt;
  newLobby: NewLobbyEvt;
  newVote: VoteEvt;
  newSuggestion: SuggestionEvt;
  roundStart: RoundStartEvt;
  roundEnd: RoundEndEvt;
  gameInfo: GameInfoEvt;
  gameStart: null;
};

export type EventType = keyof ClientEvents;
export type Handlers = GenericHandlers<ClientEvents>;

// TODO nova operação única: sync player
type LobbyCreatedEvt = string;
type LobbyJoinedEvt = GameInfo | null;
type AllPlayersEvt = { name: string; ready: boolean }[];
type AllVotesEvt = { things: ThingTuple; votes: VotesTuple };
type AllSuggestionsEvt = string[];
type PlayerJoinedEvt = string;
type PlayerReadyEvt = string;
type PlayerLeftEvt = string;
type NewLobbyEvt = null;
type VoteEvt = { player: string; thing: string };
type SuggestionEvt = string;
type RoundStartEvt = { things: ThingTuple; round: number };
type RoundEndEvt = { winner: string; gameEnd: boolean };
type GameInfoEvt = { stage: GameState['stage'] };
