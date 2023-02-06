# chat.web
这是一个及时通信的前端项目  
环境要求 nodejs 版本 16

## 快速开始

```sh
npm install
```

#### 本地
```sh
npm run dev
```

#### 生产
```sh
npm run build
```

nginx 配置参考
```shell
server {
  listen 80;
  server_name chat.knowthat.cn;
  rewrite ^(.*) https://$server_name$1 permanent;
}

server {
    listen      443 ssl http2;
    server_name chat.knowthat.cn;

    # ssl
    ssl_certificate_key /etc/letsencrypt/live/chat.knowthat.cn/privkey.pem;
    ssl_certificate     /etc/letsencrypt/live/chat.knowthat.cn/fullchain.pem;

    location / {
        root    /usr/share/nginx/html/chat/chat.web/dist;
        index   index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # 代理到 Swoole server
    location /websocket {
        proxy_set_header client-real-ip $remote_addr;
        proxy_pass http://localhost:8001/websocket;
    }
}
```

## 主要功能
* [x] 好友申请
* [x] 用户搜索
* [x] 系统通知（非实时现在需要刷新页面，后续支持实时）
* [x] 及时聊天对话
* [x] 聊天表情发送

## 后续支持
* [ ] 基本信息修改
* [ ] 系统通知（实时提醒）
* [ ] gif 动图
* [ ] 表情收藏
* [ ] 附件发送
* [ ] 文件传输助手

## 项目方向
打造一个免费的客服 sass 系统，支持私有化部署
