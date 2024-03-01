#!/usr/bin/env node

console.log('欢迎使用early-cli来构建现代前端工程项目')
import { createProject } from '../src/create'
import { createGenerator } from '../src/generator/index'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

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

yargs(hideBin(process.argv))
	.command(
		['generate', 'g'],
		'微生成器',
		() => {},
		(argv) => {
			createGenerator()
		}
	)
	.parse()
