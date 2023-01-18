<script lang="ts" setup>
import { defineProps } from "vue";
import SystemUser from "./system-user.vue"
import SingleChat from "./single-chat.vue"

const props = defineProps({
  currentData: Object,
  newChatData: Object
})
</script>

<template>
  <div class="chat">
    <SystemUser v-if="props.currentData.source_type === 'system_user'" :currentData="props.currentData" />
    <SingleChat v-else-if="props.currentData.source_type === 'user'" :currentData="props.currentData" :newChatData="props.newChatData"  />
    <a-empty v-else />
  </div>
</template>

<style lang="less" scoped>
.chat {
  height: 800px;

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
