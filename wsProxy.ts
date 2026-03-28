import { handleRoute } from "@/routes/api/game.ts";
import { LobbyManager } from "@/game/LobbyManager.ts";

export const lobbyManager = new LobbyManager();

Deno.serve({ port: 8000 }, handleRoute);
