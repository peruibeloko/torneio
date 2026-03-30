import "@/assets/game.css";
import { GameContext } from "@/routes/_app.tsx";
import { define } from "@/utils.ts";
import { useSignal } from "@preact/signals";
import { useContext, useRef } from "preact/hooks";
import { Button } from "@/islands/Button.tsx";

export default define.page(function Game(ctx) {
  const client = useContext(GameContext);

  const vote = (thing: "L" | "R") => () => {
    const isL = thing === "L";
    client.vote(isL ? thingL : thingR);
    if (isL) {
      disabledL.value = true;
      disabledR.value = false;
    } else {
      disabledL.value = false;
      disabledR.value = true;
    }
  };

  client.roundEndLogic = () => {
    winnerModal.current?.showModal();
  };

  client.roundStartLogic = () => {
    winnerModal.current?.close();
    disabledL.value = false;
    disabledR.value = false;
  };

  const [votesL, votesR] = client.votes;
  const [thingL, thingR] = client.roundThings;
  const disabledL = useSignal(false);
  const disabledR = useSignal(false);

  const winnerModal = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog ref={winnerModal} id="winner">
        <h2>Vencedor{client.gameEnd.value ? null : " da rodada"}</h2>
        <span>{client.winner.value}</span>
      </dialog>

      <header>
        <h1>RODADA {client.round}</h1>
      </header>

      <main>
        <section>
          <span>{thingL}</span>
          <Button onClick={vote("L")} disabled={disabledL.value}>VOTAR</Button>
          <ul>
            {votesL.value.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
        <div className="vbar"></div>
        <section>
          <span>{thingR}</span>
          <Button onClick={vote("R")} disabled={disabledR.value}>VOTAR</Button>
          <ul>
            {votesR.value.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      </main>
    </>
  );
});
