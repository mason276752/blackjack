import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'assets',
  base: process.env.GITHUB_ACTIONS ? '/blackjack/' : '/',
})
