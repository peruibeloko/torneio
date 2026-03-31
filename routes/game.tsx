import "@/assets/game.css";
import { define } from "@/utils.ts";
import { GameContent } from "../islands/GameContent.tsx";

export default define.page(function Game() {
  return <GameContent />;
});
