import { LobbyManager } from "@/game/LobbyManager.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  async POST() {
    const mgr = await LobbyManager.getManager();
    return new Response(JSON.stringify({
      lobbyCode: mgr.createLobby(),
    }));
  },
});
