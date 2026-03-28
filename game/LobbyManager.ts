import { OutMsg } from "@/game/constants.ts";
import { LobbyDict, Player } from "@/game/lobby.ts";
import { kv } from "@/main.ts";
import { KEYS } from "@/game/constants.ts";
// import { collectKv } from "../utils.ts";

export class LobbyManager {
  #lobbies: LobbyDict = new Map();

  constructor() {}

  // future implementation for reconnection
  //
  // async connect(lobbyCode: string) {
  //   const players = await collectKv(
  //     kv.list({ prefix: KEYS.LOBBY_PLAYERS(lobbyCode) }),
  //   );

  //   for (const player of players) {
  //     this.#lobbies.set(lobbyCode, players)
  //   }
  // }

  static async getManager() {
    return Deno.env.get("DENO_DEPLOYMENT_ID")
      ? (await import("@/main.ts")).lobbyManager
      : (await import("@/wsProxy.ts")).lobbyManager;
  }

  broadcast(lobbyCode: string, msg: OutMsg) {
    for (const { socket } of this.#lobbies.get(lobbyCode)!) {
      if (socket.readyState !== WebSocket.OPEN) continue;
      socket.send(JSON.stringify(msg));
    }
  }

  createRoomCode() {
    const ASCII_UPPERCASE_A_OFFSET = 65;
    const ALPHABET_LENGTH = 26;

    const getRandomChar = () =>
      ASCII_UPPERCASE_A_OFFSET + Math.ceil(Math.random() * ALPHABET_LENGTH);

    const codes = new Array(6)
      .fill(0) // or else map doesnt work
      .map(getRandomChar);

    return String.fromCodePoint(...codes);
  }

  createPlayerCode() {
    const randomInt = () => Math.ceil(Math.random() * 9);
    const code = new Array(4)
      .fill(0)
      .map(randomInt);
    return code.join("");
  }

  createLobby() {
    const lobbyCode = this.createRoomCode();

    this.#lobbies.set(lobbyCode, []);

    kv.set(KEYS.LOBBY_INFO(lobbyCode), { state: "lobby" });
    kv.set(KEYS.LOBBY_PLAYERS(lobbyCode), []);
    kv.set(KEYS.LOBBY_THINGS(lobbyCode), {});

    return lobbyCode;
  }

  addPlayer(lobbyCode: string, player: Player) {
    const players = this.#lobbies.get(lobbyCode)!;
    player.name = player.name + "#" + this.createPlayerCode();
    const updatedPlayers = [...players, player];
    this.#lobbies.set(lobbyCode, updatedPlayers);
    kv.set(KEYS.LOBBY_PLAYERS(lobbyCode), updatedPlayers);
    return updatedPlayers;
  }
}
