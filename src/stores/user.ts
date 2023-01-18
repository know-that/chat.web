import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
    // 为了完整类型推理，推荐使用箭头函数
    state: () => {
        return {
            user: {}
        }
    },

    actions: {
    },

    getters: {
        user(state) {
            return state.user
        }
    }
})
