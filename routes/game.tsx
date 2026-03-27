import { define } from "@/utils.ts";
import "@/assets/game.css";
import { useRef } from "preact/hooks";

export default define.page(function Game(ctx) {
  const roundWinner = useRef<HTMLDialogElement>(null);

  return (
    <>
      <dialog
        ref={roundWinner}
        id="roundWinner"
      >
        <h2>Vencedor da rodada</h2>
        <span>COISA 2</span>
      </dialog>
      <dialog id="gameWinner">
        <h2>Vencedor</h2>
        <span>COISA 2</span>
      </dialog>
      <header>
        <h1>RODADA 1</h1>
      </header>
      <main>
        <section>
          <span>COISA 1</span>
          <button type="button">VOTAR</button>
          <ul>
            <li>jogador</li>
            <li>jogador</li>
            <li>jogador</li>
            <li>jogador</li>
          </ul>
        </section>
        <div className="vbar"></div>
        <section>
          <span>COISA 2</span>
          <button type="button">VOTAR</button>
          <ul>
            <li>jogador</li>
            <li>jogador</li>
            <li>jogador</li>
            <li>jogador</li>
          </ul>
        </section>
      </main>
    </>
  );
});
