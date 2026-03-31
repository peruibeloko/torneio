import { Button } from "@/components/Button.tsx";
import { UncontrolledInput } from "@/components/Input.tsx";
import { useGameClient } from "@/hooks/useGameClient.ts";
import { Signal, useSignal } from "@preact/signals";

interface Props {
  playerName: Signal<string>;
}

export function JoinGame(props: Props) {
  const client = useGameClient();

  const joinLobby = () => {
    client.joinLobby(props.playerName.value, lobbyCode.value);
    history.pushState({}, "", "/lobby");
  };

  const lobbyCode = useSignal('');

  return (
    <div class="side">
      <h2>Entrar em uma sala</h2>
      <UncontrolledInput
        type="text"
        placeholder="Código de sala"
        signal={lobbyCode}
        onEnter={joinLobby}
      />
      <Button onClick={joinLobby}>Entrar</Button>
    </div>
  );
}
