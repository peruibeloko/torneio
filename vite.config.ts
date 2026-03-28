import { defineConfig } from "vite";
import { fresh } from "@fresh/plugin-vite";

export default defineConfig({
  plugins: [fresh()],
  server: {
    proxy: {
      "/api/game": {
        target: "localhost:8000",
        ws: true,
        rewriteWsOrigin: true
      },
    },
  },
});
