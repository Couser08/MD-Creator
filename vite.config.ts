import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: true
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg'],
      manifest: {
        name: 'MD Writer — Markdown Editor',
        short_name: 'MD Writer',
        description: 'A clean, fast, and distraction-free Markdown editor and workspace.',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('mermaid')) {
              return 'vendor-mermaid';
            }
            if (id.includes('katex')) {
              return 'vendor-katex';
            }
            if (
              id.includes('react-markdown') ||
              id.includes('remark') ||
              id.includes('rehype') ||
              id.includes('micromark') ||
              id.includes('unist') ||
              id.includes('vfile') ||
              id.includes('mdast') ||
              id.includes('hast')
            ) {
              return 'vendor-markdown';
            }
            if (id.includes('dexie') || id.includes('@supabase') || id.includes('@tanstack')) {
              return 'vendor-db';
            }
            if (id.includes('lucide-react') || id.includes('framer-motion') || id.includes('zustand')) {
              return 'vendor-ui';
            }
          }
        }
      }
    }
  }
});

