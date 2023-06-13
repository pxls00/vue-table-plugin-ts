import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  server: {
    port: 8080,
    host: true,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/assets/styles/theme/fonts/index.scss";
          @import "./src/assets/styles/theme/colors/index.scss";
          @import "./src/assets/styles/variables.scss";
          @import "./src/assets/styles/helpers/ui.scss";
        `,
      },
    },
  },
})
