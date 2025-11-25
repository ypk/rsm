// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://mouradakkache.github.io',
  base: '/',
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true
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