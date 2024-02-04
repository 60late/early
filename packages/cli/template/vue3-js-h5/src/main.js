import 'amfe-flexible'
import '@/assets/css/common.css'
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import drag from './directives/drag'
import lazyLoad from '@/directives/lazy-load'
import permission from '@/directives/permission'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Button, Cell, List, NavBar } from 'vant'
const app = createApp(App)

// 使用路由和pinia
app.use(createPinia()).use(router)
// 使用vant组件
app.use(Button).use(List).use(Cell).use(NavBar)
// 指令注入
app.use(lazyLoad).use(permission).use(drag)

app.mount('#app')
