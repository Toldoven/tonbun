import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { fileURLToPath } from "url";
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  optimizeDeps: { exclude: ["swiper/vue", "swiper/types"], },
  resolve:{
    alias:{
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
      "@rs-ts": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src-tauri/bindings"),
    },
  },
})
