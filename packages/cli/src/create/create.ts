import path from 'path'
import chalk from 'chalk'
import boxen from 'boxen'
import { logger } from '../utils/util'
import { execCommand } from '../utils/util'
import { checkMkdirExists } from '../utils/file'
import { handleGitMode } from './create-git'
import { handlePresetMode } from './create-preset'
import { handleCustomMode } from './create-custom'
import { input, confirm, select } from '@inquirer/prompts'
import { NameToFunctionMap, ProjectConfig } from '../types'
import type { Options as BoxenOptions } from 'boxen'

/**
 * In order to init husky,need to init git first
 * @param {ProjectConfig} config
 */
export const handleInitGit = async (config: ProjectConfig) => {
	const { targetDir } = config
	const command = `git init`
	await execCommand(command, <string>targetDir)
}

/**
 * Install project packages, using user choosed package manager
 */
export const handleInstall = async (config: ProjectConfig) => {
	const { pkgManager, targetDir } = config
	await handleInitGit(config)
	let command = `${pkgManager} install`
	if (pkgManager === 'yarn') command = `${pkgManager}`
	await execCommand(command, <string>targetDir)
}

/**
 * Open project after install dependencies
 */
export const handleOpenProject = async (config: ProjectConfig) => {
	const { targetDir, pkgManager } = config
	let command = `${pkgManager} run dev`
	if (pkgManager === 'yarn') command = `yarn dev`
	await execCommand(command, <string>targetDir)
}

/**
 * Outputlog when create project successed
 */
export const handleSuccessLog = (config: ProjectConfig) => {
	const boxenConfig: BoxenOptions = {
		padding: 1,
		margin: 1,
		title: `${chalk.green('early-cli')}`,
		titleAlignment: 'center'
	}
	const { name, pkgManager } = config
	const logContent = `${chalk.green(`🎉 项目创建成功!`)} \n${chalk.cyanBright(
		`🎯 执行cd ${name} && ${pkgManager} dev 进行项目预览!`
	)}`
	logger(boxen(logContent, boxenConfig))
}

/**
 * Run different create handler by strategy attern.
 */
const MODE_MAP: NameToFunctionMap = {
	preset: handlePresetMode,
	git: handleGitMode,
	custom: handleCustomMode
}

export const createProject = async () => {
	let name = await input({
		message: '项目名称',
		default: 'early-project',
		validate: async (value: string) => {
			if (!value) return '项目名称是必选项!'
			return true
		}
	})

	const targetDir = (await path.resolve(process.cwd(), '../', name)) || '.'
	const isDirExsist = checkMkdirExists(targetDir)
	let override: boolean = false

	if (isDirExsist) {
		override = await confirm({
			message: '目录重复，是否覆盖?',
			default: true
		})
		if (!override) {
			throw new Error(`${chalk.red('✖')} 用户取消操作`)
		}
	}
	const pkgManager = await select({
		message: '选择包管理工具',
		choices: [
			{ name: 'pnpm', value: 'pnpm' },
			{ name: 'yarn', value: 'yarn' },
			{ name: 'npm', value: 'npm' }
		]
	})
	const mode = await select({
		message: '选择模式',
		choices: [
			{ name: '选择预设模板', value: 'preset' },
			{ name: '输入git仓库地址', value: 'git' }
			// { name: '自定义模式', value: 'custom' }
		]
	})

	const config: ProjectConfig = { name, targetDir, pkgManager, mode, override }
	// run diffrent mode
	MODE_MAP[config.mode](config)
}
