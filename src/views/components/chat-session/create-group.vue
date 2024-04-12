<script lang="ts" setup>
import {computed, getCurrentInstance, ref, watch} from "vue";
import { SearchOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons-vue'
import { getFriends } from '@/requests/friend'
import { createGroupChat } from '@/requests/group-chat'
import { debounce } from 'lodash'

const Message = getCurrentInstance()?.appContext.config.globalProperties.$message

const visible = defineModel()

const params = ref({
	page: 1,
	limit: 15
})

const search = ref('')
const friends = ref({
	data: []
})
const getFriendsData = async () => {
	const data = await getFriends(params.value)
	
	if (friends.value.data.length > 0) {
		for (const item of data.data.data) {
			friends.value.data.push(item)
		}
	} else {
		friends.value = data.data
	}
}
getFriendsData()

const handleScroll = debounce(async (event: any) => {
	const { scrollTop, scrollHeight, clientHeight } = event.target;
	const isReachBottom = scrollHeight - (scrollTop + clientHeight) < 100; // 留一点余量
	if (isReachBottom) {
		params.value.page++
		await getFriendsData()
	}
}, 1000)

watch(
	() => search.value,
	debounce((value) => {
		for (const item of friends.value.data) {
			item.hidden = value && item.user.nickname.indexOf(value) >= 0
		}
	}, 300)
)

const form = ref({
	friend_ids: []
});
const createGroupChatData = async () => {
	form.value.friend_ids = friends.value.data.filter(item => item.checked).map(item => item.id)
	await createGroupChat(form.value)
}
</script>

<template>
	<div>
		<a-modal v-model:open="visible" :width="600" title="创建群聊" @ok="createGroupChatData">
			<a-input class="input-search" v-model:value="search" size="large" placeholder="输入昵称、账号查找好友" allowClear>
				<template #prefix>
					<search-outlined />
				</template>
			</a-input>
			
			<a-list class="mt-8 max-h-[300px] overflow-y-auto" item-layout="horizontal" :data-source="friends.data" @scroll="handleScroll">
				<template #renderItem="{ item }">
					<a-list-item v-show="item.hidden !== false || item.checked">
						<a-list-item-meta class="!items-center cursor-pointer" @click="item.checked = !item.checked">
							<template #avatar>
								<a-avatar :size="48" :src="item.user.avatar" />
							</template>
							<template #title>
								<div class="text-[18px]">
									<span>{{ item.user.nickname }}（{{ item.user.account }}）</span>
									<man-outlined v-if="item.user.gender === 1" />
									<woman-outlined v-else />
								</div>
							</template>
						</a-list-item-meta>
						
						<template #actions>
							<a-checkbox v-model:checked="item.checked"></a-checkbox>
						</template>
					</a-list-item>
				</template>
			</a-list>
		</a-modal>
	</div>
</template>

<style lang="less" scoped>
::v-deep(.input-search) {
	border-radius: 100px;
}
::v-deep(.ant-modal-footer) {
	margin-top: 30px;
	text-align: right;
}
</style>