import { defineConfig } from 'tsup'

export default defineConfig([
	{
		entry: ['packages/ozzy-cli/bin/index.ts'],
		format: ['cjs', 'esm', 'iife'],
		outDir: 'packages/ozzy-cli/dist',
		dts: true, // 添加 .d.ts 文件
		metafile: false, // 添加 meta 文件
		minify: false, // 压缩
		splitting: false,
		sourcemap: true, // 添加 sourcemap 文件
		clean: true // 是否先清除打包的目录，例如 dist
	}
])
