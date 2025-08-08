import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',  // point to root folder where index.html is
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
})
