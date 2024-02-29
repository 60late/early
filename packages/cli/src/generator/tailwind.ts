import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const template = [
	{
		filePath: 'tailwind.config.js',
		content: `
export default {
  corePlugins: {
    preflight: false
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: []
}
    `
	},
	{
		filePath: 'postcss.config.js',
		content: `
module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {},
  },
}
    `
	},
	{
		filePath: 'tailwind.css',
		content: `
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
    `
	}
]

export const addTailwind = () => {
	console.log('执行 add tailwind')
	const rootPath = path.resolve(process.cwd())
	template.forEach((item) => {
		const filePath = path.resolve(rootPath, 'early-project', item.filePath)
		writeFileSync(filePath, item.content)
	})
	let mainJsString = readFileSync(path.resolve(rootPath, 'early-project', 'src', 'main.js'), 'utf-8')
	mainJsString = `import './tailwind.css'\n${mainJsString}`
	writeFileSync(path.resolve(rootPath, 'early-project', 'src', 'main.js'), mainJsString)
}
