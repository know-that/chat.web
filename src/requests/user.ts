import HTTP from '@/utils/axios'

export function friends() {
    return HTTP({
        url: '/user/friends',
        method: 'get'
    })
}

