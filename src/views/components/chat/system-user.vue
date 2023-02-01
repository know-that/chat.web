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

let noticeData = reactive({data: []})
const getNotice = async () => {
  let params = {
    source_type: props.currentData.source.type === 1 ? 'system_user' : 'friend_request',
    page: 1,
    limit: 30
  }
  noticeData.data = await getNoticeList(params).then(data => {
    return data.data
  })
}
getNotice()

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

      <a-layout-content class="center">
        <a-list :grid="{ column: 1}" item-layout="vertical" :data-source="noticeData.data.data">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-card>
                <template #title>
                  <div class="title">{{ item.source_type === 'system_user' ? item.source.nickname : '好友请求' }}</div>
                </template>
                <template #extra>
                  <span class="info" style="font-size: 12px">{{ moment(item.created_at).format('YYYY-MM-DD H:mm:ss') }}</span>
                </template>
                <div class="word-line">
                  <div v-if="item.source_type === 'system_user'">
                    {{ item.message.content }}
                  </div>
                  <div v-else>
                    用户
                    <a>
                      <Avatar shape="square" :size="30" :src="item.source.friend.avatar" :params="item.source.friend" />
                      {{ item.source.friend.nickname }}
                    </a>
                    希望添加你为好友
                  </div>
                </div>

                <template v-if="item.source_type === 'friend_request'" #actions>
                  <a @click="examine(item)">查看详情</a>
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
  height: 100%;

  ::v-deep(.ant-layout) {
    height: 100%;

    .center {
      overflow-y: auto;
      display: flex;
      flex-flow: column-reverse;
      align-items: baseline;

      .ant-col {
        padding: 0 200px;
      }

      .title {
        display: flex;
        align-items: center;

        .left {
          flex: auto;
        }
      }
    }
  }
}
</style>

