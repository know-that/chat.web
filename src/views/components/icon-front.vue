<script lang="ts" setup>
import {ref, shallowRef} from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue';
const MyIcon = createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/c/font_4495000_9zuc6icizwo.js', // 在 iconfont.cn 上生成
});

const props = defineProps({
	type: {
		type: String
	},
	size: {
		type: [Number, String]
	}
})

const style = ref({})
if (props.size) {
	style.value.fontSize = `${props.size}px`
}

const myIconRef = shallowRef()
</script>

<template>
	<MyIcon ref="myIconRef" :type="`icon-${props.type}`" :style="style" />
</template>
