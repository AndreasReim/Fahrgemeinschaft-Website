import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Für GitHub Pages: VITE_BASE_PATH=/Fahrgemeinschaft-Website/ setzen
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  plugins: [react()],
  base,
})
