import type { ClientMessage } from '@/game/client/ClientMessages.ts';
import { EventBus } from '@/game/events/EventBus.ts';
import { ServerLobby } from '@/game/server/ServerLobby.ts';
import type { ServerMessage } from '@/game/server/ServerMessages.ts';
import { encode } from 'msgpack';

export class GameServer {
  #lobbies = new Map<string, ServerLobby>();

  constructor() {
    EventBus.getInstance().subscribe('create', this.createLobby);
    EventBus.getInstance().subscribe('join', this.addPlayer);
  }

  getLobby(lobbyCode: string) {
    return this.#lobbies.get(lobbyCode)!;
  }

  lobbyExists(lobbyCode: string) {
    return this.#lobbies.get(lobbyCode) !== undefined;
  }

  createLobby() {
    let lobbyCode = ServerLobby.generateRoomCode();
    while (this.#lobbies.has(lobbyCode)) {
      lobbyCode = ServerLobby.generateRoomCode();
    }

    this.#lobbies.set(lobbyCode, new ServerLobby(lobbyCode));
    return lobbyCode;
  }

  joinLobby(lobbyCode: string, playerName: string) {
    const lobby = this.getLobby(lobbyCode);
    const uniqueName = lobby.getUniqueName(playerName);

    return {
      uniqueName,
      stage: lobby.stage
    };
  }

  addPlayer({ socket, lobbyCode }: { socket: WebSocket; lobbyCode: string }) {
    socket.addEventListener('close', () => {
      if (this.getLobby(lobbyCode).size === 0) this.#lobbies.delete(lobbyCode);
    });
  }

  sendMsg(msg: ServerMessage, socket: WebSocket) {
    socket.send(encode(msg));
  }

  handleMsg(msg: ClientMessage, socket: WebSocket) {
    EventBus.getInstance().publish(msg.type, { socket, ...msg.data });
  }
}
