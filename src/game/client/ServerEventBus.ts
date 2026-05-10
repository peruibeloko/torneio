import {
  ServerEvents,
  EventType,
  Handlers
} from '@/game/events/ServerEvents.ts';
import { EventBus } from '@/game/events/EventBus.ts';

class EventChannel {
  #bus: EventBus<ServerEvents> = new EventBus(this);

  constructor() {}

  /**
   * How many topics we're tracking in this channel
   */
  get size() {
    return this.#bus.size;
  }

  subscribe<T extends EventType>(topic: T, handler: Handlers[T]) {
    this.#bus.subscribe(topic, handler);
  }

  unsubscribe<T extends EventType>(topic: T, handler: Handlers[T]) {
    this.#bus.unsubscribe(topic, handler);
  }

  publish<T extends EventType>(type: T, data: ServerEvents[T]) {
    this.#bus.publish(type, data);
  }
}

export class ServerEventBus {
  #lobbies: Map<string, EventChannel> = new Map();
  static #instance: ServerEventBus;

  private constructor() {}

  static getBus() {
    if (!ServerEventBus.#instance)
      ServerEventBus.#instance = new ServerEventBus();
    return ServerEventBus.#instance;
  }

  subscribe<T extends EventType>(
    lobby: string,
    topic: T,
    handler: Handlers[T]
  ) {
    if (!this.#lobbies.has(lobby)) this.#lobbies.set(lobby, new EventChannel());
    this.#lobbies.get(lobby)!.subscribe(topic, handler);
  }

  unsubscribe<T extends EventType>(
    lobby: string,
    topic: T,
    handler: Handlers[T]
  ) {
    if (!this.#lobbies.has(lobby)) return;
    const channel = this.#lobbies.get(lobby)!;
    channel.unsubscribe(topic, handler);
    if (channel.size === 0) this.#lobbies.delete(topic);
  }

  publish<T extends EventType>(lobbies: string[], type: T, data: ServerEvents[T]) {
    for (const lobby of lobbies) {
      if (lobby === '') continue;
      if (!this.#lobbies.has(lobby)) return;
      this.#lobbies.get(lobby)!.publish(type, data);
    }
  }
}
