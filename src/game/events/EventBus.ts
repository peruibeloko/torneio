import { preview } from 'vite';

type GenericEvent = { [type: string]: unknown };

export type GenericHandlers<E extends GenericEvent> = {
  [T in keyof E]: (data: E[T]) => void;
};

class Topic<E extends GenericEvent, T extends keyof E> {
  #subscribers: GenericHandlers<E>[T][] = [];

  constructor(...handlers: ((data: E[T]) => void)[]) {
    this.#subscribers = handlers;
  }

  [Symbol.iterator]() {
    return Iterator.from(this.#subscribers);
  }

  get size() {
    return this.#subscribers.length;
  }

  addSubscriber(handler: (data: E[T]) => void) {
    this.#subscribers.push(handler);
  }

  publish(data: E[T]) {
    for (const handler of this.#subscribers) handler(data);
  }

  removeSubscriber(handler: (data: E[T]) => void) {
    const idx = this.#subscribers.indexOf(handler);
    this.#subscribers.splice(idx, 1);
  }
}

export class EventBus<E extends GenericEvent> {
  #context: ThisType<unknown>;
  #topics = new Map();

  #getTopic<T extends keyof E>(t: T) {
    return this.#topics.get(t) as Topic<E, T>;
  }

  constructor(ctx: ThisType<unknown>) {
    this.#context = ctx;
  }

  unsubscribe<T extends keyof E>(topic: T, handler: GenericHandlers<E>[T]) {
    if (!this.#topics.has(topic)) return;
    const t = this.#getTopic(topic);
    t.removeSubscriber(handler);
    if (t.size === 0) this.#topics.delete(topic);
  }

  subscribe<T extends keyof E>(topic: T, handler: GenericHandlers<E>[T]) {
    console.log('registering listener', topic, handler);
    const boundHandler = handler.bind(this.#context);
    if (!this.#topics.has(topic)) {
      this.#topics.set(topic, new Topic(boundHandler));
    } else {
      this.#getTopic(topic).addSubscriber(boundHandler);
    }
  }

  publish<T extends keyof E>(event: T, data: E[T]) {
    console.log('firing event', event, data);
    const topic = this.#getTopic(event);
    if (!topic || topic.size === 0) return;
    for (const handler of topic) handler(data);
  }
}
