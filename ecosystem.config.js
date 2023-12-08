module.exports = {
  apps: [
    {
      name: 'chat.knowthat.cn', // 如 www.knowthat.cn
      exec_mode: 'cluster', // 启动模式，cluster 为集群，无需修改
      instances: 1, // // 实例数量，max 为 CPU 核心数，无需修改
      script: './node_modules/nuxt/bin/nuxt.js', // 无需修改
      args: 'start', // 启动参数，通常无需修改
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
}
