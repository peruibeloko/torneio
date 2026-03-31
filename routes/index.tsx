import "@/assets/home.css";
import { CreateLobby } from "@/islands/CreateLobby.tsx";
import { JoinGame } from "@/islands/JoinGame.tsx";
import { define } from "@/utils.ts";
import { useSignal } from "@preact/signals";
import { NameInput } from "../islands/NameInput.tsx";
import { Partial } from "fresh/runtime";

export default define.page(function Home() {
  const playerName = useSignal("");

  return (
    <Partial name="home">
      <header>
        <h1>BEM VINDO AO TORNEIO DAS COISAS</h1>
      </header>
      <main>
        <NameInput playerName={playerName} />
        <section>
          <JoinGame playerName={playerName} />
          <div class="vbar"></div>
          <CreateLobby playerName={playerName} />
        </section>
      </main>
    </Partial>
  );
});
