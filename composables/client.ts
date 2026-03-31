import { inject } from "vue";
import { ClientKey } from "@/main.ts";
import { GameClient } from "@/game/GameClient.ts";

export const useGameClient = () => inject<GameClient>(ClientKey)!;
