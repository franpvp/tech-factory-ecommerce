import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false,
    }),
  ],

  server: {
    historyApiFallback: true,

    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
    },
  },

  build: {
    sourcemap: false,
    assetsInlineLimit: 0,

    minify: "terser",
    terserOptions: {
      format: {
        comments: false,
      },
    },
  },
})