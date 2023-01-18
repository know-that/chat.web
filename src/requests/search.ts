import HTTP from '@/utils/axios'

export function getSearchList(params) {
    return HTTP({
        url: '/search',
        method: 'get',
        params: params
    })
}

