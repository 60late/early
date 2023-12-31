#!/usr/bin/env node

console.log('欢迎使用early-cli来构建现代前端工程项目2')
import { createProject } from '../lib/create'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/**
 * @description: create project
 */
yargs(hideBin(process.argv))
	.command(
		'create',
		'创建项目',
		() => {},
		(argv) => {
			createProject()
		}
	)
	.parse()
