import { GameClient } from "@/game/GameClient.ts";
import { useSignal } from "@preact/signals";
import { UncontrolledInput } from "@/components/Input.tsx";
import { Button } from "@/components/Button.tsx";

interface Props {
  client: GameClient;
  playerName: string;
}

export function JoinGame(props: Props) {
  const joinLobby = () => {
    props.client.joinLobby(props.playerName, lobbyCode.value);
    history.pushState({}, "", "/lobby");
  };

  const lobbyCode = useSignal('');

  return (
    <div class="side">
      <h2>Entrar em uma sala</h2>
      <UncontrolledInput
        type="text"
        placeholder="Código de sala"
        onInput={(e) => (lobbyCode.value = e.currentTarget.value)}
        onEnter={joinLobby}
      />
      <Button onClick={joinLobby}>Entrar</Button>
    </div>
  );
}
