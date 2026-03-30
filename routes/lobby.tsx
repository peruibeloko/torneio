import "@/assets/lobby.css";
import { Button } from "@/islands/Button.tsx";
import { Input } from "@/islands/Input.tsx";
import { GameContext } from "@/routes/_app.tsx";
import { define } from "@/utils.ts";
import { computed, useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";

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

  const suggestion = useSignal("");
  const suggest = () => {
    client.suggest(suggestion.value);
    suggestion.value = "";
  };

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
            <div className="inputgroup">
              <Input
                type="text"
                placeholder="Qual sua sugestão?"
                value={suggestion.value}
                onInput={(e) => suggestion.value = e.currentTarget.value}
                onEnter={suggest}
              />
              <Button onClick={suggest}>Enviar</Button>
            </div>
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
