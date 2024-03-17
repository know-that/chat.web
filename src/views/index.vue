<script lang="ts" setup>
import { reactive, nextTick } from 'vue'
import Cookie from 'js-cookie'
import { SettingOutlined } from '@ant-design/icons-vue'
import AuthAvatar from '@/views/components/auth/auth-avatar.vue'
import Chat from '@/views/components/chat/index.vue'
import ChatSession from '@/views/components/chat-session/index.vue'
import moment from 'moment'

let url = import.meta.env.VITE_WEBSOCKET_URL + "?token=" + Cookie.get("Authorization")
const newChatSingleData = reactive({data: {}})
const newChatSessionData = reactive({update_at: undefined})
const websocket = new WebSocket(url)
websocket.onmessage = (res) => {
  let data = JSON.parse(res.data)

  switch (data?.type) {
    case 'chat_single':
      newChatSingleData.data = JSON.parse(data.data)
      break;

    case 'chat_session':
      newChatSessionData.update_at = moment().format('YYYY-MM-DD H:mm:ss')
      break;
  }
}

const current = reactive({
  data: {},
  isReload: false
})

const chatSessionChoice = (item) => {
  current.data = item
  current.isReload = false
  nextTick(() => {
    current.isReload = true
  });
}
</script>

<template>
  <div class="body">
    <a-layout>
      <a-layout-sider class="left" :width="70">
        <AuthAvatar class="avatar" />
        <setting-outlined class="setting" />
      </a-layout-sider>

      <a-layout-sider class="center" :width="300">
        <ChatSession :newData="newChatSessionData" @choice="chatSessionChoice" />
      </a-layout-sider>

      <a-layout class="right">
        <Chat :isReload="current.isReload" :currentData="current.data" :newChatData="newChatSingleData.data" />
      </a-layout>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
.body {
  width: 1200px;
  margin: 50px auto;

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
