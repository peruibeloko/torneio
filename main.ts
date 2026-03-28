import { App, cors, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { LobbyManager } from "./game/LobbyManager.ts";

function gracefulShutdown() {
  console.log("Shutting down...");
  kv.close();
}

export const app = new App<State>();
export const lobbyManager = new LobbyManager();
export const kv = await Deno.openKv();

app.use(cors({ origin: "localhost:8000" }));
app.use(staticFiles());
app.fsRoutes();

Deno.addSignalListener("SIGTERM", gracefulShutdown);
