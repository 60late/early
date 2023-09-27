import inquirer from 'inquirer'

/**
 * @description: 自定义模板
 */
const handleCustomMode = async (answers) => {
	const answers = await inquirer.prompt([
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
			choices: ['PC端', '移动端']
		},
		{
			type: 'confirm',
			name: 'typescript',
			message: '是否使用typescript'
		},
		{
			type: 'list',
			name: 'ui',
			message: '使用什么UI框架',
			choices: ['Element Plus', 'Ant Design Vue', 'Vant UI']
		}
	])

	return answers
}

/**
 * @description: 使用预设模板
 */
const handlePresetMode = async (answers) => {
	const answers = await inquirer.prompt([
		{
			type: '',
			name: 'template',
			message: '选择模板',
			choices: ['vue3-js-h5', '自定义']
		}
	])

	if (answers.template === '自定义模板') {
		const gitRepoUrl = await inquirer.prompt([
			{
				type: 'input',
				name: 'gitRepoUrl',
				message: '输入git仓库地址'
			}
		])

		answers.gitRepoUrl = gitRepoUrl
	} else {
	}
	return answers
}

export const inquirerPrompt = (): any => {
	return new Promise(async (resolve, reject) => {
		let answers = await inquirer.prompt([
			{ type: 'input', name: 'name', message: '项目名称' },
			{
				type: 'list',
				name: 'mode',
				message: '选择模式',
				choices: ['预设模板模式', '自定义模式']
			}
		])
		console.log('hha', answers)
		if (answers.mode === '自定义模式') {
			handleCustomMode(answers)
		} else {
			handlePresetMode(answers)
		}
	})
}
