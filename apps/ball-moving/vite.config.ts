import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ball-moving/',
  build: {
    target: 'es2022',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@dimforge/rapier3d')) return 'rapier'
          if (id.includes('/three/')) return 'three'
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'react'
        },
      },
    },
  },
})
