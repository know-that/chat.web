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

const switchVisible = async () => {
  attr.visible = !attr.visible
}

defineExpose({
	switchVisible
})
</script>

<template>
  <a-popover v-model:open="attr.visible" trigger="click" placement="rightTop">
    <a-avatar :shape="shape" :size="size" :src="src" @click="switchVisible">{{ params.nickname }}</a-avatar>

    <template #title>
      <div style="display: flex;align-items: center">
        <a-avatar :shape="shape" :size="size" :src="src"></a-avatar> &nbsp;
        <div>
          {{ params.nickname }}
          <ManOutlined v-if="params.gender === 1" />
          <WomanOutlined v-else />
        </div>
      </div>
    </template>

    <template #extra>
      <close-outlined @click="attr.visible = false" />
    </template>

    <template #content>
      <div class="leading-6">
	      <div>昵称：{{ params.nickname }}</div>
	      <div>账号：{{ params.account }}</div>
      </div>

      <slot name="actions"></slot>
    </template>
  </a-popover>
</template>