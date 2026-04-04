import { Thing } from '@/game/shared/constants.ts';

type CltMsg = {
  lobbyCode: string;
};

export type InMsg =
  | { type: 'create' }
  | { type: 'join'; data: JoinMsg }
  | { type: 'leave'; data: LeaveMsg }
  | { type: 'suggest'; data: SuggestMsg }
  | { type: 'ready'; data: ReadyMsg }
  | { type: 'vote'; data: VoteMsg };

export type JoinMsg = {
  player: string;
} & CltMsg;

export type LeaveMsg = {
  player: string;
} & CltMsg;

export type SuggestMsg = {
  thing: string;
} & CltMsg;

export type ReadyMsg = {
  player: string;
} & CltMsg;

export type VoteMsg = {
  player: string;
  thing: Thing;
} & CltMsg;
