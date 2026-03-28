import { createDefine } from "fresh";

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  shared: string;
}

export type GameMessage =
  | {
    type: "join";
    code: string;
  }
  | {
    type: "suggest";
    thing: string;
  }
  | {
    type: "vote";
    option: number;
  };

export const define = createDefine<State>();

export const createRoomCode = () => {
  const ASCII_UPPERCASE_A_OFFSET = 65;
  const ALPHABET_LENGTH = 26;

  const getRandomChar = () =>
    ASCII_UPPERCASE_A_OFFSET + Math.floor(Math.random() * ALPHABET_LENGTH);

  const codes = new Array(6)
    .fill(0) // or else map doesnt work
    .map(getRandomChar);

  return String.fromCodePoint(...codes);
};
