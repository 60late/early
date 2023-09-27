import { createRouter, createWebHistory } from 'vue-router'
import constantRoutes from './routes.js'
import { showToast } from 'vant'

/**
 * @description: 创建路由
 */
const router = createRouter({
	history: createWebHistory(),
	routes: constantRoutes,
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * @description: 路由拦截器
 */
router.beforeEach((to, from, next) => {
	let token = sessionStorage.getItem('MACTOKEN') || 1
	if (!token) {
		showToast('登录过期，请重新登录')
	} else {
		next()
	}
})

export default router
