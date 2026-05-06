import type { ClientMessage } from '@/game/client/ClientMessages.ts';
import { EventBus } from '@/game/events/EventBus.ts';
import { ServerLobby } from '@/game/server/ServerLobby.ts';
import type { ServerMessage } from '@/game/server/ServerMessages.ts';
import { encode } from 'msgpack';
import { EventData, ServerEvent } from '@/game/events/ServerEvents.ts';

export class GameServer {
  #lobbies = new Map<string, ServerLobby>();

  constructor() {
    const bus = EventBus.getInstance<ServerEvent>();
    
    bus.subscribe('create', this.createLobby);
    bus.subscribe('join', this.joinLobby);
  }

  getLobby(lobbyCode: string) {
    return this.#lobbies.get(lobbyCode) ?? null;
  }

  createLobby({ socket }: EventData<'create'>) {
    let lobbyCode = ServerLobby.generateRoomCode();
    while (this.#lobbies.has(lobbyCode)) {
      lobbyCode = ServerLobby.generateRoomCode();
    }

    this.#lobbies.set(lobbyCode, new ServerLobby(lobbyCode));
    this.sendMsg({ type: 'createLobbyResponse', data: lobbyCode }, socket);
  }

  joinLobby({ lobbyCode, player, socket }: EventData<'join'>) {
    const lobby = this.getLobby(lobbyCode.toUpperCase());

    if (lobby === null) {
      this.sendMsg({ type: 'joinLobbyResponse', data: null }, socket);
      return;
    }

    const uniqueName = lobby.getUniqueName(player);

    socket.addEventListener('close', () =>
      EventBus.getInstance<ServerEvent>().publish('leave', {
        lobbyCode,
        player,
        socket
      })
    );

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

  playerLeft({ lobbyCode }: EventData<'leave'>) {
    const lobby = this.getLobby(lobbyCode);
    if (lobby && lobby.size === 0) {
      this.#lobbies.delete(lobbyCode);
    }
  }

  sendMsg(msg: ServerMessage, socket: WebSocket) {
    socket.send(encode(msg));
  }

  handleMsg(msg: ClientMessage, socket: WebSocket) {
    const bus = EventBus.getInstance<ServerEvent>();

    if (msg.data.lobbyCode) {
      bus.publish(`${msg.data.lobbyCode}_${msg.type}` as ServerEvent['type'], {
        socket,
        ...msg.data
      });
    } else {
      bus.publish(msg.type as ServerEvent['type'], {
        socket,
        ...msg.data
      });
    }
  }
}
