<script lang="ts" setup>
import {computed, reactive, ref, shallowRef} from "vue"
import Cookie from 'js-cookie'
import Login from '@/views/components/auth/Login.vue'
import Register from '@/views/components/auth/Register.vue'
import Avatar from '@/views/components/auth/avatar.vue'
import { userStore } from '@/stores/user'
import { getMe } from '@/requests/auth'
import Bus from '@/utils/bus'

const store = userStore()
let meData = computed(() => store.$state.userData)
const getMeData = async () => {
	await store.getMeData()
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

const avatarRef = shallowRef()
const logout = () => {
  Cookie.remove("Authorization")
  location.reload()
}
</script>

<template>
  <div>
    <Avatar v-if="meData.id" ref="avatarRef" :src="meData.avatar" :params="meData">
      <template #actions>
        <div class="mt-2" align="right">
          <a-button class="mr-2" size="small" @click="Bus.emit('index.editUserInfo');avatarRef.switchVisible()">编辑资料</a-button>
          <a-button size="small" @click="logout">退出登录</a-button>
        </div>
      </template>
    </Avatar>
    <a-avatar v-else class="bg-slate-500" shape="square" :size="48" @click="login()">请登录</a-avatar>

    <Login :params="loginParams" @change="loginChange" />
    <Register :params="registerParams" @change="loginChange" />
  </div>
</template>