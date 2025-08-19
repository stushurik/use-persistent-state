// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      name: 'UsePersistentState',
      fileName: (format) => `use-persistent-state.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
