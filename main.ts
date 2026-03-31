import "preact/debug";
import { GameServer } from "@/game/GameServer.ts";
import { App, cors, staticFiles } from "fresh";
import { createContext } from "preact";
import { GameClient } from "@/game/GameClient.ts";

export const app = new App();
export const gameServer = new GameServer();

export const GameContext = createContext(new GameClient());

app.use(cors({ origin: "localhost:8000" }));
app.use(staticFiles());
app.fsRoutes();

function gracefulShutdown() {
  console.log("Shutting down...");
}

Deno.addSignalListener("SIGTERM", gracefulShutdown);
