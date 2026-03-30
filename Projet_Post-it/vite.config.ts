// faite par sekou amara bamba
// Ce fichier contient la configuration de base de Vite pour la compilation et le développement. Il définit le plugin Vue et configure les alias de chemin (comme le raccourci '@' pour viser le dossier 'src').
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
// Toucher par SEKOU AMARA BAMBA
