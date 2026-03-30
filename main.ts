import { GameServer } from "@/game/GameServer.ts";
import { App, cors, staticFiles } from "fresh";

export const app = new App();
export const gameServer = new GameServer();

app.use(cors({ origin: "localhost:8000" }));
app.use(staticFiles());
app.fsRoutes();

function gracefulShutdown() {
  console.log("Shutting down...");
}

Deno.addSignalListener("SIGTERM", gracefulShutdown);
