import { addNewFiles, addDependencies } from './index'

/* tailwind devDependencies **/
const devDep = ['@commitlint/cli', '@commitlint/config-conventional']

/* tailwind new files **/
const newFiles = [
	{
		filePath: 'commitlint.config.cjs',
		content: `
module.exports = {
  // 继承的规则
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0], // subject大小写不做校验
    // 类型枚举，git提交type必须是以下类型中的一种
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新增功能
        'fix', // 修复缺陷
        'docs', // 文档变更
        'style', // 代码格式（不影响功能，例如空格、分号等格式修正）
        'refactor', // 代码重构（不包括 bug 修复、功能新增）
        'perf', // 性能优化
        'test', // 添加疏漏测试或已有测试改动
        'build', // 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）
        'ci', // 修改 CI 配置、脚本
        'revert', // 回滚 commit
        'chore' // 对构建过程或辅助工具和库的更改（不影响源文件、测试用例）
      ]
    ]
  }
}
    `
	},
	{
		filePath: '.husky/commit-msg',
		content: `
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit     
    `
	}
]

export const addCommitLint = async () => {
	console.log('执行 add commitLint')
	addNewFiles(newFiles)
	addDependencies({ devDep })
}
