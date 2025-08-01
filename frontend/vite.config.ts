import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  // When using custom domain (inspector.wtf), serve from root
  // When using GitHub Pages subdomain, serve from /inspector-demo/
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
})
