import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Относительный base в сборке позволяет одному и тому же артефакту работать
// и из корня (`npm run preview`), и из подкаталога репозитория на GitHub Pages.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react(), tailwindcss()],
}));
