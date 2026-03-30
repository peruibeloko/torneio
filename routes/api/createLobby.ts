import { define } from "@/utils.ts";
import { GameServer } from "@/game/GameServer.ts";

export const handler = define.handlers({
  POST: async () => {
    const lobbyCode = (await GameServer.getGameServer()).createLobby();
    return new Response(JSON.stringify({ lobbyCode }));
  },
});
