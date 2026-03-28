import { createRoomCode, define } from "@/utils.ts";

export const handler = define.handlers({
  async POST() {
    const code = createRoomCode();
    
    // const kv = await Deno.openKv();
    // kv.set(["rooms", code], {
    //   state: "lobby",
    // });
    // kv.close();

    return new Response(code);
  },
});
