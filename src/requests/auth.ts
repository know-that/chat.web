import HTTP from '@/utils/axios'

export function login(params) {
    return HTTP({
        url: '/auth/login',
        method: 'post',
        data: params
    })
}

export function register(params) {
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
