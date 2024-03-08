import { addDependencies, updateMainJs } from './index'

/* vant dependencies **/
const dep = ['vant']

const updateString = `
import { Button } from 'vant'
import 'vant/lib/index.css'
`

/**
 * add vant
 * @return {*}
 */
export const addVant = async () => {
	updateMainJs(updateString)
	addDependencies({ dep })
}
