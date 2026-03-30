import "@/assets/home.css";
import { UncontrolledInput } from "@/components/Input.tsx";
import { JoinGame } from "@/islands/JoinGame.tsx";
import { GameContext } from "@/routes/_app.tsx";
import { define } from "@/utils.ts";
import { useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { CreateLobby } from "../islands/CreateLobby.tsx";

export default define.page(function Home(ctx) {
  const client = useContext(GameContext);

  const playerName = useSignal("");

  return (
    <>
      <header>
        <h1>BEM VINDO AO TORNEIO DAS COISAS</h1>
      </header>
      <main>
        <UncontrolledInput
          type="text"
          placeholder="Qual vai ser seu nome?"
          signal={playerName}
        />
        <section>
          <JoinGame client={client} playerName={playerName.value} />
          <div class="vbar"></div>
          <CreateLobby client={client} playerName={playerName.value} />
        </section>
      </main>
    </>
  );
});
