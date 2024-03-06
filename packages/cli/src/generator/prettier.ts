import { addNewFiles, addDependencies, updatePackageJson } from './index'
import { findPkgManager } from './index'

/* prettier and eslint devDependencies **/
const devDep = [
	'eslint',
	'prettier',
	'eslint-plugin-vue',
	'eslint-config-prettier',
	'eslint-plugin-prettier',
	'husky',
	'lint-staged'
]

/* prettier and eslint new files **/
const newFiles = [
	{
		filePath: '.eslintrc.cjs',
		content: `
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:prettier/recommended'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'vue/multi-word-component-names': 'off'
  },
}
    `
	},
	{
		filePath: '.vscode/settings.json',
		content: `
// 开启自动修复
"editor.codeActionsOnSave": {
    "source.fixAll": false,
    "source.fixAll.eslint": true
},
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
  "vue",
  "html",
  "markdown",
  "json",
  "jsonc",
  "yaml"
],
  `
	},
	{
		filePath: '.prettierrc.cjs',
		content: `
module.exports = {
  // 一行的字符数，如果超过会进行换行，默认为80
  printWidth: 120,
  // 一个tab代表几个空格数，默认为2
  tabWidth: 2,
  // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
  useTabs: false,
  // 字符串是否使用单引号，默认为false，使用双引号
  singleQuote: true,
  // 行位是否使用分号，默认为true
  semi: false,
  // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  trailingComma: 'none',
  // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  bracketSpacing: true
}
    `
	}
]

const updatePrettierJson = () => {
	const updateJson = {
		scripts: {
			lint: 'eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix',
			format: 'prettier --write "./**/*.{css,less,vue,html}" --fix',
			prepare: 'husky init',
			'lint-staged': 'lint-staged'
		},
		'lint-staged': {
			'*.{js,ts}': ['eslint --fix', 'prettier --write'],
			'*.{cjs,json,html,md}': ['prettier --write'],
			'*.vue': ['eslint --fix', 'prettier --write'],
			'*.{scss,css}': ['prettier --write']
		}
	}
	updatePackageJson(updateJson)
}

const processNewFiles = () => {
	const pkgManager = findPkgManager()
	newFiles.push({
		filePath: '.husky/pre-commit',
		content: `
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${pkgManager} lint && pnpm format
    `
	})
}

export const addPrettier = async () => {
	console.log('执行 add prettier')
	await addDependencies({ devDep })
	processNewFiles()
	addNewFiles(newFiles)
	updatePrettierJson()
}
