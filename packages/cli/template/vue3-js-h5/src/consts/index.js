/**
 * @description: 默认请求配置参数
 */
export const DEFAULT_REQUEST_CONFIG = {
  isShowLoading: true, // 是否显示加载中loading
  isShowError: true, // 是否显示报错提示
  isRequestEncrypt: true, // 请求数据是否加密
  isResponseEncrypt: true, // 返回信息是否需要解密
  customResponseType: '', // 自定义返回类型
  errorMap: {} // 错误map
}

/* 网络错误状态码 */
export const NETWORK_ERROR_MAP = {
  400: '请求错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求错误,未找到该资源',
  405: '请求方法未允许',
  408: '请求超时',
  500: '服务器端出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'http版本不支持该请求'
}

/* 身份权限错误状态码 */
export const AUTH_ERROR_MAP = {
  90031: '登录失效，需要重新登录',
  90032: '您太久没登录，请重新登录',
  90033: '账户未绑定角色，请联系管理员绑定角色',
  90034: '该用户未注册，请联系管理员注册用户'
}

/* 身份权限错误状态码 */
export const COMMON_ERROR_MAP = {
  10001: '公共错误1',
  10002: '公共错误2'
}
