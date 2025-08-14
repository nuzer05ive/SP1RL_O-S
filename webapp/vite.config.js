import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// keep base “/” for Netlify; set to '/<repo>/' if deploying to GH Pages
export default defineConfig({
  plugins: [vue()],
  server: { port: 5173, host: true },
  build: { sourcemap: true }
})
