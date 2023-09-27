import 'amfe-flexible'
import 'vant/lib/index.css'
import 'normalize.css/normalize.css'
import App from './App.vue'
import router from '@/router/index'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ConfigProvider } from 'vant'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(ConfigProvider)
app.mount('#app')
