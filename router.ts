import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Lobby from "@/pages/Lobby.vue";
import Game from "@/pages/Game.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/lobby",
      name: "lobby",
      component: Lobby,
    },
    {
      path: "/game",
      name: "game",
      component: Game,
    },
  ],
});
