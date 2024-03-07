import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { addNewFiles, addDependencies } from './index'

/* tailwind devDependencies **/
const devDep = ['tailwindcss', 'postcss', 'autoprefixer']

/* tailwind new files **/
const newFiles = [
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
		filePath: 'postcss.config.cjs',
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

/**
 * update tailwind relate files
 * @return {*}
 */
const updateTailwindFiles = () => {
	// TODO: 修改这里的位置和early-project路径
	const rootPath = path.resolve(process.cwd(), '../')
	let mainJsString = readFileSync(path.resolve(rootPath, 'early-project', 'src', 'main.js'), 'utf-8')
	if (!mainJsString.includes(`import '../tailwind.css'`)) {
		mainJsString = `import '../tailwind.css'\n${mainJsString}`
		writeFileSync(path.resolve(rootPath, 'early-project', 'src', 'main.js'), mainJsString)
	}
}

/**
 * add tailwind
 * @return {*}
 */
export const addTailwind = async () => {
	await addDependencies({ devDep })
	addNewFiles(newFiles)
	updateTailwindFiles()
}
