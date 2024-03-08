import { addNewFiles, addDependencies, updateMainJs } from './index'

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
 * add tailwind
 * @return {*}
 */
export const addTailwind = async () => {
	await addDependencies({ devDep })
	addNewFiles(newFiles)
	updateMainJs(`import '../tailwind.css'`)
}
