import fs from 'fs-extra'
import copydir from 'copy-dir'
import path from 'path'
import Mustache from 'mustache'

/**
 * make directory if not exists
 * @param {*} target target path
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
 * create directory
 * @param {*} dir directory path
 */
export const createDir = (dir: string) => {
	if (!fs.existsSync(dir)) {
		const dirname = path.dirname(dir)
		createDir(dirname)
		fs.mkdirSync(dir)
	}
}

/**
 * Delete exist target
 * @param {string} targetDir
 */
export const removeDir = async (targetDir: string) => {
	fs.removeSync(targetDir)
}

/**
 * copy directory,if not exists will create directory
 * @param {*} from
 * @param {*} to
 * @param {*} options
 */
export const copyDir = async (from: string, to: string) => {
	mkdirGuard(to)
	await copydir.sync(from, to)
}

/**
 * get all directory names
 * @param {string} path directory path
 * @return {string[]}
 */
export const getDirNames = async (path: string) => {
	try {
		const files = fs.readdirSync(path)
		const dirArrys: string[] = []
		files.map((file: string) => {
			const filePath = `${path}/${file}`
			const isDirectory = fs.statSync(filePath).isDirectory() // 判断是否为文件夹
			if (isDirectory) {
				dirArrys.push(file) // 将文件夹名称添加到数组中
			}
		})
		return dirArrys
	} catch (error) {
		console.error('Failed to read directory')
		return []
	}
}

/**
 * copy files
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
 * check if directory exists
 * @param {*} path
 * @return {*}
 */
export const checkMkdirExists = (path: string) => {
	console.log(path, 'path')
	return fs.existsSync(path)
}

/**
 * render template
 * @param {*} path 模板路径
 * @param {*} data 相关参数
 */
export const readTemplate = (path: string, data: string) => {
	const content = fs.readFileSync(path, { encoding: 'utf8' })
	return Mustache.render(content, data)
}

/**
 * copy template
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
