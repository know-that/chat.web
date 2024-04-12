<script lang="ts" setup>
import IconFront from "@/views/components/icon-front.vue";
import { computed } from "vue";
const props = defineProps({
	direction: {
		type: String,
		default: 'left'
	},
	item: {
		type: Object as any,
		default: {}
	},
})
const directionClass = computed(() => {
	return props.direction === 'left' ? 'justify-start' : 'justify-end'
})
</script>

<template>
	<div :class="`content flex ${directionClass}`">
		<template v-if="props.item.message.type === 'image'">
			<a-image :src="props.item.message.upload.url" class="max-h-[200px] max-w-[200px]"></a-image>
		</template>
		<template v-else-if="props.item.message.type === 'video'">
			<a-card v-show="!item.show" class="w-[260px] p-[12px]">
				<div class="flex">
					<div class="flex items-start">
						<icon-front :type="item.message.upload.suffix" size="40"></icon-front>
					</div>
					<div class="ml-2 border-top text-left">
						<p>{{ item.message.upload.name }}</p>
						<p class="text-[12px] text-gray-400">{{ item.message.upload.size_text }}</p>
					</div>
				</div>
				<div class="text-info -mx-[12px] mt-2 -mb-[12px] p-[2px_12px] border-t flex">
					<view class="flex-1 text-left text-[12px] text-gray-400">.{{ item.message.upload.suffix }} 文件</view>
					<a @click="item.show = true" class="cursor-pointer">
						<PlayCircleOutlined />
						播放
					</a>
				</div>
			</a-card>
			<video v-show="item.show" width="200" height="200" controls>
				<source :src="item.message.upload.url" :type="item.message.upload.mime">
			</video>
		</template>
		<template v-else-if="props.item.message.type === 'file'">
			<a-card v-show="!item.show" class="w-[260px] p-[12px]">
				<div class="flex">
					<div class="flex items-start">
						<icon-front type="unknown" size="40"></icon-front>
					</div>
					<div class="ml-2 border-top text-left">
						<p>{{ item.message.upload.name }}</p>
						<p class="text-[12px] text-gray-400">{{ item.message.upload.size_text }}</p>
					</div>
				</div>
				<div class="text-info -mx-[12px] mt-2 -mb-[12px] p-[2px_12px] border-t flex">
					<view class="flex-1 text-left text-[12px] text-gray-400">.{{ item.message.upload.suffix }} 文件</view>
				</div>
			</a-card>
			<video v-show="item.show" width="200" height="200" controls>
				<source :src="item.message.upload.url" :type="item.message.upload.mime">
			</video>
		</template>
		<span v-else>{{ props.item.message.content }}</span>
	</div>
</template>

<style lang="less" scoped>
.content {
	white-space: pre-line;
	word-break: break-all;
	width: 80%;
	position: relative;
	
	>span {
		display: inline-block;
		position: relative;
		padding: 10px;
		border-radius: 8px;
		overflow: hidden;
		z-index: 1;
	}
	>span:after {
		content: '';
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: e("@{primary-color}");
		z-index: -1;
	}
}
</style>