import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'WebLLMApp',
      formats: ['es'],
      fileName: () => 'main.js'
    },
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    rollupOptions: {
      // Externaliser l'import talk-control pour éviter la duplication
      external: (id) => {
        return id.includes('web_modules/talk-control');
      },
      output: {
        dir: 'dist',
        // Keeper les chemins relatifs tels quels pour les imports externes
        paths: {}
      }
    }
  },
  server: {
    port: 5173,
    open: false,
    watch: {
      include: ['src/**/*'],
      ignore: ['node_modules/**']
    }
  }
});
