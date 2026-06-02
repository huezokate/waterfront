import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base '/waterfront/' for the GitHub Pages project site; '/' in dev.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/waterfront/' : '/',
  plugins: [react()],
}))
