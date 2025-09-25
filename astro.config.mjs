// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ypk.github.io',
  base: '/rsm/',
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true,
      allowedHosts: ['884bb541bd08.ngrok-free.app']
    },
    build: {
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro']
          }
        }
      }
    }
  },
  output: 'static',
  compressHTML: true
});