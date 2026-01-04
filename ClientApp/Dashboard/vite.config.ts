import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Bundle analyzer - run with ANALYZE=true npm run build
    ...(process.env.ANALYZE ? [visualizer({ filename: 'dist/stats.html', open: true })] : []),
    // Compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3018,
    host: true
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'chart-vendor': ['recharts', 'chart.js', 'react-chartjs-2'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Large libraries
          'i18n': ['react-i18next', 'i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
          'table': ['@tanstack/react-table'],
          'date': ['date-fns'],
        },
      },
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify for better performance
    minify: 'esbuild',
    // Target modern browsers
    target: 'esnext',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'recharts',
      'react-hook-form',
      'react-i18next',
    ],
  },
})
