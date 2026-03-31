import "@/assets/lobby.css";
import { SuggestionBox } from "@/islands/SuggestionBox.tsx";
import { define } from "@/utils.ts";
import { computed } from "@preact/signals";
import { useGameClient } from "@/hooks/useGameClient.ts";
import { Button } from "../components/Button.tsx";

export default define.page(function Lobby() {
  const client = useGameClient();

  const players = computed(() =>
    client.players.value.map((p) => <li key={p}>{p}</li>)
  );

  const things = computed(() =>
    client.things.value.map((t) => <li key={t}>{t}</li>)
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
            <SuggestionBox />
            <ul>
              {things}
            </ul>
          </section>
        </div>
        <Button onClick={client.ready}>ESTOU PRONTO!</Button>
      </main>
    </>
  );
});
