<script lang="ts" setup>
import {ref, reactive, nextTick, watch, shallowRef} from 'vue'
import Cookie from 'js-cookie'
import { SettingOutlined } from '@ant-design/icons-vue'
import AuthAvatar from '@/views/components/auth/auth-avatar.vue'
import Chat from '@/views/components/chat/index.vue'
import ChatSession from '@/views/components/chat-session/index.vue'
import moment from 'moment'

const newChatSingleData = ref({data: {}})
const newChatSessionData = ref({update_at: ''})
const websocketParams = ref({
	url: import.meta.env.VITE_WEBSOCKET_URL + "?token=" + Cookie.get("Authorization"),
	interval: 0,
	isOpen: false
})
const initWebsocket = async () => {
	const websocket = new WebSocket(websocketParams.value.url)
	
	websocket.onopen = (res) => {
		websocketParams.value.isOpen = true
		clearInterval(websocketParams.value.interval)
	}
	websocket.onmessage = (res) => {
		let data = JSON.parse(res.data)
		
		switch (data?.type) {
			case 'chat_single':
				newChatSingleData.value.data = JSON.parse(data.data)
				break;
			
			case 'chat_session':
				newChatSessionData.value.update_at = moment().format('YYYY-MM-DD H:mm:ss')
				break;
		}
	}
	websocket.onclose = () => {
		websocketParams.value.isOpen = false
	}
	
	websocket.onerror = function(error) {
		console.error('WebSocket Error: ', error);
	};
}
watch(
	() => websocketParams.value.isOpen,
	async (value) => {
		if (!value) {
			websocketParams.value.interval = setInterval(async () => {
				await initWebsocket()
			}, 1000)
		}
	},
	{ immediate: true }
)

const current = reactive({
  data: {},
  isReload: false
})

const chatSessionChoice = (item: any) => {
  current.data = item
  current.isReload = false
  nextTick(() => {
    current.isReload = true
  });
}

const chatSessionRef = shallowRef()
const chatChange = async (value) => {
	await chatSessionRef.value.setCurrentLastChat(value)
}
</script>

<template>
  <div class="body w-[1200px] h-[800px]">
    <a-layout class="h-full">
      <a-layout-sider class="left" :width="70">
        <AuthAvatar class="avatar" />
        <setting-outlined class="setting" />
      </a-layout-sider>

      <a-layout-sider class="center" :width="300">
        <ChatSession ref="chatSessionRef" :newData="newChatSessionData" @choice="chatSessionChoice" />
      </a-layout-sider>

      <a-layout class="right">
        <Chat :isReload="current.isReload" :currentData="current.data" :newChatData="newChatSingleData.data" @change="chatChange" />
      </a-layout>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
.body {

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
