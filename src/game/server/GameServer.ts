import type { ClientMessage } from '@/game/client/ClientMessages.ts';
import { ServerEventBus } from '@/game/client/ServerEventBus.ts';
import { ServerEvents } from '@/game/events/ServerEvents.ts';
import { ServerLobby } from '@/game/server/ServerLobby.ts';
import type { ServerMessage } from '@/game/server/ServerMessages.ts';
import { encode } from 'msgpack';

export class GameServer {
  #lobbies = new Map<string, ServerLobby>();

  constructor() {
    ServerEventBus.getBus().subscribe('global', 'create', this.createLobby.bind(this));
    ServerEventBus.getBus().subscribe('global', 'join', this.joinLobby.bind(this));
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
      ServerEventBus.getBus().publish(['global', lobbyCode], 'leave', {
        lobbyCode,
        player: uniqueName,
        socket
      });
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
    console.debug('got message', msg);
    ServerEventBus.getBus().publish(
      ['global', msg.data?.lobbyCode ?? ''],
      msg.type,
      {
        socket,
        ...msg.data
      }
    );
  }
}
