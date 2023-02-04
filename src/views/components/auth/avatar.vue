<script lang="ts" setup>
import { CloseOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons-vue'
import { reactive } from "vue";

defineProps({
  params: Object,
  shape: {
    type: String,
    default: 'square'
  },
  size: {
    type: Number,
    default: 48
  },
  src: String
})

const attr = reactive({
  visible: false
})

const showUserInfo = async () => {
  attr.visible = !attr.visible
}

</script>

<template>
  <a-popover :visible="attr.visible" trigger="click" placement="rightTop">
    <a-avatar :shape="shape" :size="size" :src="src" @click="showUserInfo">{{ params.nickname }}</a-avatar>

    <template #title>
      <div style="display: flex;align-items: center">
        <a-avatar :shape="shape" :size="size" :src="src"></a-avatar> &nbsp;
        <div>
          {{ params.nickname }}
          <man-outlined v-if="params.gender === 1" />
          <woman-outlined v-else />
        </div>
      </div>
    </template>

    <template #extra>
      <close-outlined @click="attr.visible = false" />
    </template>

    <template #content>
      <div>昵称：{{ params.nickname }}</div>
      <div>账号：{{ params.account }}</div>

      <slot name="actions"></slot>
    </template>
  </a-popover>
</template>