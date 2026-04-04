export type ClientMessage =
  | { type: 'create' }
  | { type: 'join'; data: JoinMsg }
  | { type: 'leave'; data: LeaveMsg }
  | { type: 'suggest'; data: SuggestMsg }
  | { type: 'ready'; data: ReadyMsg }
  | { type: 'vote'; data: VoteMsg };

type ClientMessageBase = {
  lobbyCode: string;
};

export type JoinMsg = {
  player: string;
} & ClientMessageBase;

export type LeaveMsg = {
  player: string;
} & ClientMessageBase;

export type SuggestMsg = {
  thing: string;
} & ClientMessageBase;

export type ReadyMsg = {
  player: string;
} & ClientMessageBase;

export type VoteMsg = {
  player: string;
  thing: string;
} & ClientMessageBase;
