<script lang="ts" setup>
import {reactive, watch} from "vue"
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { getChatSessionList } from "@/requests/chat"
import Search from '@/views/components/chat-session/search.vue'

const emit = defineEmits(['choice'])
const props = defineProps({
  newData: Object
})

let chatSessionData = reactive({data: []})
const chatSessionList = async () => {
  let params = {
    page: 1,
    limit: 30
  }
  chatSessionData.data = await getChatSessionList(params).then(data => {
    return data.data
  })
}
chatSessionList()

const currentItem = reactive({data: {}})
const choiceChat = (item, index) => {
  if (chatSessionData.data[index].last_chat) {
    chatSessionData.data[index].last_chat.message.is_read = 1
  }
  currentItem.data = item
  emit('choice', item)
}

const searchParams = reactive({
  visible: false
})

const showDot = (item) => {
  let bool
  if (item.last_chat_type === 'chat_single') {
      bool = item.last_chat?.message.is_read === 0 && item.last_chat.receiver_user_id !== item.user_id
  } else {
      bool = item.last_chat?.message.is_read === 0
  }
  return bool
}

watch(
    () => props.newData.update_at,
    (newData, oldData) => {
      chatSessionList()
    },
    { deep: true }
)

const setCurrentLastChat = async (item: any) => {
	currentItem.data.lastChat = item
}

defineExpose({
	setCurrentLastChat,
	chatSessionList
})
</script>

<template>
  <div class="chat-session flex flex-col">
    <div class="search">
      <a-row>
        <a-col :span="22">
          <a-input :bordered="false" placeholder="搜索会话..." allowClear />
        </a-col>
        <a-col :span="2">
          <a class="add info"><plus-circle-outlined @click="searchParams.visible = true" /></a>
        </a-col>
      </a-row>
    </div>

    <a-list class="flex-1 max-h-full overflow-y-auto" item-layout="horizontal" :data-source="chatSessionData.data">
      <template #renderItem="{ item, index }">
        <a-list-item @click="choiceChat(item, index)" :class="{'chat-session-item': currentItem.data.id === item.id}">
          <a-list-item-meta>
            <template #avatar>
              <a-badge :dot="showDot(item)">
                <a-avatar shape="square" :size="48" :src="item.source.avatar">{{ item.source.nickname }}</a-avatar>
              </a-badge>
            </template>
            <template #title>
              <a>{{ item.source.nickname }}</a>
            </template>
            <template #description>
              <div class="description">
	              <span v-if="item.last_chat?.message_type === 'message_file'">[{{ item.last_chat?.message.type_text }}]</span>
	              <span>{{ item.last_chat?.message.content }}</span>
              </div>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>

    <Search :params="searchParams" />
  </div>
</template>

<style lang="less" scoped>
.chat-session {
  height: 100%;
  border-right: 1px solid;
  border-color: @border-color-base;
	
	::v-deep(.ant-list) {
		.ant-spin-container, .ant-spin-nested-loading {
			height: 100%;
			max-height: 100%;
		}
		.ant-list-empty-text {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

  .search {
    height: 64px;
    padding: 12px;
    background-color: @background-color-secondary;
    line-height: 40px;
  }

  .ant-list-item {
    cursor: pointer;
    padding: 12px;

    .ant-list-item-meta-title {
      margin-bottom: 0;
    }

    .ant-list-item-meta-avatar {
      margin-right: 8px;
    }

    .description {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .add {
    font-size: 20px;
  }
  .chat-session-item {
    background-color: e("@{primary-color}10");
  }
}
</style>