import { Button } from "@/components/Button.tsx";
import { ControlledInput } from "@/components/Input.tsx";
import { GameClient } from "@/game/GameClient.ts";
import { useSignal } from "@preact/signals";

interface Props {
  client: GameClient;
}

export function SuggestionBox(props: Props) {
  const suggestion = useSignal("");
  const suggest = () => {
    props.client.suggest(suggestion.value);
    suggestion.value = "";
  };
  return (
    <div className="inputgroup">
      <ControlledInput
        type="text"
        placeholder="Qual sua sugestão?"
        signal={suggestion}
        onEnter={suggest}
      />
      <Button onClick={suggest}>Enviar</Button>
    </div>
  );
}
