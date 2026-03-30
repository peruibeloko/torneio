import { define } from "@/utils.ts";
import { createContext } from "preact";
import { GameClient } from "@/game/GameClient.ts";
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

export const GameContext = createContext<GameClient>({} as GameClient);

export default define.page(function App({ Component }) {
  const client = useSignal<GameClient>({} as GameClient);

  useEffect(() => {
    client.value = new GameClient();
    return () => {
      client.value!.leaveLobby();
    };
  }, []);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Torneio</title>
      </head>
      <body>
        <GameContext.Provider value={client.value}>
          <Component />
        </GameContext.Provider>
      </body>
    </html>
  );
});
