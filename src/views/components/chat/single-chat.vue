<script lang="ts" setup>
import {defineProps, reactive, ref, watch} from "vue";
import {getChatList, sendMessage} from "@/requests/chat";
import { SmileOutlined, FolderOpenOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import {userStore} from "@/stores/user"

const store = userStore()
let meData = {
  data: store.$state.user
}

const props = defineProps({
  currentData: Object,
  newChatData: Object
})

const chatData = reactive({data: []})
const chatListParams = reactive({
  receiver_user_id: undefined,
  page: 1,
  limit: 30
})
const chatList = async (receiverUserId = null) => {
  if (receiverUserId) {
    chatListParams.receiver_user_id = receiverUserId
  }

  chatData.data = await getChatList(chatListParams).then(data => {
    return data.data
  })
}

const form = reactive({
  user_id: undefined,
  message: undefined
})
const submit = () => {
  form.user_id = props.currentData.source_id
  sendMessage(form).then(data => {
    chatData.data.data.unshift(data.data)
    form.message = undefined
  })
}

watch(
    () => props.currentData,
    (newData, oldData) => {
      chatList(newData.source_id)
    },
    { deep: true, immediate: true }
)
watch(
    () => props.newChatData,
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
        <div class="header-title">
          <span class="title">{{ currentData.source.nickname }}</span>
          <ellipsis-outlined class="actions" />
        </div>
      </a-layout-header>

      <a-layout-content class="center">
        <div class="chat-list" v-if="chatData.data?.data && chatData.data.data.length > 0">
          <div v-for="(item, index) in chatData.data?.data" :key="index">
            <div v-if="item.receiver_user_id === props.currentData.source?.id" style="margin-bottom: 20px;display: flex">
              <div><a-avatar shape="square" :size="48" :src="props.currentData.source.avatar" /></div>

              <div style="width: 100%;padding:0 10px;">
                <div><b>{{ props.currentData.source.nickname }}</b></div>
                <div style="white-space: pre-line;word-break: break-all; width: 80%">
                  <span style="display: inline-block;padding: 10px;background-color: #00c1de;border-radius: 8px;">{{ item.content }}</span>
                </div>
              </div>
            </div>
            <div v-else style="margin-bottom: 20px;display: flex;justify-content: right" align="right">
              <div style="width: 100%;padding:0 10px;">
                <div><b>{{ meData.data.nickname }}</b></div>
                <div style="text-align: right;white-space: pre-line;word-break: break-all;width: 80%">
                  <span style="text-align: left;display: inline-block;padding: 10px;background-color: #00c1de;border-radius: 8px;">{{ item.content }}</span>
                </div>
              </div>
              <div><a-avatar shape="square" :size="48" :src="meData.data.avatar" /></div>
            </div>
          </div>
        </div>
        <a-empty v-else />
      </a-layout-content>

      <a-layout-footer class="footer">
        <div class="actions">
          <smile-outlined />
          <folder-open-outlined />
        </div>
        <a-textarea v-model:value="form.message" class="textarea" :bordered="false" placeholder="Autosize height based on content lines" />
        <div class="submit" align="right">
          <a-button type="primary" ghost @click="submit()">发送</a-button>
        </div>
      </a-layout-footer>
    </a-layout>
    <a-layout v-else>
      <a-empty />
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
.single-chat {
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
      font-size: 20px;
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

</style>