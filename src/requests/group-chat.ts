import HTTP from '@/utils/axios'

export function createGroupChat(data) {
    return HTTP({
        url: `/group-chat`,
        method: 'post',
        data: data
    })
}
