<script lang="ts" setup>
import { reactive } from "vue"
import Cookie from 'js-cookie'
import Login from '@/views/components/auth/Login.vue'
import Register from '@/views/components/auth/Register.vue'
import Avatar from '@/views/components/auth/avatar.vue'
import { userStore } from '@/stores/user'
import { getMe } from '@/requests/auth'

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

const logout = () => {
  Cookie.remove("Authorization")
  location.reload()
}
</script>

<template>
  <div>
    <Avatar v-if="meData.data.id" :src="meData.data.avatar" :params="meData.data">
      <template #actions>
        <div align="right">
          <a-button size="small" @click="logout">退出登录</a-button>
        </div>
      </template>
    </Avatar>
    <a-avatar v-else class="avatar" shape="square" :size="48" @click="login()">请登录</a-avatar>

    <Login :params="loginParams" @change="loginChange" />
    <Register :params="registerParams" @change="loginChange" />
  </div>
</template>