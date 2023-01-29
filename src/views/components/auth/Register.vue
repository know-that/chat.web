<script lang="ts" setup>
import { getCurrentInstance, reactive } from 'vue'
import Cookie from 'js-cookie'
import { login, register } from '@/requests/auth'

const Message = getCurrentInstance()?.appContext.config.globalProperties.$message
defineProps({
  params: Object
})

const form = reactive({
  account: undefined,
  password: undefined,
  verify_code: undefined
})

const submit = () => {
  register(form).then(res => {
    login(form).then(data => {
      Message.success(data?.message ?? 'ok')
      console.log(data)

      Cookie.set("Authorization", data.data.access_token, {
        path: '/',
        maxAge: data.data.expires_in
      })
    })
  })
}
</script>

<template>
  <div>
    <a-modal v-model:visible="params.visible" :width="350" :footer="null" title="快速注册">
      <a-form layout="vertical">
        <a-form-item label="账号">
          <a-input v-model:value="form.account" size="large" placeholder="请输出账户 、邮箱、手机号"/>
        </a-form-item>

        <a-form-item label="密码">
          <a-input-password v-model:value="form.password" size="large" autocomplete="new-password" placeholder="请输入密码"/>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" size="large" @click="submit" block>快速注册</a-button>
        </a-form-item>

        <a-form-item>
          <div align="center">
            <span>已有账号？</span>
            <a @click="$emit('change', 'login')">立即登陆</a>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.ant-form) {
  .ant-form-item {
    margin-bottom: 16px;

    .ant-form-item-control {
      line-height: 30px;
    }

    .ant-btn-link {
      padding: 0;
    }

    .des {
      text-align: center;
    }
  }

  .ant-form-item:last-child {
    margin-bottom: 0;
  }
}
</style>