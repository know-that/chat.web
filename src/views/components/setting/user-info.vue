<script lang="ts" setup>
import { watch, ref } from "vue"
import IconFront from "@/views/components/icon-front.vue"
import { userStore } from "@/stores/user"
import { OSSUpload } from "@/requests/upload"
import {message} from "ant-design-vue";

const userStoreData = userStore()
const visible = ref(false)
const open = () => visible.value = true
const close = () => visible.value = false

const formData = ref({
	account: '',
	avatar: '',
	gender: '',
	nickname: ''
})

const beforeUpload = async (file: any) => {
	const data = await OSSUpload(file)
	formData.value.avatar = data.url
	return false
}


const loading = ref(false)
const submit = async () => {
	loading.value = true
	const data: any = await userStoreData.updateMeData(formData.value)
	message.success(data.message)
	loading.value = false
	close()
}

watch(
	() => userStoreData.$state.userData,
	(value) => {
		formData.value = value
	}
)

defineExpose({
	open,
	close
})
</script>

<template>
	<a-drawer
		title="个人信息"
		placement="left"
		v-model:open="visible"
		:get-container="false"
		:style="{ position: 'absolute' }"
		@close="close()"
	>
		<a-form>
			<a-form-item label="头像">
				<div class="cursor-pointer flex justify-end">
					<a-upload :file-list="[]" :before-upload="beforeUpload">
						<a-avatar :src="formData.avatar" />
					</a-upload>
					<IconFront type="right-outlined" class="text-gray-400" />
				</div>
			</a-form-item>
			<a-form-item label="账号">
				<div class="flex justify-end">
					<span class="text-gray-400">{{ formData.account }}</span>
				</div>
			</a-form-item>
			<a-form-item label="昵称">
				<div class="cursor-pointer flex justify-end">
					<a-input v-model:value="formData.nickname" class="text-right" :bordered="false" />
					<IconFront type="right-outlined" class="text-gray-400" />
				</div>
			</a-form-item>
			
			<a-form-item label="性别">
				<div class="flex justify-end">
					<a-radio-group v-model:value="formData.gender">
						<a-radio :value="1">男</a-radio>
						<a-radio :value="0">女</a-radio>
					</a-radio-group>
				</div>
			</a-form-item>
		</a-form>
		
		<template #extra>
			<div class="text-right">
				<a-button type="primary" @click="submit()" :loading="loading">保存</a-button>
			</div>
		</template>
	</a-drawer>
</template>
