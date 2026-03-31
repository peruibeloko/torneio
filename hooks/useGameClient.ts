import { useContext } from "preact/hooks";
import { GameContext } from "@/main.ts";

export function useGameClient() {
  return useContext(GameContext);
}
