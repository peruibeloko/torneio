import { define } from "@/utils.ts";
import "@/assets/home.css";

export default define.page(function Home(ctx) {
  return (
    <>
      <header>
        <h1>
          BEM VINDO AO TORNEIO DAS COISAS
        </h1>
      </header>
      <main>
        <input type="text" placeholder="Qual vai ser seu nome?" />
        <section>
          <div class="side">
            <h2>Entrar em uma sala</h2>
            <input type="text" placeholder="Código de sala" />
            <button type="button">Entrar</button>
          </div>
          <div class="vbar"></div>
          <div  class="side">
            <h2>Criar uma nova sala</h2>
            <button type="button" id="createRoom">Criar</button>
          </div>
        </section>
      </main>
    </>
  );
});
