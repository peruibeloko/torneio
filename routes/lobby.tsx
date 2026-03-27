import { define } from "@/utils.ts";
import "@/assets/lobby.css"

export default define.page(function Lobby(ctx) {
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
              <li>mano</li>
              <li>mano</li>
              <li>mano</li>
              <li>mano</li>
              <li>mano</li>
            </ul>
          </section>
          <div className="vbar"></div>
          <section>
            <h2>Coisas</h2>
            <div className="inputgroup">
              <input type="text" placeholder="Qual sua sugestão?" />
              <button type="button">Enviar</button>
            </div>
            <ul>
              <li>nome</li>
              <li>nome</li>
              <li>nome</li>
              <li>nome</li>
              <li>nome</li>
              <li>nome</li>
            </ul>
          </section>
        </div>
        <button type="button">ESTOU PRONTO!</button>
      </main>
    </>
  );
});
