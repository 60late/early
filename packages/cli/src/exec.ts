import path from 'path'
import { logger } from './util'
import { exec } from 'child_process'

/**
 * @description: execute command
 * @param {string} command
 * @param {string} cmdPath
 */
export const execCommand = async (fullCommand: string, cmdPath: string) => {
	return new Promise((resolve, reject) => {
		exec(
			fullCommand,
			{
				cwd: path.resolve(cmdPath)
			},
			(error, stdout, stderr) => {
				if (error) {
					logger(`${fullCommand} ❌`)
					console.log(stderr)
					reject(error)
				} else {
					logger(`${fullCommand} ✅`)
					resolve('success')
				}
			}
		)
	})
}
