import { _get, _post, _put, _delete } from './http.js'

// todo, 改api
export function announceCreateRequest(data) {
    return _post('/announcements/create', data)
}

export function announceDeleteRequest(id) {
    return _delete(`/announcements/${id}`)
}

export function announceEditRequest(id, data) {
    return _put(`/announcements/${id}`, data)
}

export function announceListRequest(params) {
    return _get('/announcements', params)
}

export function announceInfoRequest(id) {
    return _get(`/announcements/${id}`)
}