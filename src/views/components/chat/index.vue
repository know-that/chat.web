<script lang="ts" setup>
import { defineProps } from "vue";
import FriendRequest from "./friend-request.vue"
import SingleChat from "./single-chat.vue"

const props = defineProps({
  currentData: Object
})
</script>

<template>
  <div>
    <FriendRequest v-if="props.currentData.source_type === 'friend_request'" :currentData="props.currentData" />
    <SingleChat v-else-if="props.currentData.source_type === 'chat'" />
    <a-empty v-else />
  </div>
</template>
