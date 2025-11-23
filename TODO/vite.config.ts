import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'serve' ? '/' : '/assets/todo_spa_app/spa/',
  build: {
    outDir: '../todo_spa_app/public/spa',
    emptyOutDir: true,
  }
}))
