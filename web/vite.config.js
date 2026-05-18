import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Project Pages URL: /<repo-name>/
  base: '/The-Geography-of-Prison-Conditions/',
})
