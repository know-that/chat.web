<script lang="ts" setup>
import { getCurrentInstance, reactive } from "vue";
import { SearchOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons-vue'
import { getSearchList } from '@/requests/search'
import { addFriendRequest } from '@/requests/friend'

const Message = getCurrentInstance()?.appContext.config.globalProperties.$message
const props = defineProps({
  params: Object
})

const form = reactive({
  search: ''
})

const users = reactive({
  data: []
})
const submit = async () => {
  users.data = await getSearchList(form).then(data => {
    return data.data
  })
}

const addFriend = (item) => {
  confirmAddParams.form.friend_id = item.id
  confirmAddParams.visible = true

}
const confirmAddParams = reactive({
  visible: false,
  form: {
    friend_id: undefined,
    remark: undefined
  }
})
const handleFriendAdd = async () => {
  await addFriendRequest(confirmAddParams.form).then(data => {
    Message.success(data.message || 'ok')
  })
  confirmAddParams.visible = false
}
</script>

<template>
  <div>
    <a-modal v-model:open="props.params.visible" :width="600" :footer="null" title="搜索用户">
      <a-input class="input-search" v-model:value="form.search" size="large" @pressEnter="submit()" placeholder="输入昵称、账号查找好友">
        <template #suffix>
          <search-outlined @click="submit()" />
        </template>
      </a-input>

      <a-list class="mt-8" item-layout="horizontal" :data-source="users.data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :size="48" :src="item.avatar" />
              </template>
              <template #title>
                <a>{{ item.nickname }}</a>
                <man-outlined v-if="item.gender === 1" />
                <woman-outlined v-else />
              </template>
              <template #description>
                {{ item.account }}
              </template>
            </a-list-item-meta>

            <template #actions>
	            <a-button type="primary" @click="addFriend(item)" ghost>加为好友</a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>

    <a-modal
	    v-model:open="confirmAddParams.visible"
	    :width="400"
	    title="添加好友申请"
	    @ok="handleFriendAdd()"
	    cancelText="取消"
	    okText="发送请求"
	    :footerStyle="{marginTop: '30px'}"
    >
      <a-textarea
        v-model:value="confirmAddParams.form.remark"
        placeholder="请表明你的来意"
        allow-clear
        show-count
        :maxlength="200"
        :autoSize="{ minRows: 6, maxRows: 6 }"
      />
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.input-search) {
  border-radius: 100px;
}
::v-deep(.ant-list-item) {
	padding: 0;
}
::v-deep(.ant-modal-footer) {
	margin-top: 30px;
	text-align: right;
}
</style>