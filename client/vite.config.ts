// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: true,
//     proxy: {
//       '/graphql': {
//         target: 'http://localhost:3001',
//         secure: false,
//         changeOrigin: true
//       }
//     }
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../client/dist', // Default — just ensure this exists
  }
})