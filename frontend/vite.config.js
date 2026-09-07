import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // IPv4(127.0.0.1)からも接続できるよう、全インターフェースでlistenする
    host: '0.0.0.0',
    // /api へのリクエストをバックエンド(Node.js/Express)へプロキシする
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
