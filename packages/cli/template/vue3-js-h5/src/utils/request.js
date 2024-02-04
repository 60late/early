import axios from 'axios'
import { allowMultipleToast, showLoadingToast, showNotify } from 'vant'
import { NETWORK_ERROR_MAP, AUTH_ERROR_MAP, COMMON_ERROR_MAP, DEFAULT_REQUEST_CONFIG } from '@/consts/index'

/* 允许同时多弹窗 */
allowMultipleToast()
const service = axios.create({
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  withCredentials: true,
  timeout: 10000
})

/**
 * 修改请求头信息
 * @param {Object} config 请求配置对象
 * @returns {Object} 修改后的请求配置对象
 */
const changeRequestHeader = (config) => {
  if (config.customHeader) {
    config.headers['Content-Type'] = config.customHeader
  }
  if (sessionStorage.getItem('Token')) {
    config.headers['Token'] = 'Token ' + sessionStorage.getItem('Token')
  }
  return config
}

/**
 * 修改响应类型
 * @param {Object} config - 配置对象
 * @returns {Object} - 修改后的配置对象
 */
const changeResponseType = (config) => {
  if (config.customResponseType) {
    config.responseType = config.customResponseType
  }
  return config
}

/**
 * 请求体加密
 * @param {object} config - 配置对象
 * @returns {object} - 返回处理后的配置对象
 */
const handleEncryptData = (config) => {
  // console.log(config)
  return config
}

/* 请求拦截器 */
service.interceptors.request.use(
  (config) => {
    config = changeRequestHeader(config)
    config = changeResponseType(config)
    config = handleEncryptData(config)
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

/**
 * 处理权限报错，如果命中权限报错，执行用户账号退出功能.如果存在错误返回true
 * @param {number} errno - 授权错误码
 * @returns {boolean} - 返回是否授权错误
 */
const checkAuthError = (errno) => {
  if (AUTH_ERROR_MAP[errno]) {
    showNotify({ message: AUTH_ERROR_MAP[errno] })
    // logout……
  }
  return !!AUTH_ERROR_MAP[errno]
}

/**
 * 处理通用code错误
 * 1.如果通用码值命中，则返回通用码值错误
 * 2.如果接口码值命中，则返回接口码值错误
 * 3.均未命中，则返回msg中的错误
 * @param {Object} response - 响应对象
 * @returns {boolean} - 返回是否出现错误
 */
const checkCodeError = (response) => {
  const { data, config } = response
  const { code, msg } = data
  const { errorMap, isShowError } = config
  const allErrorMap = { ...COMMON_ERROR_MAP, ...errorMap }
  if (isShowError && code !== '000000') {
    const errMsg = allErrorMap[code] || msg
    showNotify({ message: errMsg })
  }
  return code !== '000000'
}

/**
 * 检查通用错误(code!==000000时的报错)
 * code报错只会是权限报错和通用报错中的一种
 * @param {Object} response - 响应对象
 * @returns {boolean} - 返回是否存在错误
 */
const checkNormalError = (response) => {
  const isAuthErrorExist = checkAuthError(response.data?.code)
  const isCodeErrorExist = !isAuthErrorExist && checkCodeError(response)
  return isAuthErrorExist || isCodeErrorExist
}

/**
 * 处理通用网络报错
 * 如果配置了不显示错误则退出
 * 如果配置为true则根据网络错误码Map进行错误提示
 * @param {Object} err - 错误对象
 */
const checkNetWorkError = (err) => {
  if (!err.config?.isShowError) {
    return
  }
  const errStatus = err?.response?.status
  let errMessage = '未知错误'
  if (errStatus) {
    errMessage = NETWORK_ERROR_MAP[errStatus] || '网络异常'
  } else {
    errMessage = `服务器链接失败！`
  }
  showNotify({ message: errMessage })
}

/* 响应拦截器 */
service.interceptors.response.use(
  (response) => {
    console.log('拦截器中正确', response)
    checkNormalError(response)
    return response.data
  },
  (err) => {
    console.log('拦截器中错误', err)
    checkNetWorkError(err)
    Promise.reject(err)
  }
)

/**
 * 处理加载中的提示 toast
 * @param {Object} config - 配置对象
 * @param {boolean} config.isShowLoading - 是否显示加载中的标志
 * @returns {Object} - 加载中的 toast 对象，如果 isShowLoading 为 false，则返回 undefined
 */
const handleLoadingToast = (config) => {
  const { isShowLoading } = config || {}
  if (isShowLoading) {
    const loadingToast = showLoadingToast({
      message: '加载中',
      forbidClick: true,
      duration: 0
    })
    return loadingToast
  }
}

/**
 * Post请求(状态流转流程：Post方法-->Axios请求拦截器-->Axios响应拦截器-->Post方法)
 * @param {Object} props - 请求参数
 * @param {string} props.url - 请求的URL
 * @param {Object} props.data - 请求的数据
 * @param {Object} props.config - 请求的配置
 * @returns {Promise} - 返回一个Promise对象，该对象的值为请求的响应数据或错误信息
 */
export const Post = async ({ url, data, config }) => {
  const mergeConfig = { ...DEFAULT_REQUEST_CONFIG, ...config }
  const loadingToast = handleLoadingToast(mergeConfig)
  try {
    const res = await service.post(url, data, mergeConfig)
    console.log('Post请求中', res)
    loadingToast?.close()
    return res
  } catch (err) {
    console.log('Post请求中失败', err)
    loadingToast?.close()
  }
}
