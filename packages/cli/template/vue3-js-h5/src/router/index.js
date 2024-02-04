import { createRouter, createWebHistory } from 'vue-router'
import { showToast } from 'vant'
import { usePageInfoStore } from '@/stores/page-info.js'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        title: ''
      },
      component: () => import('@/views/home.vue')
    },
    {
      path: '/example',
      name: '示例',
      children: [
        {
          path: 'pinia',
          name: 'Pinia示例',
          meta: {
            title: 'Pinia示例'
          },
          component: () => import('@/views/examples/pinia.vue')
        },
        {
          path: 'auth',
          name: '路由权限示例',
          meta: {
            title: '路由权限示例'
          },
          component: () => import('@/views/examples/auth.vue')
        },
        {
          path: 'need-auth',
          name: '需要权限的页面',
          component: () => import('@/views/examples/auth.vue'),
          meta: {
            needAuth: true
          }
        },
        {
          path: 'axios',
          name: '请求页面',
          meta: {
            title: '请求示例'
          },
          component: () => import('@/views/examples/axios.vue')
        },
        {
          path: 'hook',
          name: 'hook示例',
          meta: {
            title: 'hook使用示例'
          },
          component: () => import('@/views/examples/hook.vue')
        },
        {
          path: 'directives',
          name: '指令演示',
          meta: {
            title: '自定义指令演示'
          },
          component: () => import('@/views/examples/directives/index.vue')
        },
        {
          path: 'directives/lazy-load',
          name: '图片懒加载指令',
          meta: {
            title: '图片懒加载指令演示'
          },
          component: () => import('@/views/examples/directives/lazy-load.vue')
        },
        {
          path: 'directives/permission',
          name: '权限指令',
          meta: {
            title: '权限指令演示'
          },
          component: () => import('@/views/examples/directives/permission.vue')
        },
        {
          path: 'component',
          name: '组件封装',
          meta: {
            title: '自定义拖拽组件'
          },
          component: () => import('@/views/examples/component.vue')
        }
      ]
    }
  ]
})

/**
 * 处理身份验证
 * @param {string} to - 路由路径
 * @param {string} from - 来自的路由路径
 * @param {function} next - 下一个路由
 */
function handleCheckAuth(to, from, next) {
  const auth = sessionStorage.getItem('token')
  if (to.meta.needAuth && !auth) {
    nprogress.done()
    showToast('无权限访问')
  } else {
    next()
  }
}

/**
 * 处理设置页面标题
 * @param {string} to - 路由信息
 */
function handleSetPageTitle(to) {
  const { setPageTitle } = usePageInfoStore()
  const pageTitle = to.meta?.title || ''
  setPageTitle(pageTitle)
}

/* 顶部滚动条加载 */
nprogress.configure({
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
})

/* 路由守卫(跳转前) */
router.beforeEach((to, from, next) => {
  nprogress.start()
  handleCheckAuth(to, from, next)
  handleSetPageTitle(to)
})

/* 路由守卫(跳转后) */
router.afterEach(() => {
  nprogress.done()
})

export default router
