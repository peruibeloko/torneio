type GenericEvent = { type: string; data: unknown };
type EventType<E extends GenericEvent> = E['type'];
type EventData<E extends GenericEvent, T extends EventType<E>> = Extract<
  E,
  { type: T }
>['data'];

type BaseHandler<E extends GenericEvent, T extends EventType<E>> = (
  data: EventData<E, T>
) => void;
type AnyHandler<E extends GenericEvent> = {
  [T in EventType<E>]: BaseHandler<E, T>;
}[EventType<E>];
type Handler<E extends GenericEvent, T extends EventType<E>> = Extract<
  AnyHandler<E>,
  BaseHandler<E, T>
>;

export class EventBus<E extends GenericEvent> {
  static #instance: unknown;
  #topics = new Map<EventType<E>, Handler<E, EventType<E>>[]>();
  
  private constructor() {}

  static getInstance<T extends GenericEvent>() {
    if (!EventBus.#instance) EventBus.#instance = new EventBus();
    return EventBus.#instance as EventBus<T>;
  }

  unsubscribe<T extends EventType<E>>(topic: T, handler: Handler<E, T>) {
    const subscribers = this.#topics.get(topic);
    if (!subscribers || subscribers.length === 0) return;

    const idx = subscribers.indexOf(handler as Handler<E, T>);
    subscribers.splice(idx, 1);
    this.#topics.set(topic, subscribers);
  }

  subscribe<T extends EventType<E>>(topic: T, handler: BaseHandler<E, T>) {
    const subscribers = this.#topics.getOrInsert(topic, []);
    subscribers.push(handler as Handler<E, T>);
    this.#topics.set(topic, subscribers);
  }

  publish<T extends EventType<E>>(type: T, data: EventData<E, T>) {
    const subscribers = this.#topics.get(type);
    if (!subscribers || subscribers.length === 0) return;
    for (const handler of subscribers as Handler<E, T>[]) handler(data);
  }
}
