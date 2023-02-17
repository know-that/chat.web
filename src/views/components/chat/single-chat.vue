<script lang="ts" setup>
import { reactive, ref, watch } from "vue";
import { SmileOutlined, FolderOpenOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { EmojiPicker } from 'vue3-twemoji-picker-final'
import Avatar from '@/views/components/auth/avatar.vue'
import { getChatList, sendMessage } from "@/requests/chat"
import { userStore } from "@/stores/user"

const store = userStore()
let meData = {
  data: store.$state.user
}

const props = defineProps({
  currentData: Object,
  newData: Object
})

const chatData = reactive({data: {}, loading: false})
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

  let data = await getChatList(chatListParams).then(data => {
    return data.data
  })

  if (!chatData.data.data) {
    chatData.data = data
  } else {
    data.data.forEach(item => {
      chatData.data.data.push(item)
    })

    chatData.data.current_page = data.current_page
    chatData.data.last_page = data.last_page
  }
  let nextPage = data.current_page + 1
  chatListParams.page = nextPage > data.last_page ? data.last_page : nextPage
  chatData.loading = false
}

const form = reactive({
  user_id: undefined,
  message: ''
})
const submit = () => {
  form.user_id = props.currentData.source_id
  sendMessage(form).then(data => {
    chatData.data.data.unshift(data.data)
    form.message = ''
  })
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
const myTextarea = ref(null)
const popover = reactive({
  visible: false
})
const emojiSelect = (e) => {
  let startPos = myTextarea.value.$el.selectionStart
  let endPos = myTextarea.value.$el.selectionEnd
  form.message = form.message.substring(0, startPos) + e.i + form.message.substring(endPos, form.message.length)

  myTextarea.value.$el.focus()
  popover.visible = false
}

const uploadFile = (e) => {
  console.log(e)
}

const scrollLoad = (e) => {
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
        <div class="header-title">
          <span class="title">{{ currentData.source.nickname }}</span>
          <ellipsis-outlined class="actions" />
        </div>
      </a-layout-header>

      <a-layout-content class="center">
        <div class="chat-list" v-if="chatData.data?.data && chatData.data.data.length > 0" @scroll="scrollLoad">
          <div v-for="(item, index) in chatData.data?.data" :key="index">
            <div v-if="item.is_system === 1" class="info chat-item-center">{{ item.message.content }}</div>
            <div v-else-if="item.receiver_user_id === props.currentData.source?.id" class="chat-item-left">
              <div>
                <Avatar shape="square" :src="props.currentData.source.avatar" :params="props.currentData.source" />
              </div>

              <div class="message-item">
                <div><b>{{ props.currentData.source.nickname }}</b></div>
                <div class="content">
                  <span>{{ item.message.content }}</span>
                </div>
              </div>
            </div>
            <div v-else class="chat-item-right" align="right">
              <div class="message-item">
                <div><b>{{ meData.data.nickname }}</b></div>
                <div class="content">
                  <span>{{ item.message.content }}</span>
                </div>
              </div>
              <div>
                <Avatar shape="square" :src="meData.data.avatar" :params="meData.data" />
              </div>
            </div>
          </div>
        </div>
        <a-empty v-else />
      </a-layout-content>

      <a-layout-footer class="footer">
        <div class="actions">
          <a-popover v-model:visible="popover.visible" trigger="click">
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
        <a-textarea v-model:value="form.message" ref="myTextarea" class="textarea" :bordered="false" />
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

      .chat-item-center {
        text-align: center;
      }
      .chat-item-left {
        margin-bottom: 20px;
        display: flex;

        .message-item {
          .content {
            text-align: left;
          }
        }
      }
      .chat-item-right {
        margin-bottom: 20px;
        display: flex;
        justify-content: right;

        .message-item {
          .content {
            text-align: right;

            span {
              text-align: left;
            }
          }
        }
      }

      .message-item {
        width: 100%;
        padding:0 10px;

        .content {
          white-space: pre-line;
          word-break: break-all;
          width: 80%;
          position: relative;

          span {
            display: inline-block;
            position: relative;
            padding: 10px;
            border-radius: 8px;
            overflow: hidden;
            z-index: 1;
          }
          span:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: e("@{primary-color}");
            z-index: -1;
          }
        }
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

    .current-emoji, .emoji-block {
      font-size: 20px;
    }
  }
}
</style>