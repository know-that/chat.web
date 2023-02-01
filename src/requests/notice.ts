import HTTP from '@/utils/axios'

export function getNoticeList(params) {
    return HTTP({
        url: '/chat-notices',
        method: 'get',
        params: params
    })
}

export function getNoticeInfo(id)
{
    return HTTP({
        url: `/chat-notices/${id}`,
        method: 'get'
    })
}

