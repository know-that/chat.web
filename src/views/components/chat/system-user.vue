<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue"
import moment from 'moment'
import { getNoticeList, getNoticeInfo } from "@/requests/notice"
import { examineFriendRequest } from "@/requests/friend"
import { ManOutlined, WomanOutlined } from '@ant-design/icons-vue'
import Avatar from '@/views/components/auth/avatar.vue'

const Message = getCurrentInstance()?.appContext.config.globalProperties.$message
const props = defineProps({
  currentData: Object,
  newChatData: Object
})

let noticeData = reactive({data: [], loading: false})
const noticeParams = reactive({
  source_type: props.currentData.source.type === 1 ? 'system_user' : 'friend_request',
  page: 1,
  limit: 6
})
const getNotice = async () => {
  if (noticeData.data && noticeData.data.current_page >= noticeData.data.last_page) {
    return;
  }

  noticeData.loading = true

  let data = await getNoticeList(noticeParams).then(data => {
    return data.data
  })

  if (!noticeData.data.data) {
    noticeData.data = data
  } else {
    data.data.forEach(item => {
      noticeData.data.data.push(item)
    })

    noticeData.data.current_page = data.current_page
    noticeData.data.last_page = data.last_page
  }
  let nextPage = data.current_page + 1
  noticeParams.page = nextPage > data.last_page ? data.last_page : nextPage
  noticeData.loading = false
}
getNotice()

const scrollLoad = (e) => {
  if (
      !noticeData.loading &&
      Math.abs(e.target.scrollTop) >= e.target.scrollHeight - e.target.offsetHeight - 100
  ) {
    getNotice()
  }
}

const noticeInfoData = reactive({data: {}})
const confirmAddParams = reactive({
  visible: false,
  form: {
    state: 10,
    reason: undefined
  }
})
const examine = async (item) => {
  noticeInfoData.data = await getNoticeInfo(item.id).then(data => {
    return data.data
  })
  confirmAddParams.visible = true
}

const examineOk = () => {
  examineFriendRequest(noticeInfoData.data.source_id, confirmAddParams.form)
    .then(data => {
      Message.success(data.message || 'ok')
    })
}
</script>

<template>
  <div class="system-user">
    <a-layout>
      <a-layout-header class="left">
        <div class="header-title">
          <span class="title">{{ props.currentData.source.nickname }}</span>
        </div>
      </a-layout-header>

      <a-layout-content class="center" @scroll="scrollLoad">
        <a-list :grid="{ column: 1}" item-layout="vertical" :data-source="noticeData.data.data">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card>
                <template #title>
                  <div class="title">{{ item.source_type === 'system_user' ? item.source.nickname : '好友请求' }}</div>
                </template>
                <template #extra>
                  <span class="info time">{{ moment(item.created_at).format('YYYY-MM-DD H:mm:ss') }}</span>
                </template>
                <div class="word-line">
                  <div v-if="item.source_type === 'system_user'">
                    {{ item.message.content }}
                  </div>
                  <div v-else>
                    用户
                    <a>
                      <Avatar shape="square" :size="30" :src="item.source.user.avatar" :params="item.source.user" />
                      {{ item.source.user.nickname }}
                    </a>
                    希望添加你为好友
                  </div>
                </div>

                <template v-if="item.source_type === 'friend_request'" #actions>
                  <a v-if="item.source.state === 0" @click="examine(item)">查看详情</a>
                  <span v-else-if="item.source.state === 10" class="success">已同意</span>
                  <span v-else-if="item.source.state === 20" class="info">已拒绝</span>
                </template>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </a-layout-content>
    </a-layout>

    <a-modal v-model:visible="confirmAddParams.visible" :width="400" title="好友申请" @ok="examineOk()" cancelText="取消" okText="确认">
      <a-form layout="vertical">
        <a-form-item>
          <span><a-avatar :src="noticeInfoData.data.source.user.avatar" /> {{ noticeInfoData.data.source.user.nickname }}</span>
          <man-outlined v-if="noticeInfoData.data.source.gender === 1" />
          <woman-outlined v-else />
        </a-form-item>

        <a-form-item v-if="noticeInfoData.data?.source.remark" class="word-line">
          {{ noticeInfoData.data.source.remark }}
        </a-form-item>

        <a-divider />

        <a-form-item>
          <a-radio-group v-model:value="confirmAddParams.form.state">
            <a-radio :value="10" >同意</a-radio>
            <a-radio :value="20" >拒绝</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item v-if="confirmAddParams.form.state === 20">
          <a-textarea
            v-model:value="confirmAddParams.form.reason"
            placeholder="拒绝理由，可不填" allow-clear show-count :maxlength="200"
            :autosize="{ minRows: 6, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.system-user {
  width: 100%;
  height: 100%;

  ::v-deep(.ant-layout) {
    height: 100%;

    .center {
      overflow-y: auto;
      display: flex;
      flex-flow: column-reverse;
      height: 100%;

      .ant-row {
        display: flex;
        flex-flow: column-reverse;
      }

      .ant-list {
        width: 100%;
      }

      .ant-col {
        padding: 0 220px;
      }

      .title {
        display: flex;
        align-items: center;

        .left {
          flex: auto;
        }
      }
      .time {
        font-size: 12px
      }
    }
  }
}
</style>

