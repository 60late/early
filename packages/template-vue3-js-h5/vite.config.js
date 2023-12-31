import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import minipic from 'vite-plugin-minipic'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const mode = 'development'
const pathSrc = path.resolve(__dirname, 'src')
const env = loadEnv(mode, process.cwd())

export default defineConfig({
	plugins: [
		vue(),
		minipic({
			cache: false
		})
	],
	define: {
		'process.env': loadEnv(mode, process.cwd(), '')
	},
	resolve: {
		alias: {
			'@': pathSrc
		}
	},
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				additionalData: `@import "${path.resolve(
					__dirname,
					'src/assets/css/common.less'
				)}";`
			}
		}
	},
	server: {
		host: '0.0.0.0',
		port: Number(env.VITE_APP_PORT),
		open: true, // 运行是否自动打开浏览器
		proxy: {
			// 反向代理解决跨域
			[env.VITE_APP_BASE_API]: {
				target: 'http://localhost:8989',
				changeOrigin: true,
				rewrite: (path) =>
					path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
			}
		}
	}
})
