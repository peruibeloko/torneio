import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import deno from '@deno/vite-plugin';
import { fromFileUrl } from '@std/path';

export default defineConfig({
  plugins: [deno(), vue()],
  resolve: {
    alias: {
      '@': fromFileUrl(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true
      }
    }
  }
});
