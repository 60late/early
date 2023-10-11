import fs from 'fs-extra'
import copydir from 'copy-dir'
import path from 'path'
import Mustache from 'mustache'

/**
 * @description: 目标目录不存在时自动创建目录
 * @param {*} target 目录路径
 * @return {*}
 */
const mkdirGuard = (target: string) => {
	try {
		fs.mkdirSync(target, { recursive: true })
	} catch (e) {
		createDir(target)
	}
}

/**
 * @description: 创建目录
 * @param {*} dir 目录路径
 */
export const createDir = (dir: string) => {
	if (fs.existsSync(dir)) {
		return true
	} else {
		const dirname = path.dirname(dir)
		createDir(dirname)
		fs.mkdirSync(dir)
	}
}

/**
 * @description: 目录拷贝，如果目录不存在会先创建目录
 * @param {*} from
 * @param {*} to
 * @param {*} options
 */
export const copyDir = async (from: string, to: string, options) => {
	mkdirGuard(to)
	await copydir.sync(from, to, options)
}

/**
 * @description: 拷贝文件
 * @param {*} from
 * @param {*} to
 * @return {*}
 */
const copyFile = (from: string, to: string) => {
	const buffer = fs.readFileSync(from)
	const parentPath = path.dirname(to)
	mkdirGuard(parentPath)
	fs.writeFileSync(to, buffer)
}

/**
 * @description: 检查目标目录是否存在
 * @param {*} path
 * @return {*}
 */
export const checkMkdirExists = (path: string) => {
	return fs.existsSync(path)
}

/**
 * @description: 渲染相关模板
 * @param {*} path 模板路径
 * @param {*} data 相关参数
 */
export const readTemplate = (path: string, data: string) => {
	const content = fs.readFileSync(path, { encoding: 'utf8' })
	return Mustache.render(content, data)
}

/**
 * @description: 拷贝模板
 * @param {*} from
 * @param {*} to
 * @param {*} data
 */
export const copyTemplate = (from: string, to: string, data: string) => {
	if (path.extname(from) !== '.tpl') {
		return copyFile(from, to)
	}

	const parentToPath = path.dirname(to)
	mkdirGuard(parentToPath)
	fs.writeFileSync(to, readTemplate(from, data))
}
