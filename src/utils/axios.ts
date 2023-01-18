import axios from 'axios'
import {getCurrentInstance} from "vue";
import { message } from 'ant-design-vue';
import Cookie from 'js-cookie'

// 创建一个 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_WEBSOCKET_API_BASE, // 所有的请求地址前缀部分
    timeout: 60000, // 请求超时时间毫秒
    withCredentials: false, // 异步请求携带cookie
    headers: {
        // 设置后端需要的传参类型
        'Content-Type': 'application/json',
        'token': 'your token',
        'X-Requested-With': 'XMLHttpRequest',
    },
})

// 添加请求拦截器
service.interceptors.request.use(
    function (config) {
        // 在发送请求之前做些什么
        config.headers['Authorization'] = "Bearer " + Cookie.get('Authorization')
        return config
    },
    function (error) {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 这个状态码是和后端约定的
        const code = dataAxios.reset
        return dataAxios
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        message.warning(error.response.data?.message || "请求失败")
        return Promise.reject(error)
    }
)
export default service