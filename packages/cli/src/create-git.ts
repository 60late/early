import ora from 'ora'
import { execCommand } from './exec'
import { ProjectConfig } from './types'
import { input } from '@inquirer/prompts'
import { createDir } from './file'
import { handleInstall, handleSuccessLog } from './create'

/**
 * @description: Remote git repo mode
 */
export const handleGitMode = async (config: ProjectConfig) => {
	const gitRepo = await input({
		message: '输入git仓库地址',
		validate: (value: string) => {
			if (!value.includes('.git')) return '请输入正确的git仓库地址'
			return true
		}
	})
	config = { gitRepo, ...config }
	ora().start('拉取远程模板')
	await handleFetchGitRepo(config)
	await handleInstall(config)
	handleSuccessLog(config)
}

/**
 * @description: 拉取远程git模板
 */
const handleFetchGitRepo = async (config: ProjectConfig) => {
	const { targetDir, gitRepo, name } = config
	createDir(<string>targetDir)
	const command = `git clone ${gitRepo} ../${name}`
	await execCommand(command, <string>targetDir)
}
