import { GameContext } from "@/main.ts";
import { define } from "@/utils.ts";
import "preact/debug";
import { useContext, useEffect } from "preact/hooks";

export default define.page(function App({ Component }) {
  const client = useContext(GameContext);

  useEffect(() => {
    client.setup();

    return () => {
      client.leaveLobby();
    };
  }, []);

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Torneio</title>
      </head>
      <body f-client-nav>
        <GameContext.Provider value={client}>
          <Component />
        </GameContext.Provider>
      </body>
    </html>
  );
});
