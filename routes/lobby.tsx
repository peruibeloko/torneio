import "@/assets/lobby.css";
import { GameContext } from "@/routes/_app.tsx";
import { define } from "@/utils.ts";
import { computed } from "@preact/signals";
import { useContext } from "preact/hooks";
import { SuggestionBox } from "@/islands/SuggestionBox.tsx";

export default define.page(function Lobby(ctx) {
  const client = useContext(GameContext);

  const players = computed(() =>
    client
      .players
      .value
      .map((p) => <li key={p}>{p}</li>)
  );

  const things = computed(() =>
    client
      .things
      .value
      .map((t) => <li key={t}>{t}</li>)
  );

  return (
    <>
      <header>
        <h1>
          LOBBY
        </h1>
      </header>
      <main>
        <div>
          <section>
            <h2>Jogadores</h2>
            <ul>
              {players}
            </ul>
          </section>
          <div className="vbar"></div>
          <section>
            <h2>Coisas</h2>
            <SuggestionBox client={client} />
            <ul>
              {things}
            </ul>
          </section>
        </div>
        <button type="button">ESTOU PRONTO!</button>
      </main>
    </>
  );
});
