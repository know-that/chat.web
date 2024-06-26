<script lang="ts" setup>
import {computed, reactive, ref, watch} from "vue"
import { SmileOutlined, FolderOpenOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import Avatar from '@/views/components/auth/avatar.vue'
import { getChatSingle, sendMessageChatSingle } from "@/requests/chat"
import { userStore } from "@/stores/user"
import { OSSUpload } from "@/requests/upload"
import Bubble from "@/views/components/chat/bubble.vue"
import Nickname from "@/views/components/auth/nickname.vue";

const store = userStore()
let meData = computed(() => store.$state.userData)

const props = defineProps({
  currentData: Object as any,
  newData: Object
})

const emits = defineEmits(['change'])

const chatData = reactive({data: {} as any, loading: false})
const chatListParams = reactive({
  receiver_user_id: undefined,
  page: 1
})
const chatList = async (receiverUserId = null) => {
  if (chatData.data && chatData.data.current_page >= chatData.data.last_page) {
    return;
  }

  chatData.loading = true

  if (receiverUserId) {
    chatListParams.receiver_user_id = receiverUserId
  }

  let data = await getChatSingle(chatListParams).then(data => {
    return data.data
  })
	
	if (!chatData.data.data || chatListParams.page === 1) {
    chatData.data = data
  } else {
    data.data.forEach((item: any) => {
      chatData.data.data.push(item)
    })

    chatData.data.current_page = data.current_page
    chatData.data.last_page = data.last_page
  }
  let nextPage = data.current_page + 1
  chatListParams.page = nextPage > data.last_page ? data.last_page : nextPage
  chatData.loading = false
}

const form = ref({
  user_id: undefined,
	message_type: 'message_text',
  message: ''
})
const loading = ref(false)
const submit = async (e: any = {}) => {
	// 阻止 shift + enter
	if (e.shiftKey && e.key) {
		return;
	}
	
	loading.value = true
	try {
		if (form.value.message.trim() === '') {
			message.warning("不能发送空消息")
			return
		}
		form.value.user_id = props.currentData.source_id
		const data = await sendMessageChatSingle(form.value)
		schedule.value = 100
		chatData.data.data.unshift(data.data)
		emits('change', data.data)
	} finally {
		form.value.message = ''
		loading.value = false
	}
}

const emojiOptions = {
  imgSrc: '/img/',
  native: true,
  hasGroupIcons: true,
  hasSearch: false,
  hasGroupNames: true,
  stickyGroupNames: true,
  hasSkinTones: true,
  recentRecords: true
}
const myTextarea = ref(String as any)
const popover = reactive({
  visible: false
})
const emojiSelect = (e: any) => {
  let startPos = myTextarea.value.$el.selectionStart
  let endPos = myTextarea.value.$el.selectionEnd
  form.value.message = form.value.message.substring(0, startPos) + e.i + form.value.message.substring(endPos, form.value.message.length)

  myTextarea.value.$el.focus()
  popover.visible = false
}

/**
 * 文件上传
 * @param e
 */
const schedule = ref(0)
const uploadFile = async (e: any) => {
	// 进行上传
	loading.value = true
	let data = await OSSUpload(e.file, (data: any) => {
		schedule.value = data.total.percent.toFixed(2)
	})
	form.value.message_type = 'message_file'
	form.value.message = String(data.id)
	await submit()
  form.value.message_type = 'message_text'
  form.value.message = ''
}

const scrollLoad = (e: any) => {
  if (
      !chatData.loading &&
      Math.abs(e.target.scrollTop) >= e.target.scrollHeight - e.target.offsetHeight - 100
  ) {
    chatList()
  }
}

watch(
    () => props.currentData,
    (newData, oldData) => {
      chatList(newData.source_id)
    },
    { deep: true, immediate: true }
)
watch(
    () => props.newData,
    (newData, oldData) => {
      chatData.data.data.unshift(newData)
    },
    { deep: true }
)
</script>

<template>
  <div class="single-chat">
    <a-layout v-if="props.currentData.source.nickname">
      <a-layout-header class="left">
        <div class="header-title ml-2">
          <span class="title">
	          <span v-if="props.currentData.source?.friend?.alias">
		          <Nickname :value="props.currentData.source?.friend?.alias" :id="props.currentData.source.id" />
		          <span class="text-gray-400 text-base font-normal">（{{ currentData.source.nickname }}）</span>
	          </span>
	          <span v-else>{{ currentData.source.nickname }}</span>
          </span>
          <ellipsis-outlined class="actions" />
        </div>
      </a-layout-header>

      <a-layout-content class="center">
        <div class="chat-list" v-if="chatData.data?.data && chatData.data.data.length > 0" @scroll="scrollLoad">
          <div v-for="(item, index) in chatData.data?.data" :key="index">
            <div v-if="item.is_system === 1" class="text-gray-400 text-center">{{ item.message.content }}</div>
	          <div v-else-if="item.sender_user_id !== meData.id" class="flex">
		          <div>
			          <Avatar shape="square" :src="item.sender_user.avatar" :params="item.sender_user" />
		          </div>
		          
		          <div class="w-full px-2">
			          <div class="mb-1">
				          <b><Nickname :value="item.sender_user?.friend?.alias || item.sender_user.nickname" :id="item.sender_user.id" /></b>
			          </div>
			          <Bubble direction="left" :item="item" />
		          </div>
	          </div>
            <div v-else class="flex" align="right">
	            <div class="w-full px-2 flex justify-end items-center">
	              <Bubble direction="right" :item="item" />
              </div>
              <div>
                <Avatar shape="square" :src="meData.avatar" :params="meData" />
              </div>
            </div>
          </div>
        </div>
        <a-empty v-else />
      </a-layout-content>

      <a-layout-footer class="footer">
        <div class="actions">
          <a-popover v-model:open="popover.visible" trigger="click">
            <template #content>
              <div class="emoji">
                <EmojiPicker :options="emojiOptions" @select="emojiSelect" />
              </div>
            </template>
            <smile-outlined />
          </a-popover>
          <a-upload :customRequest="uploadFile" :fileList="null">
            <folder-open-outlined />
          </a-upload>
        </div>
	      <a-form @submit="submit">
		      <a-textarea v-model:value="form.message" ref="myTextarea" class="textarea" :bordered="false" @pressEnter="submit($event)" />
		      <div class="submit" align="right">
			      <a-button size="large" class="!px-8" type="primary" :loading="loading" html-type="submit">
				      <span v-if="loading">{{ schedule }}%</span>
				      <span v-else>发送</span>
			      </a-button>
		      </div>
	      </a-form>
      </a-layout-footer>
    </a-layout>
    <a-layout v-else>
      <a-empty />
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
.single-chat {
  width: 100%;
  height: 100%;

  ::v-deep(.ant-layout) {
    height: 100%;
  }

  ::v-deep(.ant-empty) {
    margin: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .center {
    .chat-list {
      overflow-y: auto;
      display: flex;
      flex-flow: column-reverse;
      align-items: baseline;
      height: 100%;
      margin-left: -8px;
      margin-right: -8px;

      >div {
        padding: 8px;
        width: 100%;
      }
    }
  }

  .footer {
    .actions {
      height: 40px;
      line-height: 40px;

      .anticon {
        cursor: pointer;
        font-size: 20px;
      }
      >* {
        padding: 6px;
      }
    }

    .textarea {
      height: 120px;
      resize: none;
    }

    .submit {
      height: 40px;
      line-height: 40px;
    }
  }
}

.emoji {
  height: 400px;

  ::v-deep(.emoji-picker) {
    padding: 0;

	  .emoji-body {
		  padding: 0;
	  }
	  
    .current-emoji, .emoji-block {
      font-size: 20px;
    }
  }
}

::v-deep(.ant-card-body) {
	padding: 0;
}
</style>