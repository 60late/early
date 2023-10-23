import path from 'path'
import chalk from 'chalk'
import boxen from 'boxen'
import ora, { Ora } from 'ora'
import inquirer from 'inquirer'
import { logger } from './util'
import { execCommand } from './exec'
import { handleCustomMode } from './create-custom'
import { createDir, copyDir, checkMkdirExists } from './file'
import { NameToFunctionMap, ProjectConfig } from './types'
import type { Options as BoxenOptions } from 'boxen'

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
			choices: ['vue3-js-simple', 'vue3-js-h5']
		}
	])

	const spinner = ora().start('拷贝模板')
	const templateProject = `template-${template}`
	const templateDir = path.resolve(__dirname, `../../${templateProject}`)
	const targetDir = path.resolve(process.cwd(), 'playground', `${projectName}`)
	await copyDir(templateDir, targetDir)
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
export const handleInstall = async (config: ProjectConfig, targetDir: string, spinner: Ora) => {
	spinner.text = '安装依赖(这个过程可能需要几分钟，请耐心等待)'
	const { pckManager } = config
	const command = `${pckManager} install`
	await execCommand(command, targetDir)
	spinner.stop()
}

/**
 * @description: Outputlog when create project successed
 */
export const handleSuccessLog = (config: ProjectConfig) => {
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
	preset: handlePresetMode,
	git: handleGitMode,
	custom: handleCustomMode
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
			validate: async (value: string) => {
				if (!value) return '项目名称是必选项11!'
				const targetDir = path.resolve(process.cwd(), 'playground', `${value}`)
				const isDirExists = checkMkdirExists(targetDir)
				console.log('是否存在', isDirExists)
				if (isDirExists) {
					const isOverRide = await inquirer.prompt({
						type: 'confirm',
						message: '项目文件夹已存在，是否覆盖？'
					})
					return isOverRide ? true : '请重新输入项目名'
				}
				return true
			}
		},
		{
			type: 'list',
			name: 'pkgManager',
			message: '选择包管理工具',
			choices: ['npm', 'yarn', 'pnpm']
		},
		{
			type: 'list',
			name: 'mode',
			message: '选择模式',
			choices: [
				{ name: '预设模板模式', value: 'preset' },
				{ name: 'git远程仓库模板模式', value: 'git' },
				{ name: '自定义模式', value: 'custom' }
			]
		}
	])
	console.log(config)

	// run diffrent mode
	MODE_MAP[config.mode](config)
}
