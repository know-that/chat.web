<script lang="ts" setup>
import {defineProps, reactive, ref, watch} from "vue";
import {getChatList, sendMessage} from "@/requests/chat";
import { SmileOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
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
    data.data.data.reverse()
    return data.data
  })
}

const form = reactive({
  user_id: undefined,
  message: undefined
})
const submit = () => {
  form.user_id = props.currentData.id
  sendMessage(form).then(data => {
    chatData.data.data.push(data.data)
    form.message = undefined
  })
}

watch(
    () => props.currentData,
    (newData, oldData) => {
      chatList(newData.id)
    },
    { deep: true }
)
watch(
    () => props.newChatData,
    (newData, oldData) => {
      chatData.data.data.push(newData)
    },
    { deep: true }
)
</script>

<template>
  <div class="chat">
    <a-layout v-if="props.currentData.nickname">
      <a-layout-header class="left">
        <span class="title">{{ currentData.nickname }}</span>
      </a-layout-header>

      <a-layout-content class="center">
        <div v-if="chatData.data?.data && chatData.data.data.length > 0">
          <div v-for="(item, index) in chatData.data?.data" :key="index">
            <div v-if="item.receiver_user_id === props.currentData?.id" style="margin-bottom: 20px;display: flex">
              <div><a-avatar shape="square" :size="48" :src="props.currentData.avatar" /></div>

              <div style="width: 100%;padding:0 10px;">
                <div><b>{{ props.currentData.nickname }}</b></div>
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
.chat {
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
}

</style>