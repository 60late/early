import { Post } from '@/utils/request'

export function commonRequest(params) {
  return Post({
    url: '/test',
    data: {
      body: params
    },
    config: {
      errorMap: {
        10003: '自定义错误'
      }
    }
  })
}

export function customeRequest(params) {
  return Post({
    url: '/test',
    data: {
      body: params
    },
    // 相关自定义配置
    config: {
      isShowLoading: false,
      isShowError: false
    }
  })
}
