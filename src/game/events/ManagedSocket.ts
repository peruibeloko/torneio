import { decode, encode, ValueMap } from 'msgpack';

interface SocketHandlers<T> {
  onMessage: (msg: T) => void;
  onOpen?: (socket: WebSocket) => void;
  onClose?: (e: CloseEvent) => void;
}

export class ManagedSocket<In, Out extends ValueMap> {
  #socket: WebSocket;

  constructor(url: string | URL, handlers: SocketHandlers<In>) {
    this.#socket = new WebSocket(url);

    this.#socket.addEventListener('message', e => {
      (e.data as Blob).bytes().then(b => handlers.onMessage(decode(b) as In));
    });

    if (handlers.onOpen) {
      this.#socket.addEventListener(
        'open',
        handlers.onOpen.bind(null, this.#socket)
      );
    }

    if (handlers.onClose) {
      this.#socket.addEventListener('close', handlers.onClose);
    }
  }

  send(msg: Out) {
    this.#socket.send(encode(msg));
  }
}
