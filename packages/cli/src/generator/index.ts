import { checkbox } from '@inquirer/prompts'
import { addTailwind } from './tailwind'
import { addCommitLint } from './commitlint'
import { addPrettier } from './prettier'

type DepFunctions = 'tailwind' | 'prettier' | 'commitlint'

const FUNC_MAP = {
	tailwind: addTailwind,
	prettier: addPrettier,
	commitlint: addCommitLint
}

export const createDependencies = async () => {
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

export const installPackage = (dependencies: string[]) => {}

export const copyTemplate = (content: string, path: string) => {}
