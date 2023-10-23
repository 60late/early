import path from 'path'
import inquirer from 'inquirer'
import ora, { Ora } from 'ora'
import { writeFileSync, readFileSync } from 'fs'
import { logger } from './util'
import { copyDir } from './file'
import { execCommand } from './exec'
import { ProjectConfig } from './types'
import { VUE_PC_UI, VUE_H5_UI, REACT_PC_UI, REACT_H5_UI } from './consts'
import { handleSuccessLog } from './create'

const spinner = ora()

/**
 * @description: set ui choices
 * @param {string} frame current frame. `vue` | `react`
 * @param {string} platform current platform. `PC` | `H5`
 */
const handleUiConfig = (frame: string, platform: string) => {
	/** vue */
	if (frame === 'vue' && platform === 'PC') return VUE_PC_UI
	if (frame === 'vue' && platform === 'H5') return VUE_H5_UI
	/** react */
	if (frame === 'react' && platform === 'PC') return REACT_PC_UI
	if (frame === 'react' && platform === 'H5') return REACT_H5_UI
}

/**
 * @description: Copy simple template into target dir
 * @param {ProjectConfig} config
 */
const copyTemplate = async (config: ProjectConfig) => {
	spinner.start('创建模板')
	const { isUseTs, name: projectName } = config
	let templateProject = isUseTs ? `template-vue3-ts-simple` : `template-vue3-js-simple`
	const templateDir = path.resolve(__dirname, `../../${templateProject}`)
	const targetDir = path.resolve(process.cwd(), 'playground', `${projectName}`)
	await copyDir(templateDir, targetDir)
	logger('✅')
}

/**
 * @description: update config in package.json. Including `name`,`dependencies`、`devDependencies` and etc.
 * @param {string} targetParh
 * @return {*}
 */
const updatePackageJson = (targetParh: string, config: ProjectConfig) => {
	const { name } = config
	let jsonData = JSON.parse(readFileSync(targetParh, 'utf-8'))
	jsonData.name = name
	jsonData = JSON.stringify(jsonData, null, 2)
	writeFileSync(targetParh, jsonData)
}

/**
 * @description: update detail config for project
 * @param {ProjectConfig} config
 */
const updateConfig = async (config: ProjectConfig) => {
	spinner.text = '配置更新'
	const { name: projectName } = config
	const targetPath = path.resolve(process.cwd(), 'playground', `${projectName}`, 'package.json')
	updatePackageJson(targetPath, config)
}

/**
 * @description: handle install packages and run dev
 * @param {ProjectConfig} config
 */
const handleInstall = async (config: ProjectConfig) => {
	spinner.text = '安装依赖(这个过程可能需要几分钟，请耐心等待)'
	const { pckManager, name: projectName } = config
	const targetDir = path.resolve(process.cwd(), 'playground', `${projectName}`)
	const installCommand = `${pckManager} install`
	await execCommand(installCommand, targetDir)
}

/**
 * @description: createApp by custom config
 * @param {*} config
 */
const handleCreateApp = async (config: ProjectConfig) => {
	await copyTemplate(config)
	await updateConfig(config)
	await handleInstall(config)
	handleSuccessLog(config)
	spinner.stop()
}

/**
 * @description: custome create mode
 * TODO: more detail config
 * JS/TS
 * vite
 * vue+pinia+axios+vue-router
 * package.json
 * lint：husky+lint-staged+prettier+stylelint+commitlint+cz-commitlint
 */
export const handleCustomMode = async (config: ProjectConfig) => {
	const { frame, platform } = await inquirer.prompt([
		{
			type: 'list',
			name: 'frame',
			message: '使用什么开发框架',
			choices: ['vue', 'react']
		},
		{
			type: 'list',
			name: 'platform',
			message: '平台',
			choices: ['PC', 'H5']
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
			type: 'checkbox',
			name: 'feat',
			message: '希望有哪些附加功能',
			choices: [
				{
					name: 'Typescript',
					value: 'typescript'
				},
				{
					name: '代码格式化(Eslint + Stylelint + Husky + Lint-staged)',
					value: 'lint'
				},
				{
					name: 'git提交信息校验(Commitlint + Commitizen + cz-git )',
					value: 'git'
				}
			]
		}
	]

	let answers = await inquirer.prompt(commonConfig)
	answers = { frame, platform, ...answers, ...config }
	console.log('answers', answers)
	handleCreateApp(answers)
}
