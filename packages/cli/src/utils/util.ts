import path from 'path'
import { exec } from 'child_process'

/**
 * simplefy console.log
 * @param {array} args
 */
export const logger = (...args: any) => {
	console.log(...args)
}

/**
 * @description: execute command
 * @param {string} command
 * @param {string} cmdPath
 * @param {Function} callBack
 */
export const execCommand = async (fullCommand: string, cmdPath: string, callBack?: () => void) => {
	return new Promise((resolve, reject) => {
		exec(
			fullCommand,
			{
				cwd: path.resolve(cmdPath)
			},
			(error, stdout, stderr) => {
				if (error) {
					console.log(stderr)
					callBack && callBack()
					// reject(error)
				} else {
					resolve('success')
				}
			}
		)
	})
}
