import HTTP from '@/utils/axios'

export function getChatSingle(params) {
    return HTTP({
        url: '/chat-single',
        method: 'get',
        params: params
    })
}

export function sendMessageChatSingle(params) {
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

export function getChatGroup(params) {
    return HTTP({
        url: '/chat-group',
        method: 'get',
        params: params
    })
}

export function sendMessageChatGroup(params) {
    return HTTP({
        url: '/chat-group',
        method: 'post',
        data: params
    })
}
