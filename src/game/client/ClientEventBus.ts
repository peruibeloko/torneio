import {
  ClientEvents,
  EventType,
  Handlers
} from '@/game/events/ClientEvents.ts';
import { EventBus } from '@/game/events/EventBus.ts';

export class ClientEventBus {
  #bus: EventBus<ClientEvents> = new EventBus(this);
  static #instance: ClientEventBus;

  private constructor() {}

  static getBus() {
    if (!ClientEventBus.#instance) {
      ClientEventBus.#instance = new ClientEventBus();
    }
    return ClientEventBus.#instance;
  }

  subscribe<T extends EventType>(topic: T, handler: Handlers[T]) {
    this.#bus.subscribe(topic, handler);
  }

  unsubscribe<T extends EventType>(topic: T, handler: Handlers[T]) {
    this.#bus.unsubscribe(topic, handler);
  }

  publish<T extends EventType>(type: T, data: ClientEvents[T]) {
    this.#bus.publish(type, data);
  }
}
