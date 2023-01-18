<script lang="ts" setup>
import {defineProps, getCurrentInstance, reactive} from 'vue'
import Cookie from 'js-cookie'
import { login } from '@/requests/auth'

defineProps({
  params: Object
})
const Message = getCurrentInstance()?.appContext.config.globalProperties.$message

const form = reactive({
  account: undefined,
  password: undefined
})

const submit = () => {
  login(form).then(data => {
    Message.success(data?.message ?? 'ok')

    Cookie.set("Authorization", data.data.access_token, {
      path: '/',
      expires: data.data.expires_in
    })

    params.visible = false
  })
}
</script>

<template>
  <div>
    <div>
      <a-modal v-model:visible="params.visible" :width="350" :footer="null" title="立即登陆">
        <a-form layout="vertical">
          <a-form-item label="账号">
            <a-input v-model:value="form.account" size="large" placeholder="请输出账户 、邮箱、手机号"/>
          </a-form-item>

          <a-form-item>
            <a-row slor="label">
              <a-col :span="12">密码</a-col>
              <a-col :span="12" align="right"><a @click="">忘记密码？</a></a-col>
            </a-row>
            <a-input-password v-model:value="form.password" size="large" placeholder="请输入密码"/>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" size="large" @click="submit" block>立即登陆</a-button>
          </a-form-item>

          <a-form-item>
            <div align="center">
              <span>没有账号？</span>
              <a @click="$emit('change', 'register')">快速创建</a>
            </div>
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
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

.third-party {
  .ant-col {
    margin-top: 10px;

    .btn {
      height: auto;
      padding: 16px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;

      img {
        width: 25px;
        height: 25px;
        margin-right: 5px;
      }
    }

    .github {
      background-color: #24292e;
    }

    .gitee {
      background-color: #303643;
    }

    .qq {
      background-color: #14baf8;
    }

    .weibo {
      background-color: rgba(250, 125, 60, .72157);
    }
  }

  .ant-col:nth-child(1) {
    margin-top: 0;
  }

  .ant-col:nth-child(2) {
    margin-top: 0;
  }
}
</style>
