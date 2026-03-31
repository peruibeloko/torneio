import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import deno from '@deno/vite-plugin';

export default defineConfig({
  plugins: [vue(), deno()],
  root: './',
  resolve: {
    alias: [{ find: '@', replacement: './' }]
  },
  build: {
    sourcemap: true
  },
  server: {
    port: 3000,
    proxy: {
      '/api/game': {
        target: 'localhost:8000',
        changeOrigin: true,
        ws: true
      },
      '/api/createLobby': {
        target: 'localhost:8000',
        changeOrigin: true
      }
    }
  }
});
