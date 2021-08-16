import {_post, _get, _put, _delete} from './http.js'

export function userLoginRequest(data) {
    return _post('/users/login', data)
}

export function userLogoutRequest() {
    return _post('/users/logout')
}

export function userEditRequest(id, data) {
    return _put(`/users/${id}`, data)
}

export function userDeleteRequest(id) {
    return _delete(`/users/${id}`)
}

export function userRegisterRequest(data) {
    return _post('/users', data)
}

export function userCheckOnlineRequest() {
    return _get('/users/me')
}

export function userInfoRequest(id) {
    return _get(`/users/${id}`)
}

export function userListRequest(params) {
    return _get('/users', params)
}

export function userSubmitDiffcultyInfoRequest(userId) {
    return _get(`/users/${userId}/submissions_count`)
}

export function userSubmitNumberInfoRequest(userId) {
    return _get(`/users/${userId}/submissions_time`)
}

export function userSubmitListRequest(params) {
    return _get('/submissions', params)
}