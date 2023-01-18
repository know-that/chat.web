<script lang="ts" setup>
import {defineProps, getCurrentInstance, reactive, toRaw} from "vue";
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
    <a-modal v-model:visible="props.params.visible" :width="600" :footer="null" title="搜索">
      <a-input class="input-search" v-model:value="form.search" size="large" @pressEnter="submit()">
        <template #suffix>
          <search-outlined @click="submit()" />
        </template>
      </a-input>

      <a-list item-layout="horizontal" :data-source="users.data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :src="item.avatar" />
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
              <a @click="addFriend(item)">加为好友</a>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-modal>

    <a-modal v-model:visible="confirmAddParams.visible" :width="400" title="添加好友申请" @ok="handleFriendAdd()" cancelText="取消" okText="发送请求">
      <a-textarea
        v-model:value="confirmAddParams.form.remark"
        placeholder="textarea with clear icon" allow-clear show-count :maxlength="200"
        :autosize="{ minRows: 6, maxRows: 6 }"
      />
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.input-search) {
  border-radius: 100px;
}
</style>