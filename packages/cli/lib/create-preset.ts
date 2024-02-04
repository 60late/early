import ora from 'ora'
import path from 'path'
import { logger } from './util'
import { copyDir, getDirNames } from './file'
import { ProjectConfig } from './types'
import { handleInstall } from './create'
import { select } from '@inquirer/prompts'
import { handleSuccessLog } from './create'
import type { SelectChoice } from './types'

/**
 * @description: 获取目录下所有template文件夹的名字
 * @param {ProjectConfig} config
 * @return {*} templateChoices
 */
const getTemplateChoices = async (config: ProjectConfig) => {
	const templatePath = path.resolve(__dirname, '../template')
	const templateNames = await getDirNames(templatePath)
	const templateChoices: SelectChoice[] = []
	templateNames.map((template) => {
		templateChoices.push({
			name: template,
			value: template
		})
	})
	return templateChoices
}

/**
 * @description: Preset template mode
 */
export const handlePresetMode = async (config: ProjectConfig) => {
	const templateChoices = await getTemplateChoices(config)
	const template = await select({
		message: '选择模板',
		choices: templateChoices
	})
	const spinner = ora().start('拷贝模板')
	const { targetDir } = config
	const templateDir = path.resolve(__dirname, `../template/${template}`)
	await copyDir(templateDir, <string>targetDir)
	logger('✅')
	spinner.text = `安装依赖（需要几分钟时间，请勿退出）`
	await handleInstall(config)
	spinner.stop()
	handleSuccessLog(config)
}
