import { UncontrolledInput } from "@/components/Input.tsx";
import { Signal } from "@preact/signals";

interface Props {
  playerName: Signal<string>;
}

export function NameInput(props: Props) {
  return (
    <UncontrolledInput
      type="text"
      placeholder="Qual vai ser seu nome?"
      signal={props.playerName}
    />
  );
}
