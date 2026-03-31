import { Button } from "@/components/Button.tsx";
import { ControlledInput } from "@/components/Input.tsx";
import { useSignal } from "@preact/signals";
import { useGameClient } from "../hooks/useGameClient.ts";

export function SuggestionBox() {
  const client = useGameClient();
  const suggestion = useSignal("");
  const suggest = () => {
    client.suggest(suggestion.value);
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
