import path from 'path'
import { logger } from './util'
import { exec } from 'child_process'
// import spawn from 'cross-spawn'

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
					logger(' ❌')
					console.log(stderr)
					reject(error)
				} else {
					logger('✅ ')
					resolve('success')
				}
			}
		)
	})
}
