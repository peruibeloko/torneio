import { handleMessage } from "@/game/comms.ts";
import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET: (ctx) => handleRoute(ctx.req),
});

export function handleRoute(req: Request) {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("message", ({ data }) => {
    const res = handleMessage(JSON.parse(data), socket);
    if (res) socket.send(JSON.stringify(res));
  });

  return response;
}
