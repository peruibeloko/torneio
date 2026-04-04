import { ServerLobby } from '@/game/server/ServerLobby.ts';
import type { ClientMessage } from '@/game/client/ClientMessages.ts';
import type { OutMsg } from '@/game/server/ServerMessages.ts';
import type { ServerPlayer } from '@/game/shared/constants.ts';

type Lobbies = Map<string, ServerLobby>;

export class GameServer {
  #lobbies: Lobbies = new Map();

  constructor() {}

  getLobby(lobbyCode: string) {
    return this.#lobbies.get(lobbyCode)!;
  }

  createLobby() {
    const randomIntBetween = (min: number, max: number) => {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(
        Math.random() * (maxFloored - minCeiled + 1) + minCeiled
      );
    };

    const createRoomCode = () => {
      // A - Z in ASCII
      const getRandomChar = () => randomIntBetween(65, 90);

      const codes = new Array(6)
        .fill(0) // or else map doesnt work
        .map(getRandomChar);

      return String.fromCodePoint(...codes);
    };

    let lobbyCode = createRoomCode();

    while (this.#lobbies.has(lobbyCode)) {
      lobbyCode = createRoomCode();
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

  addPlayer(lobbyCode: string, name: string, player: ServerPlayer) {
    player.socket.addEventListener('close', () => {
      this.removePlayer(lobbyCode, name);
    });

    this.getLobby(lobbyCode).addPlayer(name, player);
  }

  removePlayer(lobbyCode: string, player: string) {
    const remainingPlayers = this.getLobby(lobbyCode).removePlayer(player);
    if (remainingPlayers !== 0) return;
    this.#lobbies.delete(lobbyCode);
  }

  suggestThing(lobbyCode: string, thing: string) {
    this.getLobby(lobbyCode).suggestThing(thing);
  }

  playerReady(lobbyCode: string, player: string) {
    this.getLobby(lobbyCode).playerReady(player);
  }

  voteFor(lobbyCode: string, thing: string, player: string) {
    this.getLobby(lobbyCode).voteFor(thing, player);
  }

  addConnection(socket: WebSocket) {
    socket.addEventListener('message', ({ data }) => {
      this.handleMsg(JSON.parse(data), socket);
    });
  }

  sendMsg(msg: OutMsg, socket: WebSocket) {
    console.log('sending message', msg);
    socket.send(JSON.stringify(msg));
  }

  handleMsg(msg: ClientMessage, socket: WebSocket) {
    console.log('new message', msg);

    switch (msg.type) {
      case 'create':
        this.createLobby();
        break;

      case 'join':
        this.addPlayer(msg.data.lobbyCode, msg.data.player, {
          socket,
          ready: false
        });
        break;

      case 'ready':
        this.playerReady(msg.data.lobbyCode, msg.data.player);
        break;

      case 'suggest':
        this.suggestThing(msg.data.lobbyCode, msg.data.thing);
        break;

      case 'vote':
        this.voteFor(msg.data.lobbyCode, msg.data.thing, msg.data.player);
        break;

      case 'leave':
        this.removePlayer(msg.data.lobbyCode, msg.data.player);
        break;

      default:
        console.error('Unsupported message:', msg);
        msg;
        break;
    }
  }
}
