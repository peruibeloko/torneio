import "@/assets/game.css";
import { GameContext } from "@/routes/_app.tsx";
import { define } from "@/utils.ts";
import { useContext } from "preact/hooks";
import { GameContent } from "../islands/GameContent.tsx";

export default define.page(function Game(ctx) {
  const client = useContext(GameContext);

  return <GameContent client={client} />;
});
