import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@lootupspace/shared': fileURLToPath(new URL('../../packages/shared/src/browser.ts', import.meta.url)),
      '@lootupspace/database': fileURLToPath(new URL('../../packages/database/src/index.ts', import.meta.url)),
      'next/navigation': fileURLToPath(new URL('./src/lib/navigation.ts', import.meta.url))
    }
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router') ||
            id.includes('/node_modules/scheduler/')
          ) {
            return 'vendor-react';
          }
          if (id.includes('/node_modules/lucide-react/')) {
            return 'vendor-icons';
          }
          if (id.includes('/node_modules/qrcode/')) {
            return 'vendor-qr';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  define: {
    'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
