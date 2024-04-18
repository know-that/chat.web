<script lang="ts" setup>
import Bus from "@/utils/bus"
const props = defineProps({
	value: {
		type: String
	},
	id: {
		type: Object as any
	}
})
const nickname = defineModel('value')

Bus.on('avatar.updateAliasDataSuccess', (item: any) => {
	if (item.id === props.id) {
		nickname.value = item.value
	}
})
</script>

<template>
	<span>{{ nickname }}</span>
</template>