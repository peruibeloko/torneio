import { define } from "@/utils.ts";
import { createContext } from "preact";
import { GameClient } from "@/game/GameClient.ts";
import { useEffect } from "preact/hooks";

const client = new GameClient();
export const GameContext = createContext<GameClient>(client);

export default define.page(function App({ Component }) {
  useEffect(() => () => client.leaveLobby, []);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Torneio</title>
      </head>
      <body>
        <GameContext.Provider value={client}>
          <Component />
        </GameContext.Provider>
      </body>
    </html>
  );
});
