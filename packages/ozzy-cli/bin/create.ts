import path from 'path'
import chalk from 'chalk'
import boxen from 'boxen'
import ora, { Ora } from 'ora'
import inquirer from 'inquirer'
import { logger } from './util'
import { execCommand } from './exec'
import { createDir, copyDir, checkMkdirExists } from './copy'
import { NameToFunctionMap, ProjectConfig } from './types'
import type { Options as BoxenOptions } from 'boxen'
import { realpathSync } from 'fs'

/**
 * @description: 预设模板模式
 */
const handlePresetMode = async (config: ProjectConfig) => {
	const { name: projectName } = config
	const { template } = await inquirer.prompt([
		{
			type: 'list',
			name: 'template',
			message: '选择模板',
			choices: ['test', 'vue3-js-h5']
		}
	])

	const spinner = ora().start('拷贝模板')
	const templateProject = `template-${template}`
	const templateDir = path.resolve(__dirname, `../../${templateProject}`)
	const targetDir = path.resolve(process.cwd(), `${projectName}`)
	await copyDir(templateDir, targetDir, {})
	logger('✅')
	await handleInstall(config, targetDir, spinner)
	handleSuccessLog(config)
}

/**
 * @description: 拉取远程仓库git模板模式
 */
const handleGitMode = async (config: ProjectConfig) => {
	const { gitRepo } = await inquirer.prompt([
		{
			type: 'input',
			name: 'gitRepo',
			message: '输入git仓库地址',
			validate: (value: string) => {
				if (!value.includes('.git')) return '请输入正确的git仓库地址'
				return true
			}
		}
	])
	const spinner = ora().start('拉取远程模板')
	const targetDir = path.resolve(process.cwd(), `${config.name}`)
	await handleFetchGitRepo(config, gitRepo, targetDir, spinner)
	await handleInstall(config, targetDir, spinner)
	handleSuccessLog(config)
}

/**
 * @description: 拉取远程git模板
 */
const handleFetchGitRepo = async (config: ProjectConfig, gitRepo: string, targetDir: string, spinner: Ora) => {
	createDir(targetDir)
	const command = `git clone ${gitRepo} ./`
	await execCommand(command, targetDir)
}

/**
 * @description: 模板拉取完成后安装相关依赖
 */
const handleInstall = async (config: ProjectConfig, targetDir: string, spinner: Ora) => {
	spinner.text = '安装依赖(这个过程可能需要几分钟，请耐心等待)'
	const command = `yarn`
	await execCommand(command, targetDir)
	spinner.stop()
}

/**
 * @description: 自定义模板模式
 */
const handleCustomMode = async (config: ProjectConfig) => {
	const { frame, platform } = await inquirer.prompt([
		{
			type: 'list',
			name: 'frame',
			message: '使用什么框架',
			choices: ['vue', 'react']
		},
		{
			type: 'list',
			name: 'platform',
			message: '平台',
			choices: ['PC', 'H5', '小程序']
		}
	])

	const commonConfig = [
		{
			type: 'list',
			name: 'ui',
			message: '使用什么UI框架',
			choices: handleUiConfig(frame, platform)
		},
		{
			type: 'confirm',
			name: 'typescript',
			message: '是否使用typescript'
		}
	]

	let answers = await inquirer.prompt(commonConfig)
	answers = { frame, platform, ...answers }
	console.log('ansers', answers)
}

/**
 * @description: set ui choices
 * @param {string} frame current frame. `vue` | `react`
 * @param {string} platform current platform. `PC` | `H5`
 */
const handleUiConfig = (frame: string, platform: string) => {
	/** vue */
	if (frame === 'vue' && platform === 'PC') return ['Element Plus', 'Ant Design Vue']
	if (frame === 'vue' && platform === 'H5') return ['Vant']
	/** react */
	if (frame === 'react' && platform === 'PC') return ['Ant Design']
	if (frame === 'react' && platform === 'H5') return ['Ant Design Mobie']
}

/**
 * @description: Outputlog when create project successed
 */
const handleSuccessLog = (config: ProjectConfig) => {
	const boxenConfig: BoxenOptions = {
		padding: 1,
		margin: 1,
		title: `${chalk.green('ozzy-cli')}`,
		titleAlignment: 'center'
	}
	const logContent = `${chalk.green(`🎉 项目创建成功!`)} \n${chalk.cyanBright(
		`🎯 切换到 ${config.name} 进行项目预览!`
	)}`
	logger(boxen(logContent, boxenConfig))
}

/**
 * @description: 用户选择模式对应方法的map,策略模式
 */
const MODE_MAP: NameToFunctionMap = {
	预设模板模式: handlePresetMode,
	git远程模板模式: handleGitMode,
	自定义模式: handleCustomMode
}

/**
 * @description: 创建项目
 */
export const createProject = async () => {
	let config: ProjectConfig = await inquirer.prompt([
		{
			type: 'input',
			name: 'name',
			message: '项目名称',
			validate: (value: string) => {
				if (!value) return '项目名称是必选项!'
				const targetDir = path.resolve(process.cwd(), `${value}`)
				const isDirExists = checkMkdirExists(targetDir)
				if (isDirExists) {
					return '项目文件夹已存在，请删除后再操作!'
				}
				return true
			}
		},
		{
			type: 'list',
			name: 'mode',
			message: '选择模式',
			choices: ['预设模板模式', 'git远程模板模式', '自定义模式']
		}
	])

	// run diffrent mode
	MODE_MAP[config.mode](config)
}
