// 静态路由
const constantRoutes = [
	{
		path: '/main',
		title: '主页',
		components: {
			default: () => import('@/pages/not-found')
			// footer: tabBar
		},
		meta: {
			activeTab: 'me'
		}
	},
	{
		path: '/:pathMatch(.*)',
		component: () => import('@/pages/not-found.vue')
	}
]

export default constantRoutes
