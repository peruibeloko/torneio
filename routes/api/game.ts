import { define } from "@/utils.ts";
import { gameServer } from "@/main.ts";

export const handler = define.handlers({
  GET: (ctx) => handleRoute(ctx.req),
});

export function handleRoute(req: Request) {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  gameServer.addConnection(socket);
  return response;
}
