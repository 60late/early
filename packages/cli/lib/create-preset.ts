import ora from 'ora'
import path from 'path'
import { logger } from './util'
import { copyDir } from './file'
import { ProjectConfig } from './types'
import { handleInstall, handleOpenProject } from './create'
import { select } from '@inquirer/prompts'
import { handleSuccessLog } from './create'

/**
 * @description: Preset template mode
 */
export const handlePresetMode = async (config: ProjectConfig) => {
	const template = await select({
		message: '选择模板',
		choices: [
			{ name: 'vue3-js-simple', value: 'vue3-js-simple' },
			{ name: 'vue3-js-h5', value: 'vue3-js-h5' }
		]
	})
	const spinner = ora().start('拷贝模板')
	const { targetDir } = config
	const templateDir = path.resolve(__dirname, `../../template-${template}`)
	await copyDir(templateDir, <string>targetDir)
	logger('✅')
	await handleInstall(config, spinner)
	handleSuccessLog(config)
	handleOpenProject(config)
}
