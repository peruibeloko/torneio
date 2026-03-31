import { Button } from "@/components/Button.tsx";
import { useGameClient } from "@/hooks/useGameClient.ts";

interface Props {
  playerName: string;
}

export function CreateLobby(props: Props) {
  const client = useGameClient();

  const createLobby = async () => {
    await client.createLobby(props.playerName);
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
