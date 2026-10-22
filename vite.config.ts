import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    tailwindcss(),
    ...(mode === 'analyze'
      ? [visualizer({ filename: '.analysis/bundle-report.html', gzipSize: true })]
      : []),
  ],
  optimizeDeps: {
    noDiscovery: true,
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      'i18next',
      'react-i18next',
      'lucide-react',
      'zod',
      'react-hook-form',
      '@hookform/resolvers/zod',
    ],
  },
  build: { outDir: mode === 'analyze' ? '.analysis' : 'dist', chunkSizeWarningLimit: 1300 },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
}));
