import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Compila React + R3F en UN solo archivo: ../js/hero.js
// (la carpeta js/ del portafolio ya existe; NO se vacía).
export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: '../js',
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: 'src/main.jsx',
      formats: ['es'],
      fileName: () => 'hero.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
