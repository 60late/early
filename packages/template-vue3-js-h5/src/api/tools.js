import { showFailToast } from 'vant'
import { VERTIFY_API } from '../consts/index'

// 修改请求头信息
export const handleChangeRequestHeader = (config) => {
	// 默认json格式发送
	if (!config.headers['Content-Type']) {
		config.headers['Content-Type'] = 'application/json;charset=UTF-8'
	}

	if (config.data) {
		let timestamp = new Date().getTime()
		config.data.timestamp = timestamp
		config.data.nonce = timestamp.toString().slice(5)
	}

	return config
}

export const handleConfigureAuth = (config) => {
	// 除了权限认证接口外，其他接口请求需要加上token
	if (config.url === VERTIFY_API) {
		config.headers['MACTOKEN'] = ''
	} else {
		config.headers['MACTOKEN'] = 'Bearer' + sessionStorage.getItem('MACTOKEN')
	}
	return config
}

export const handleNetworkError = (errStatus) => {
	const networkErrMap = {
		400: '错误的请求', // token 失效
		401: '未授权，请重新登录',
		403: '拒绝访问',
		404: '请求错误，未找到该资源',
		405: '请求方法未允许',
		408: '请求超时',
		500: '服务器端出错',
		501: '网络未实现',
		502: '网络错误',
		503: '服务不可用',
		504: '网络超时',
		505: 'http版本不支持该请求'
	}
	if (errStatus) {
		showFailToast(
			networkErrMap[errStatus] ?? `网络错误，错误编号 --${errStatus}`
		)
		return
	}

	showFailToast('无法连接到服务器！')
}

export const handleAuthError = (errno) => {
	const authErrMap = {
		10031: '登录失效，需要重新登录', // token 失效
		10032: '您太久没登录，请重新登录~', // token 过期
		10033: '账户未绑定角色，请联系管理员绑定角色',
		10034: '该用户未注册，请联系管理员注册用户',
		10035: 'code 无法获取对应第三方平台用户',
		10036: '该账户未关联员工，请联系管理员做关联',
		10037: '账号已无效',
		10038: '账号未找到'
	}

	if (authErrMap[errno]) {
		showFailToast(authErrMap[errno])
		return false
	}

	return true
}

export const handleGeneralError = (errno, errmsg) => {
	if (errno) {
		showFailToast(errmsg)
		return false
	}

	return true
}
