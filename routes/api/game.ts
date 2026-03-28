import { define, GameMessage } from "@/utils.ts";

export const handler = define.handlers((ctx) => {
  console.log("got request on ws route");

  if (ctx.req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(ctx.req);

  socket.addEventListener("open", () => {
    console.log("Connected");
  });

  socket.addEventListener("close", () => {
    console.log("Disconnected");
  });

  socket.addEventListener("message", ({ data }) => {
    const gameMessage = data as GameMessage;

    switch (gameMessage.type) {
      case "join":
        // join logic
        break;
      case "suggest":
        // suggest logic
        break;
      case "vote":
        // vote logic
        break;
      default:
        console.log("Unsupported message:", gameMessage["type"]);
        break;
    }

    socket.send(data);
  });

  return response;
});
