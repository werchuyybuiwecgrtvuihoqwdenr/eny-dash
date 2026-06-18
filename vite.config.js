import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: this must match your GitHub repo name exactly,
// e.g. github.com/werchuyybuiwecgrtvuihoqwdenr/eny-dash
// then base should be '/eny-dash/'
export default defineConfig({
  plugins: [react()],
  base: '/eny-dash/',
})
