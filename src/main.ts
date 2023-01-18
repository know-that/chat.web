import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { message } from 'ant-design-vue';
import 'ant-design-vue/es/message/style/css'; //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
import '@/assets/index.less'
import '@/assets/antd.less'

const app = createApp(App)
app.config.globalProperties.$message = message

const pinia = createPinia()
app.use(pinia)

app.mount('#app')
