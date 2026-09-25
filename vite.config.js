import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/EliteHuman/',
  plugins: [react()],
  server: { port: 5173 },
  build: { target: 'es2020', sourcemap: true },
  test: { environment: 'node', include: ['{src,tools}/**/*.test.{js,mjs}'] },
});
