import "@/assets/home.css";
import { UncontrolledInput } from "@/components/Input.tsx";
import { CreateLobby } from "@/islands/CreateLobby.tsx";
import { JoinGame } from "@/islands/JoinGame.tsx";
import { define } from "@/utils.ts";
import { useSignal } from "@preact/signals";

export default define.page(function Home() {
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
          <JoinGame playerName={playerName.value} />
          <div class="vbar"></div>
          <CreateLobby playerName={playerName.value} />
        </section>
      </main>
    </>
  );
});
