<script lang="ts" setup>
import { getFriends } from "@/requests/friend"
import { ref } from 'vue'
import {ManOutlined, WomanOutlined} from "@ant-design/icons-vue"
import moment from 'moment'

const friendsParams = ref({
	page: 1,
	page_size: 24
})
const friends = ref({} as any)
const getFriendsData = async () => {
	const data = await getFriends(friendsParams.value)
	console.log(data.data)
	friends.value = data.data
}
getFriendsData()

const createdAtFromText = (createdAt: any) => {
	createdAt = moment(createdAt).fromNow()
	createdAt = `<span class="text-[#00c1de]">${createdAt}</span>`
	const createdAtTemplates = [
		`相遇于${createdAt}，那天彼此肯定很幸运`,
		`${createdAt}，两位英雄不期而遇`,
		`${createdAt}，两个不同的生命体首次交汇`,
		`志同道合的两位在${createdAt}创建了有趣的故事`
	];
	const randomIndex = Math.floor(Math.random() * createdAtTemplates.length);
	return createdAtTemplates[randomIndex]
}
</script>

<template>
	<div class="w-full h-full p-2 flex flex-col">
		<div class="p-2 text-2xl">
			通讯录 <span class="text-base text-gray-400">每一次相遇，都是一段精彩的故事</span>
		</div>
		
		<a-row class="flex-1 overflow-y-auto">
			<a-col v-for="(item, index) in friends.data" :key="index" :span="4" class="p-2">
				<a-card hoverable>
					<template #cover>
						<div class="relative pt-[100%] overflow-hidden rounded-t-[4px]">
							<div class="absolute inset-0 flex justify-center items-center">
								<img :src="item.user.avatar" />
							</div>
						</div>
					</template>
					<a-card-meta class="p-2">
						<template #title>
							{{ item.user.nickname }}
							<ManOutlined v-if="item.user.gender === 1" />
							<WomanOutlined v-else />
						</template>
						
						<template #description>
							<span v-html="createdAtFromText(item.created_at)"></span>
						</template>
					</a-card-meta>
				</a-card>
			</a-col>
		</a-row>
		
	</div>
</template>

<style lang="less" scoped>
:deep(.ant-card-body) {
	padding: unset;
}
</style>