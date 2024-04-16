import HTTP from '@/utils/axios'

export function login(params: any) {
    return HTTP({
        url: '/auth/login',
        method: 'post',
        data: params
    })
}

export function register(params: any) {
    return HTTP({
        url: '/auth/register',
        method: 'post',
        data: params
    })
}

export function getMe() {
    return HTTP({
        url: '/auth/me',
        method: 'get'
    })
}

export function updateMe(data: any) {
    return HTTP({
        url: '/auth/me',
        method: 'post',
        data
    })
}
