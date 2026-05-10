import { ThingTuple } from '@/game/server/Votes.ts';
import { GenericHandlers } from "@/game/events/EventBus.ts";

export type ServerEvents = {
  create: CreateLobbyEvt;
  join: JoinLobbyEvt;
  leave: LeaveLobbyEvt;
  suggest: SuggestThingEvt;
  ready: PlayerReadyEvt;
  vote: VoteEvt;
  roundStart: RoundStartEvt;
  roundEnd: RoundEndEvt;
};

export type EventType = keyof ServerEvents;
export type Handlers = GenericHandlers<ServerEvents>;

type Socket = { socket: WebSocket };
type CreateLobbyEvt = Socket;

type JoinLobbyEvt = { lobbyCode: string; player: string } & Socket;
type LeaveLobbyEvt = { lobbyCode: string; player: string } & Socket;

type SuggestThingEvt = { lobbyCode: string; thing: string } & Socket;
type PlayerReadyEvt = { lobbyCode: string; player: string } & Socket;

type RoundStartEvt = { lobbyCode: string; things: ThingTuple };
type VoteEvt = { lobbyCode: string; player: string; thing: string } & Socket;
type RoundEndEvt = { lobbyCode: string; winner: string; roundEnd: boolean };
