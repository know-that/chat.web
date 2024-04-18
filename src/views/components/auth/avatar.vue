<script lang="ts" setup>
import { CloseOutlined, ManOutlined, WomanOutlined, FormOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { reactive, ref } from "vue";
import { updateAliasRequest } from "@/requests/friend"
import Bus from '@/utils/bus'
import Nickname from "@/views/components/auth/nickname.vue";

const props = defineProps({
  params: Object as any,
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

const showNicknameInput = ref(false)
const formData = ref({
	id: props.params?.friend?.id,
	alias: props.params?.friend?.alias
})

const outsideClick = () => {
	if (showNicknameInput.value) {
		showNicknameInput.value = false
	}
}

const updateAliasData = async () => {
	await updateAliasRequest(formData.value)
	showNicknameInput.value = false
	Bus.emit('avatar.updateAliasDataSuccess', {
		id: props.params.friend.friend_id,
		value: formData.value.alias
	})
}

defineExpose({
	switchVisible
})
</script>

<template>
  <a-popover v-model:open="attr.visible" trigger="click" placement="rightTop">
    <a-avatar :shape="shape" :size="size" :src="src" @click="switchVisible">{{ props.params?.friend?.alias || params.nickname }}</a-avatar>

    <template #title>
      <div style="display: flex;align-items: center">
        <a-avatar :shape="shape" :size="size" :src="src"></a-avatar>
        <div class="flex items-center ml-2">
	        <span><Nickname :value="props.params?.friend?.alias || props.params.nickname" :id="params.id" /></span>
          <ManOutlined v-if="params.gender === 1" />
          <WomanOutlined v-else />
        </div>
      </div>
    </template>

    <template #extra>
      <close-outlined @click="attr.visible = false" />
    </template>

    <template #content>
      <div class="leading-7">
	      <div v-if="props.params?.friend?.id" class="flex items-center">
		      <span>备注：</span>
		      <a-input class="w-auto" v-if="showNicknameInput" v-model:value="formData.alias" autofocus v-click-outside="outsideClick">
			      <template #suffix>
				      <CheckOutlined class="cursor-pointer" @click="updateAliasData" />
			      </template>
		      </a-input>
		      <span v-else class="cursor-pointer" @click="showNicknameInput = true">
			      <span v-if="formData.alias" class="group flex items-center">{{ formData.alias }} <FormOutlined class="ml-2 hidden group-hover:block" /></span>
			      <span v-else class="text-gray-400">点击添加备注</span>
		      </span>
	      </div>
	      <div>昵称：{{ params.nickname  }}</div>
	      <div>账号：{{ params.account }}</div>
      </div>

      <slot name="actions"></slot>
    </template>
  </a-popover>
</template>