import { Button } from "@/components/Button.tsx";
import { GameClient } from "@/game/GameClient.ts";

interface Props {
  client: GameClient;
  playerName: string;
}

export function CreateLobby(props: Props) {
  const createLobby = async () => {
    await props.client.createLobby(props.playerName);
    history.pushState({}, "", "/lobby");
  };

  return (
    <div class="side">
      <h2>Criar uma nova sala</h2>
      <Button id="createLobby" onClick={createLobby}>
        Criar
      </Button>
    </div>
  );
}
