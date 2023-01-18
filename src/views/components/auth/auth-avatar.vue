<script lang="ts" setup>
import Login from '@/views/components/auth/Login.vue'
import Register from '@/views/components/auth/Register.vue'
import { userStore } from '@/stores/user'
import { getMe } from '@/requests/auth'
import {reactive} from "vue";

const store = userStore()
let meData = {
  data: store.$state.user
}
const getMeData = async () => {
  let data = await getMe().then(data => {
    return data.data
  })

  // 设置用户信息
  store.$patch({user: data})
}
getMeData()

const loginParams = reactive({
  visible: false
})
const registerParams = reactive({
  visible: false
})
const login = () => {
  loginParams.visible = true
}
const loginChange = (mode) => {
  loginParams.visible = mode !== 'register'
  registerParams.visible = mode === 'register'
}
</script>

<template>
  <div>
    <a-avatar v-if="meData.data.id" class="avatar" shape="square" :size="48" :src="meData.data.avatar"></a-avatar>
    <a-avatar v-else class="avatar" shape="square" :size="48" @click="login()">未登录</a-avatar>

    <Login :params="loginParams" @change="loginChange" />
    <Register :params="registerParams" @change="loginChange" />
  </div>
</template>