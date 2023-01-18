import HTTP from '@/utils/axios'

export function addFriendRequest(params) {
    return HTTP({
        url: '/friend-request',
        method: 'post',
        data: params
    })
}

