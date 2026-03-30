import { handleRoute } from "@/routes/api/game.ts";
import { GameServer } from "@/game/GameServer.ts";

export const gameServer = new GameServer();

Deno.serve({ port: 8000 }, handleRoute);
