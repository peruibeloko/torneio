import { ClientMessage } from '@/game/client/ClientMessages.ts';
import { ThingTuple } from '@/game/server/Votes.ts';

export type GameEvent =
  | ClientMessage
  | { type: 'roundStart'; data: { things: ThingTuple } }
  | { type: 'roundEnd'; data: { winner: string; roundEnd: boolean } };

type EventType = GameEvent['type'];
type EventData<T extends EventType> = { socket: WebSocket } & Extract<
  GameEvent,
  { type: T }
>['data'];

type BaseHandler<T extends EventType> = (data: EventData<T>) => void;
type AnyHandler = { [T in EventType]: BaseHandler<T> }[EventType];
type Handler<T extends EventType> = Extract<AnyHandler, BaseHandler<T>>;

export class EventBus {
  static #instance: EventBus;
  #topics = new Map<EventType, Handler<EventType>[]>();

  private constructor() {}

  static getInstance() {
    if (!EventBus.#instance) EventBus.#instance = new EventBus();
    return EventBus.#instance;
  }

  unsubscribe<T extends EventType>(topic: T, handler: Handler<T>) {
    const subscribers = this.#topics.get(topic);
    if (!subscribers || subscribers.length === 0) return;

    const idx = subscribers.indexOf(handler as Handler<EventType>);
    subscribers.splice(idx, 1);
    this.#topics.set(topic, subscribers);
  }

  subscribe<T extends EventType>(topic: T, handler: BaseHandler<T>) {
    const subscribers = this.#topics.getOrInsert(topic, []);
    subscribers.push(handler as Handler<EventType>);
    this.#topics.set(topic, subscribers);
  }

  publish<T extends EventType>(type: T, data: EventData<T>) {
    const subscribers = this.#topics.get(type);
    if (!subscribers || subscribers.length === 0) return;
    for (const handler of subscribers as Handler<T>[]) handler(data);
  }
}
