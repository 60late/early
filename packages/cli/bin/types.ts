export interface ProjectConfig {
	/** Project Name */
	name: string
	/** Create Mode. 1. Using preset template 2.Using remote git repo 3. Using custom config  */
	mode: string
	/** Using which preset template */
	template?: string
	/** Project platform. `PC` or `H5` */
	platform?: 'PC' | 'H5'
	/** Project framework. `Vue` or `React` */
	frame?: string
	/** Project UI framework. */
	ui?: string
	/** Is use typescript? `True` for use */
	isUseTs?: boolean
	/** Is use eslint、stylelint、husky、commitizen? `True` for use */
	isUseLint?: boolean
	/** Node module manage tool? 'npm' or 'yarn' or 'pnpm' */
	pckManager?: 'npm' | 'yarn' | 'pnpm'
}

export interface NameToFunctionMap {
	[propName: string]: (config: any) => Promise<void>
}
