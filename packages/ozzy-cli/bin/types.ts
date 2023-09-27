export interface ProjectConfig {
	/** Project Name */
	name: string
	/** Create Mode. 1. Using preset template 2.Using remote git repo 3. Using custom config  */
	mode: string
	/** Using which preset template */
	template?: string
}

export interface NameToFunctionMap {
	[propName: string]: (config: any) => Promise<void>
}
