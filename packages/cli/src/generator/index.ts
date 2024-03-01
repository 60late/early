import { checkbox } from '@inquirer/prompts'
import { addTailwind } from './tailwind'
import { addCommitLint } from './commitlint'
import { addPrettier } from './prettier'
import path from 'path'
import { existsSync, writeFileSync } from 'fs'
import { execCommand } from '../exec'
import { logger } from '../util'

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

export const createGenerator = async () => {
	console.log('执行微生成器')
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

	dependencies.map((item) => {
		FUNC_MAP[item]()
	})
}

const rootPath = path.resolve(process.cwd(), '../', 'early-project')

/**
 * add new files
 * @param {FileArray} files
 * @return {*}
 */
export const addNewFiles = (files: FileArray[]) => {
	files.forEach((item) => {
		const filePath = path.resolve(rootPath, item.filePath)
		writeFileSync(filePath, item.content)
	})
}

/**
 * find current package manager
 * @return {*} package manager type
 */
const findPkgManager = () => {
	let pkgManager = 'npm'
	if (existsSync(path.resolve(rootPath, 'yarn.lock'))) {
		pkgManager = 'yarn'
	}
	if (existsSync(path.resolve(rootPath, 'pnpm-lock.yaml'))) {
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
	console.log('当前manager', pkgManager)
	const installCommand = pkgManager === 'npm' ? 'npm install' : `${pkgManager} add`
	logger('正在安装依赖')
	if (depCommand) {
		await execCommand(`${installCommand} ${devDepCommand}`, rootPath)
	}
	if (devDepCommand) {
		await execCommand(`${installCommand} add ${devDepCommand} -D`, rootPath)
	}
}

export const copyTemplate = (content: string, path: string) => {}
