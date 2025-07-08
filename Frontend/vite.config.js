import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist', // output directory for the build
    emptyOutDir: true, // clear the output directory before building
  },
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
  },
  proxy: {
    '/api': { // proxy api requests to the server
    target: 'http://localhost:3000/', //  target server
    changeOrigin: true,
    },
  },

})
// This Vite configuration file sets up a React project with SWC support.
// It also configures the development server to open the browser automatically