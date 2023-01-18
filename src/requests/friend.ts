import HTTP from '@/utils/axios'

export function addFriendRequest(params) {
    return HTTP({
        url: '/friend-request',
        method: 'post',
        data: params
    })
}

export function getFriendRequest(params) {
    return HTTP({
        url: '/friend-request',
        method: 'get',
        data: params
    })
}

export function examineFriendRequest(id, params) {
    return HTTP({
        url: `/friend-request/${id}/examine`,
        method: 'put',
        data: params
    })
}

