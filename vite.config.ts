import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    base: env.VITE_PUBLIC_PATH,

    plugins: [
      vue(),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: 'less'
          }),
        ],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_TITLE
          }
        }
      })
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },

    //配置跨域
    server: {
      open: true,  //启动项目后打开浏览器
      port: 5173,   //端口
      proxy: {
        '/websocket': {
          target: env.VITE_WEBSOCKET_API_HOST,  //API服务地址
          changeOrigin: true,             //开启跨域
          rewrite: (path) => path
        }
      }
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: { // 在这里自定义主题色等样式
            '@selection': '#00c1de80', // 选中色
            '@primary-color': '#00c1de', // 全局主色
            '@primary-color-base': '#0099b1',
            '@link-color': '#00c1de', // 链接色
            '@success-color': '#52c41a', // 成功色
            '@warning-color': '#faad14', // 警告色
            '@error-color': '#f5222d', // 错误色
            '@font-size-base': '14px', // 主字号
            '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
            '@text-color': '#606266',// 主文本色
            '@text-color-secondary': '#c0c4cc', // 次文本色
            '@disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
            '@border-radius-base': '4px', // 组件/浮层圆角
            '@border-color-base': '#d9d9d9', // 边框色
            '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影

            '@background-color': "#FFFFFF",
            '@background-color-secondary': "#dddddd",
          },
          javascriptEnabled: true,
        },
      },
    }
  })
}
