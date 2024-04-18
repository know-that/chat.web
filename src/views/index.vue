<script lang="ts" setup>
import {ref, reactive, nextTick, watch, shallowRef} from 'vue'
import Cookie from 'js-cookie'
import { SettingOutlined, MessageOutlined, MessageFilled } from '@ant-design/icons-vue'
import AuthAvatar from '@/views/components/auth/auth-avatar.vue'
import Chat from '@/views/components/chat/index.vue'
import ChatSession from '@/views/components/chat-session/index.vue'
import moment from 'moment'
import SettingUserInfo from '@/views/components/setting/user-info.vue'
import Bus from '@/utils/bus'
import IconFront from "@/views/components/icon-front.vue"
import Friend from "@/views/components/friend/index.vue"

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
const chatChange = async (value: any) => {
	await chatSessionRef.value.setCurrentLastChat(value)
}
const sessionChange = async () => {
	await chatSessionRef.value.chatSessionList()
}

const settingUserInfoRef = shallowRef()
Bus.on('index.editUserInfo', () => {
	settingUserInfoRef.value.open()
})


const active = ref('chat')
</script>

<template>
  <div class="body relative overflow-hidden w-[1200px] h-[800px]">
    <a-layout class="h-full">
      <a-layout-sider :width="70">
	      <div class="h-full flex flex-col items-center">
		      <AuthAvatar class="avatar py-3 cursor-pointer" />
		      
		      <div class="flex flex-auto flex-col items-center gap-4 py-3 text-[#00c1de] text-2xl">
			      <MessageFilled v-if="active === 'chat'" />
			      <MessageOutlined v-else @click="active = 'chat'" />
			      
			      <IconFront v-if="active === 'friend'" type="friend-fill" />
			      <IconFront v-else type="friend" @click="active = 'friend'" />
		      </div>
		      
		      <div class="flex justify-center py-3">
			      <SettingOutlined class="text-3xl" />
		      </div>
	      </div>
      </a-layout-sider>

      <template v-if="active === 'chat'">
	      <a-layout-sider class="center" :width="300">
		      <ChatSession ref="chatSessionRef" :newData="newChatSessionData" @choice="chatSessionChoice" />
	      </a-layout-sider>
	      
	      <a-layout class="right">
		      <Chat
			      :isReload="current.isReload"
			      :currentData="current.data"
			      :newChatData="newChatSingleData.data"
			      @chatChange="chatChange"
			      @sessionChange="sessionChange"
		      />
	      </a-layout>
      </template>
	    
	    <template v-if="active === 'friend'">
		    <Friend />
	    </template>
    </a-layout>
	  
	  <SettingUserInfo ref="settingUserInfoRef" />
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
