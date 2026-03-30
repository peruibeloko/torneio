import type {
  HTMLInputTypeAttribute,
  InputEventHandler,
  KeyboardEventHandler,
} from "preact";
import { Signal, signal } from "@preact/signals";

export interface InputProps<T> {
  id?: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
  disabled?: boolean;
  signal: Signal<T>;
  onEnter?: () => void;
}

export function UncontrolledInput<T>(props: InputProps<T>) {
  const { signal, onEnter, ...rest } = props;

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (onEnter && e.key === "Enter") onEnter();
  };

  return (
    <input
      onInput={(e) => signal.value = e.currentTarget.value as T}
      onKeyDown={handleKeyPress}
      {...rest}
    />
  );
}

export function ControlledInput<T>(props: InputProps<T>) {
  const { signal, onEnter, ...rest } = props;

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (onEnter && e.key === "Enter") onEnter();
  };

  return (
    <input
      onInput={(e) => signal.value = e.currentTarget.value as T}
      value={signal.value as string}
      onKeyDown={handleKeyPress}
      {...rest}
    />
  );
}
