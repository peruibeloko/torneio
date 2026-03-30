import { InMsg, OutMsg, ServerPlayer, Thing } from "@/game/constants.ts";
import { ServerLobby } from "./ServerLobby.ts";

type Lobbies = Map<string, ServerLobby>;

export class GameServer {
  #lobbies: Lobbies = new Map();

  constructor() {}

  static async getGameServer() {
    return Deno.env.get("DENO_DEPLOYMENT_ID")
      ? (await import("@/main.ts")).gameServer
      : (await import("@/wsProxy.ts")).gameServer;
  }

  getLobby(lobbyCode: string) {
    return this.#lobbies.get(lobbyCode)!;
  }

  createLobby() {
    const createRoomCode = () => {
      const ASCII_UPPERCASE_A_OFFSET = 65;
      const ALPHABET_LENGTH = 26;

      const getRandomChar = () =>
        ASCII_UPPERCASE_A_OFFSET + Math.ceil(Math.random() * ALPHABET_LENGTH);

      const codes = new Array(6)
        .fill(0) // or else map doesnt work
        .map(getRandomChar);

      return String.fromCodePoint(...codes);
    };

    const lobbyCode = createRoomCode();
    this.#lobbies.set(lobbyCode, new ServerLobby(lobbyCode));
    return lobbyCode;
  }

  addPlayer(lobbyCode: string, player: ServerPlayer) {
    this.getLobby(lobbyCode).addPlayer(player);
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

  voteFor(lobbyCode: string, thing: Thing, player: string) {
    this.getLobby(lobbyCode).voteFor(thing, player);
  }

  addConnection(socket: WebSocket) {
    socket.addEventListener("message", ({ data }) => {
      this.handleMsg(JSON.parse(data), socket);
    });
  }

  sendMsg(msg: OutMsg, socket: WebSocket) {
    socket.send(JSON.stringify(msg));
  }

  handleMsg(msg: InMsg, socket: WebSocket) {
    switch (msg.type) {
      case "create":
        this.createLobby();
        break;

      case "join":
        this.addPlayer(msg.data.lobbyCode, {
          name: msg.data.player,
          socket,
          ready: false,
        });
        break;

      case "ready":
        this.playerReady(msg.data.lobbyCode, msg.data.player);
        break;

      case "suggest":
        this.suggestThing(msg.data.lobbyCode, msg.data.thing);
        break;

      case "vote":
        this.voteFor(msg.data.lobbyCode, msg.data.thing, msg.data.player);
        break;

      case "leave":
        this.removePlayer(msg.data.lobbyCode, msg.data.player);
        break;

      default:
        console.error("Unsupported message:", msg);
        msg;
        break;
    }
  }
}
