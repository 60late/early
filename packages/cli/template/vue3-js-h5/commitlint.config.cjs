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
  },
  // prettier-ignore
  prompt: {
    disableEmoji: false,
    useEmoji: true,
    format: '{type}: {emoji}{subject}',
    questions: ['types', 'subject', 'confirmCommit'],
    skipQuestions:['scope','breaking','footerPrefix','footer','body'], // 跳过scope，breaking等选项，更加符合业务项目开发习惯
    messages: {
      type: '选择你要提交的类型:',
      subject: '填写简要变更描述:',
      // body: '填写详细的变更描述（可选，使用 "|" 换行）:\n',
      confirmCommit: '是否提交修改?',
    },
    types: [
        { value: "feat",     name: "feat        ✨  新增功能", emoji: ":sparkles:" },
        { value: "fix",      name: "fix         🐛  修复缺陷", emoji: ":bug:" },
        { value: "docs",     name: "docs        📝  文档变更", emoji: ":memo:" },
        { value: "style",    name: "style       💄  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: ":lipstick:" },
        { value: "refactor", name: "refactor    ♻️   代码重构（不包括 bug 修复、功能新增）", emoji: ":recycle:" },
        { value: "perf",     name: "perf        ⚡️  性能优化", emoji: ":zap:" },
        { value: "test",     name: "test        ✅  添加疏漏测试或已有测试改动", emoji: ":white_check_mark:"},
        { value: "build",    name: "build       📦️  构建流程、外部依赖变更（如升级 npm 包、修改 vite 配置等）", emoji: ":package:"},
        { value: "ci",       name: "ci          🎡  修改 CI 配置、脚本",  emoji: ":ferris_wheel:"},
        { value: "revert",   name: "revert      ⏪️  回滚 commit",emoji: ":rewind:"},
        { value: "chore",    name: "chore       🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）", emoji: ":hammer:"},
      ],
  }
}
