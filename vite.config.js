import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(__dirname, 'assets'),
  build: {
    target: 'es2020',
    sourcemap: false
  }
})
