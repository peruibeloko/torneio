import { Button } from "@/components/Button.tsx";
import { useGameClient } from "@/hooks/useGameClient.ts";
import { Signal } from "@preact/signals";

interface Props {
  playerName: Signal<string>;
}

export function CreateLobby(props: Props) {
  const client = useGameClient();

  const createLobby = async () => {
    await client.createLobby(props.playerName.value);
  };

  return (
    <div class="side">
      <h2>Criar uma nova sala</h2>
      <a id="createLobby" onClick={createLobby} href="/lobby">Criar</a>
    </div>
  );
}
