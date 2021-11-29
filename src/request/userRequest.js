import { _post, _get, _put, _delete } from './http.js'

export function userRegisterRequest(data) {
    return _post('/users', data)
}

export function userBatchRegisterRequest(data) {
    return _post('/users/batch_create', data)
}

export function userLoginRequest(data) {
    return _post('/users/login', data)
}

export function userLogoutRequest() {
    return _post('/users/logout')
}

export function userDeleteRequest(id) {
    return _delete(`/users/${id}`)
}

export function userEditRequest(id, data) {
    return _put(`/users/${id}`, data)
}

// 发送邮箱验证码
export function userSendTokenRequest(email) {
    return _get(`/users/reset_password/${email}`)
}

export function userResetPasswordRequest(data) {
    return _post('/users/reset_password', data)
}

export function userListRequest(params) {
    return _get('/users', params)
}

export function userInfoRequest(id) {
    return _get(`/users/${id}`)
}

export function userCheckOnlineRequest() {
    return _get('/users/me')
}

export function userSubmitListRequest(params) {
    return _get('/submissions', params)
}

export function userSubmitNumberInfoRequest(userId) {
    return _get(`/users/${userId}/submissions_time`)
}

export function userSubmitDiffcultyInfoRequest(userId) {
    return _get(`/users/${userId}/submissions_count`)
}
