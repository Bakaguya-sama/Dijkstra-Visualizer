import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Dijkstra-Visualizer/',
  plugins: [react()],
  test: { environment: 'node', exclude: ['e2e/**', 'node_modules/**'] },
});
