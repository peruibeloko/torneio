import type {
  HTMLInputTypeAttribute,
  InputEventHandler,
  KeyboardEventHandler,
} from "preact";

export interface InputProps {
  id?: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
  disabled?: boolean;
  onInput: InputEventHandler<HTMLInputElement>;
  onEnter?: () => void;
  value?: string;
}

export function Input(props: InputProps) {
  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (props.onEnter && e.key === "Enter") props.onEnter();
  };

  return (
    <input
      onKeyDown={handleKeyPress}
      {...props}
    />
  );
}
