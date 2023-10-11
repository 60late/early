import path from 'path'
import { logger } from './util'
import { exec } from 'child_process'

/**
 * @description: execute command
 * @param {string} command
 * @param {string} cmdPath
 */
export const execCommand = async (command: string = 'npm', cmdPath: string) => {
	return new Promise((resolve, reject) => {
		exec(
			command,
			{
				cwd: path.resolve(cmdPath)
			},
			(error, stdout, stderr) => {
				if (error) {
					logger(' ❌')
					reject(error)
				} else {
					logger(' ✅')
					resolve('success')
				}
			}
		)
	})
}
