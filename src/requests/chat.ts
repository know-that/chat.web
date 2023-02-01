import HTTP from '@/utils/axios'

export function getChatList(params) {
    return HTTP({
        url: '/chat-single',
        method: 'get',
        params: params
    })
}

export function sendMessage(params) {
    return HTTP({
        url: '/chat-single',
        method: 'post',
        data: params
    })
}

export function getChatSessionList(params) {
    return HTTP({
        url: '/chat-sessions',
        method: 'get',
        data: params
    })
}

