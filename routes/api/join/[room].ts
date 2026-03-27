import { define } from "@/utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const roomCode = ctx.params.room;
    return new Response();
  },
});
