import { checkbox } from '@inquirer/prompts'
import { addTailwind } from './tailwind'
import { addCommitLint } from './commitlint'
import { addPrettier } from './prettier'
import path from 'path'
import fs from 'fs-extra'
import { execCommand } from '../exec'
import { merge as deepMerge } from 'lodash-es'
import { readFileSync, writeFileSync } from 'fs'
import ora from 'ora'

type DepFunctions = 'tailwind' | 'prettier' | 'commitlint'
interface FileArray {
	filePath: string
	content: string
}

interface AllDeps {
	dep?: string[]
	devDep: string[]
}

const FUNC_MAP = {
	tailwind: addTailwind,
	prettier: addPrettier,
	commitlint: addCommitLint
}

const rootPath = path.resolve(process.cwd(), '../', 'early-project')

export const createGenerator = async () => {
	const dependencies: DepFunctions[] = await checkbox({
		message: '选择依赖(空格选中/取消，回车键确认 )',
		choices: [
			{ name: '原子化样式	(tailwindcss)', value: 'tailwind' },
			{ name: '代码格式化	(eslint+prettier)', value: 'prettier' },
			{ name: '提交信息校验	(commitlint)', value: 'commitlint' }
		]
	})
	console.log('选中的依赖', dependencies)
	if (!dependencies.length) {
		console.log('没有选中任何依赖')
		return
	}

	initHusky()

	dependencies.map((item) => {
		FUNC_MAP[item]()
	})
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
	const spinner = ora().start('依赖安装中……')
	if (depCommand) {
		await execCommand(`${installCommand} ${devDepCommand}`, rootPath)
	}
	if (devDepCommand) {
		await execCommand(`${installCommand} ${devDepCommand} -D`, rootPath)
	}
	spinner.stop()
}

/**
 * update package.json by using merge function from lodash-es
 * @param {Object} updateJson
 */
export const updatePackageJson = async (updateJson: Object) => {
	const rootPath = path.resolve(process.cwd(), '../')
	const packageJsonPath = path.resolve(rootPath, 'early-project', 'package.json')
	let packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
	const mergedJson = deepMerge(packageJson, updateJson)
	writeFileSync(packageJsonPath, JSON.stringify(mergedJson, undefined, 2))
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
