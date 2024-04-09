import { checkbox } from '@inquirer/prompts'
import { addTailwind } from './tailwind'
import { addCommitLint } from './commitlint'
import { addPrettier } from './prettier'
import { addVant } from './vant'
import path from 'path'
import fs from 'fs-extra'
import { execCommand } from '../utils/util'
import { merge as deepMerge } from 'lodash-es'
import { readFileSync, writeFileSync } from 'fs'
import ora from 'ora'

type DepFunctions = 'tailwind' | 'prettier' | 'commitlint' | 'vant'
interface FileArray {
	filePath: string
	content: string
}

interface AllDeps {
	dep?: string[]
	devDep?: string[]
}

const FUNC_MAP = {
	tailwind: addTailwind,
	prettier: addPrettier,
	commitlint: addCommitLint,
	vant: addVant
}

const rootPath = path.resolve(process.cwd(), '../', 'early-project')
const spinner = ora()

export const createGenerator = async () => {
	const dependencies: DepFunctions[] = await checkbox({
		message: '选择依赖(空格选中/取消，回车键确认 )',
		choices: [
			{ name: '原子化样式	(tailwindcss)', value: 'tailwind' },
			{ name: '代码规范校验	(eslint+prettier)', value: 'prettier' },
			{ name: '提交信息校验	(commitlint)', value: 'commitlint' },
			{ name: '引入vant	(vant)', value: 'vant' }
		]
	})

	if (!dependencies.length) {
		console.log('没有选中任何依赖')
		return
	}

	spinner.start('插件安装中')
	await initHusky()

	dependencies.map((item) => {
		FUNC_MAP[item]()
	})
	spinner.succeed('插件安装完成')
}

/**
 * add new files
 * @param {FileArray} files
 * @return {*}
 */
export const addNewFiles = (files: FileArray[]) => {
	files.forEach((item) => {
		const filePath = path.resolve(rootPath, item.filePath)
		fs.ensureDirSync(path.dirname(filePath))
		fs.writeFileSync(filePath, item.content)
	})
}

/**
 * find current package manager
 * @return {*} package manager type
 */
export const findPkgManager = () => {
	let pkgManager = 'npm'
	if (fs.existsSync(path.resolve(rootPath, 'yarn.lock'))) {
		pkgManager = 'yarn'
	}
	if (fs.existsSync(path.resolve(rootPath, 'pnpm-lock.yaml'))) {
		pkgManager = 'pnpm'
	}
	return pkgManager
}

/**
 * add dependencies and devDependencies
 * @param {string} dep
 * @param {string} devDep
 */
export const addDependencies = async ({ dep, devDep }: AllDeps) => {
	const depCommand = dep?.join(' ')
	const devDepCommand = devDep?.join(' ')
	const pkgManager = findPkgManager()
	const installCommand = pkgManager === 'npm' ? 'npm install' : `${pkgManager} add`
	if (depCommand) {
		await execCommand(`${installCommand} ${depCommand}`, rootPath)
	}
	if (devDepCommand) {
		await execCommand(`${installCommand} ${devDepCommand} -D`, rootPath)
	}
}

/**
 * update package.json by using merge function from lodash-es
 * @param {Object} updateJson
 */
export const updatePackageJson = async (updateJson: Object) => {
	const packageJsonPath = path.resolve(rootPath, 'package.json')
	let packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
	const mergedJson = deepMerge(packageJson, updateJson)
	writeFileSync(packageJsonPath, JSON.stringify(mergedJson, undefined, 2))
}

/**
 * update main.js by inserting into top of the file
 * @param {string} insertContent
 * @return {*}
 */
export const updateMainJs = (insertContent: string) => {
	let mainJsString = readFileSync(path.resolve(rootPath, 'src', 'main.js'), 'utf-8')
	if (!mainJsString.includes(insertContent)) {
		mainJsString = `${insertContent}\n${mainJsString}`
		writeFileSync(path.resolve(rootPath, 'src', 'main.js'), mainJsString)
	}
}

/**
 * init husky
 * @return {*}
 */
const initHusky = async () => {
	await addDependencies({ devDep: ['husky'] })
	let pkgManager = findPkgManager()
	pkgManager = pkgManager === 'npm' ? 'npx' : `${pkgManager}`
	await execCommand(`${pkgManager} husky init`, rootPath)
}
