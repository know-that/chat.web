import {defineStore} from 'pinia'
import { getMe, updateMe } from "@/requests/auth";

export const userStore = defineStore('user', {
    // 为了完整类型推理，推荐使用箭头函数
    state: () => ({
        userData: {} as any
    }),

    actions: {
        async getMeData() {
            // 设置用户信息
            this.userData = await getMe().then(data => {
                return data.data
            })

            return this.userData
        },

        async updateMeData(data: any) {
            const result = await updateMe(data)
            await this.getMeData()
            return result
        }
    },

    getters: {
        user(state) {
            return state.userData
        }
    }
})
