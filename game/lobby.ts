import { LobbyManager } from "@/game/LobbyManager.ts";

export interface Player {
  socket: WebSocket;
  name: string;
}

export interface Lobby {
  code: string;
  players: Player[];
}

export type LobbyDict = Map<string, Player[]>;

/**
 * Updates the player list in KV, returns the new player list for broadcasting
 * @param lobbyCode lobby code
 * @param name player name
 * @returns updated player list
 */
export async function joinLobby(
  lobbyCode: string,
  name: string,
  socket: WebSocket,
) {
  const mgr = await LobbyManager.getManager();
  const playerList = mgr
    .addPlayer(lobbyCode, { name, socket })
    .map((p) => p.name);

  mgr.broadcast(lobbyCode, {
    type: "allPlayers",
    data: playerList,
  });

  return playerList;
}
