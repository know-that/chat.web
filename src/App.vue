<script setup lang="ts">
import Index from './views/index.vue'
import Theme from '@/assets/theme.json'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
</script>

<template>
	<a-config-provider :theme="Theme" :locale="zhCN">
		<main class="w-full min-h-[100vh] flex items-center justify-center">
			<Index />
		</main>
	</a-config-provider>
</template>

<style scoped>
</style>
