import "@/assets/home.css";
import { Button } from "@/components/Button.tsx";
import { Input } from "@/components/Input.tsx";
import { GameContext } from "@/routes/_app.tsx";
import { define } from "@/utils.ts";
import { useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";

export default define.page(function Home(ctx) {
  const client = useContext(GameContext);

  const playerName = useSignal("");
  const joinCode = useSignal("");

  const createLobby = async () => {
    await client.createLobby(playerName.value);
    history.pushState({}, "", "/lobby");
  };

  const joinLobby = () => {
    client.joinLobby(playerName.value, joinCode.value);
    history.pushState({}, "", "/lobby");
  };

  return (
    <>
      <header>
        <h1>
          BEM VINDO AO TORNEIO DAS COISAS
        </h1>
      </header>
      <main>
        <Input
          type="text"
          placeholder="Qual vai ser seu nome?"
          onInput={(e) => playerName.value = e.currentTarget.value}
        />
        <section>
          <div class="side">
            <h2>Entrar em uma sala</h2>
            <Input
              type="text"
              placeholder="Código de sala"
              onInput={(e) => joinCode.value = e.currentTarget.value}
              onEnter={joinLobby}
            />
            <Button onClick={joinLobby}>
              Entrar
            </Button>
          </div>
          <div class="vbar"></div>
          <div class="side">
            <h2>Criar uma nova sala</h2>
            <Button id="createLobby" onClick={createLobby}>Criar</Button>
          </div>
        </section>
      </main>
    </>
  );
});
