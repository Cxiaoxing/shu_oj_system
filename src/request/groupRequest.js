import { _post, _get, _put, _delete } from './http.js'

export function groupCreateRequest(data) {
    return _post('/groups', data)
}

export function groupDeleteRequest(id) {
    return _delete(`/groups/${id}`)
}

export function groupEditRequest(id, data) {
    return _put(`/groups/${id}`, data)
}

export function groupListRequest(params) {
    return _get('/groups', params)
}

export function groupInfoRequest(id) {
    return _get(`/groups/${id}`)
}

// 小组成员
export function groupAddUserRequest(id, data) {
    return _post(`/groups/${id}`, data)
}

export function groupDeleteUserRequest(id, user_id){
    return _delete(`/groups/${id}/${user_id}`)
}

export function groupMembersListRequest(id, params) {
    return _get(`/groups/${id}/users`, params)
}
