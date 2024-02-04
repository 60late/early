import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  console.log('cur mode:', mode)
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          // 全局变量
          additionalData: `@import "@/assets/css/common.less";`
        }
      }
    },
    esbuild: {
      pure: mode === 'production' ? ['console.log'] : true,
      drop: ['debugger']
    },
    build: {
      sourcemap: mode === 'production' ? false : true,
      rollupOptions: {
        output: {
          chunkFileNames: () => {
            return 'assets/js/[name]-[hash].js'
          },
          assetFileNames: (assetsInfo) => {
            const ext = assetsInfo.name.split('.')[1]
            if (/\.(css)$/.test(assetsInfo.name)) {
              return `assets/css/[name]-[hash].${ext}`
            }
            if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(assetsInfo.name)) {
              return `assets/img/[name]-[hash].${ext}`
            }
            return `assets/${ext}/[name]-[hash].${ext}`
          }
        }
      }
    }
  }
})
