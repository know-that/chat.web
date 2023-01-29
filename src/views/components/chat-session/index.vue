<script lang="ts" setup>
import { reactive } from "vue"
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { getChatSessionList } from "@/requests/chat"
import Search from '@/views/components/chat-session/search.vue'

const emit = defineEmits(['choice'])

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
  if (chatSessionData.data[index].last_message) {
    chatSessionData.data[index].last_message.is_read = 1
  }
  currentItem.data = item
  console.log(currentItem.data)
  emit('choice', item)
}

const searchParams = reactive({
  visible: false
})
</script>

<template>
  <div class="chat-session">
    <div class="search">
      <a-row>
        <a-col :span="22">
          <a-input :bordered="false" placeholder="search..." allowClear />
        </a-col>
        <a-col :span="2">
          <a class="add info"><plus-circle-outlined @click="searchParams.visible = true" /></a>
        </a-col>
      </a-row>
    </div>

    <a-list item-layout="horizontal" :data-source="chatSessionData.data">
      <template #renderItem="{ item, index }">
        <a-list-item @click="choiceChat(item, index)" :class="{'chat-session-item': currentItem.data.id === item.id}">
          <a-list-item-meta>
            <template #avatar>
              <a-badge :dot="item.last_message?.is_read === 0">
                <a-avatar class="avatar" shape="square" :size="48" :src="item.avatar" />
              </a-badge>
            </template>
            <template #title>
              <a>{{ item.source.nickname }}</a>
            </template>
            <template #description>
              <div class="description">{{ item.last_message?.content }}</div>
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