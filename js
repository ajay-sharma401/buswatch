import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',  // This points to root where index.html is located
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
})
