import { _get, _post, _put, _delete } from './http.js'

export function announceCreateRequest(data) {
    return _post('/announcements', data)
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