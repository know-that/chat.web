import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { message } from 'ant-design-vue';
import '@/assets/style.css'
import '@/assets/index.less'
import '@/assets/antd.less'

import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')

const app = createApp(App)
app.config.globalProperties.$message = message

const pinia = createPinia()
app.use(pinia)

app.mount('#app')
