import type { ClientMessage } from '@/game/client/ClientMessages.ts';
import { EventBus } from '@/game/events/EventBus.ts';
import { ServerLobby } from '@/game/server/ServerLobby.ts';
import type { ServerMessage } from '@/game/server/ServerMessages.ts';
import { encode } from 'msgpack';
import { EventType, ServerEvents } from '@/game/events/ServerEvents.ts';

export class GameServer {
  #lobbies = new Map<string, ServerLobby>();
  #globalBus: EventBus<ServerEvents>;

  constructor() {
    this.#globalBus = new EventBus(this);
    this.#globalBus.subscribe('create', this.createLobby);
    this.#globalBus.subscribe('join', this.joinLobby);
    console.log('game server initialized', this);
    console.log('Event Bus:', JSON.stringify(this.#globalBus));
  }

  getLobby(lobbyCode: string) {
    return this.#lobbies.get(lobbyCode) ?? null;
  }

  createLobby({ socket }: ServerEvents['create']) {
    console.log('creating lobby', socket);

    let lobbyCode = ServerLobby.generateRoomCode();
    while (this.#lobbies.has(lobbyCode)) {
      lobbyCode = ServerLobby.generateRoomCode();
    }

    this.#lobbies.set(lobbyCode, new ServerLobby(lobbyCode));
    console.log('lobbies', this.#lobbies);
    this.sendMsg({ type: 'createLobbyResponse', data: lobbyCode }, socket);
  }

  joinLobby({ lobbyCode, player, socket }: ServerEvents['join']) {
    console.log('adding player to lobby', lobbyCode, player);

    const lobby = this.getLobby(lobbyCode.toUpperCase());

    console.log('current lobbies', this.#lobbies);
    console.log('found lobby', lobby);
    if (lobby === null) {
      this.sendMsg({ type: 'joinLobbyResponse', data: null }, socket);
      return;
    }

    const uniqueName = lobby.getUniqueName(player);
    lobby.addPlayer(uniqueName, socket);

    socket.addEventListener('close', () => {
      this.#globalBus.publish('leave', {
        lobbyCode,
        player: uniqueName,
        socket
      });
      lobby.bus.publish('leave', { lobbyCode, player: uniqueName, socket });
    });

    this.sendMsg(
      {
        type: 'joinLobbyResponse',
        data: {
          stage: lobby.stage,
          uniqueName: uniqueName
        }
      },
      socket
    );
  }

  playerLeft({ lobbyCode }: ServerEvents['leave']) {
    const lobby = this.getLobby(lobbyCode);
    if (lobby && lobby.size === 0) {
      this.#lobbies.delete(lobbyCode);
    }
  }

  sendMsg(msg: ServerMessage, socket: WebSocket) {
    console.log('sending message', msg);
    socket.send(encode(msg));
  }

  handleMsg(msg: ClientMessage, socket: WebSocket) {
    console.log('got message', msg);
    if (msg.data?.lobbyCode) {
      const lobby = this.getLobby(msg.data.lobbyCode);
      if (!lobby) return;
      lobby.bus.publish(msg.type as EventType, {
        socket,
        ...msg.data
      });
    }
    this.#globalBus.publish(msg.type as EventType, {
      socket,
      ...msg.data
    });
  }
}
