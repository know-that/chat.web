import HTTP from '@/utils/axios'

export function addFriendRequest(params: any = {}) {
    return HTTP({
        url: '/friend-request',
        method: 'post',
        data: params
    })
}

export function getFriendRequest(params: any = {}) {
    return HTTP({
        url: '/friend-request',
        method: 'get',
        data: params
    })
}

export function examineFriendRequest(id: any, params: any = {}) {
    return HTTP({
        url: `/friend-request/${id}/examine`,
        method: 'put',
        data: params
    })
}

export function getFriends(params: any = {}) {
    return HTTP({
        url: `/friends`,
        method: 'get',
        params
    })
}

export function updateAliasRequest(params: any = {}) {
    return HTTP({
        url: `/friends/${params.id}/alias`,
        method: 'put',
        data: params
    })
}
