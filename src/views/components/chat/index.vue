<script lang="ts" setup>
import SystemUser from "./system-user.vue"
import SingleChat from "./single-chat.vue"

const props = defineProps({
  currentData: Object,
  newChatData: Object,
  isReload: Boolean
})
</script>

<template>
  <div class="chat h-full">
    <SystemUser v-if="props.currentData.source_type === 'system_user' && props.isReload" :currentData="props.currentData" />
    <SingleChat v-else-if="props.currentData.source_type === 'user' && props.isReload" :currentData="props.currentData" :newData="props.newChatData"  />
    <a-empty v-else />
  </div>
</template>

<style lang="less" scoped>
.chat {
  display: flex;
  align-items: center;
  justify-content: center;

  ::v-deep(.ant-layout-header) {

    .header-title {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 600;
      line-height: 1;
      height: 100%;

      .title {
        flex: 10;
      }

      .actions {
        font-weight: bold;
      }
    }
  }
}
</style>
