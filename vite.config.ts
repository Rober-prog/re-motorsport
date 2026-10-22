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
      '@react-three/fiber',
      '@react-three/drei/core/Progress',
      '@react-three/drei/core/Gltf',
      '@react-three/drei/core/Environment',
      '@react-three/drei/core/Lightformer',
      '@react-three/drei/web/Html',
      '@react-three/drei/core/ContactShadows',
      '@react-three/drei/core/AdaptiveDpr',
      'three',
      'gsap',
      'gsap/ScrollTrigger',
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
