import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import deno from '@deno/vite-plugin';

export default defineConfig({
  plugins: [deno(), vue()],
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
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true
      },
    }
  }
});
