<script lang="ts" setup>
import {reactive} from 'vue'
import Cookie from 'js-cookie'
import { SettingOutlined } from '@ant-design/icons-vue'
import AuthAvatar from '@/views/components/auth/auth-avatar.vue'
import Chat from '@/views/components/chat/index.vue'
import Friend from '@/views/components/friend/index.vue'

let url = import.meta.env.VITE_WEBSOCKET_URL + "?token=" + Cookie.get("Authorization")
const newChatData = reactive({data: {}})
const websocket = new WebSocket(url)
websocket.onmessage = (res) => {
  let data = JSON.parse(res.data)
  if (data?.message) {
    newChatData.data = JSON.parse(data.message)
  }
}

const current = reactive({
  data: {}
})
</script>

<template>
  <div class="body">
    <a-layout>
      <a-layout-sider class="left" :width="70">
        <AuthAvatar class="avatar" />
        <setting-outlined class="setting" />
      </a-layout-sider>

      <a-layout-sider class="center" :width="300">
        <Friend @choice="item => current.data = item" />
      </a-layout-sider>

      <a-layout class="right">
        <Chat :currentData="current.data" :newChatData="newChatData.data" />
      </a-layout>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
.body {
  width: 1200px;
  margin: 80px auto 0 auto;

  ::v-deep(.ant-layout) {
    .ant-layout-header {
      background-color: #E7E8E9;
      border-bottom: 1px solid;
      border-color: @border-color-base;
    }
    .ant-layout-header, .ant-layout-content, .ant-layout-footer {
      padding: 8px;
    }
  }

  .left {
    position: relative;

    .avatar {
      position: absolute;
      top: 11px;
      left: 11px;
      right: 11px;
      cursor: pointer;
    }

    .setting {
      position: absolute;
      bottom: 16px;
      left: 22px;
      right: 22px;
      font-size: 26px;
      cursor: pointer;
    }
  }

  ::v-deep(.center) {
    background-color: #E7E8E9;
  }

  ::v-deep(.empty) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
