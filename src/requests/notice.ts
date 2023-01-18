import HTTP from '@/utils/axios'

export function getNoticeList(params) {
    return HTTP({
        url: '/notices',
        method: 'get',
        params: params
    })
}

export function getNoticeInfo(id)
{
    return HTTP({
        url: `/notices/${id}`,
        method: 'get'
    })
}

