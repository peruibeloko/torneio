import { ThingTuple } from '@/game/server/Votes.ts';

export type ServerEvent =
  | { type: 'create'; data: CreateLobbyEvt }
  | { type: 'join'; data: JoinLobbyEvt }
  | { type: 'leave'; data: LeaveLobbyEvt }
  | { type: 'suggest'; data: SuggestThingEvt }
  | { type: 'ready'; data: PlayerReadyEvt }
  | { type: 'vote'; data: VoteEvt }
  | { type: 'roundStart'; data: RoundStartEvt }
  | { type: 'roundEnd'; data: RoundEndEvt };

export type EventData<T extends ServerEvent['type']> = Extract<
  ServerEvent,
  { type: T }
>['data'];

type Socket = { socket: WebSocket };
type CreateLobbyEvt = Socket;

type JoinLobbyEvt = { lobbyCode: string; player: string } & Socket;
type LeaveLobbyEvt = { lobbyCode: string; player: string } & Socket;

type SuggestThingEvt = { lobbyCode: string; thing: string } & Socket;
type PlayerReadyEvt = { lobbyCode: string } & Socket;

type RoundStartEvt = { lobbyCode: string; things: ThingTuple };
type VoteEvt = { lobbyCode: string; player: string; thing: string } & Socket;
type RoundEndEvt = { lobbyCode: string; winner: string; roundEnd: boolean };
