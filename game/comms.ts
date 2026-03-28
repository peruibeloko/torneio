import { joinLobby } from "@/game/lobby.ts";
import { InMsg } from "@/game/constants.ts";

export function handleMessage(msg: InMsg, socket: WebSocket) {
  switch (msg.type) {
    case "join":
      return joinLobby(msg.data.code, msg.data.name, socket);

    case "suggest":
      // suggest logic
      break;

    case "vote":
      // vote logic
      break;

    default:
      console.error("Unsupported message:", msg);
      return msg;
  }
}
