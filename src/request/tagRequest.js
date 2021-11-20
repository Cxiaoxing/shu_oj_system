import { _get, _post, _put, _delete } from './http.js'

export function tagCreateRequest(data) {
    return _post('/problem_tags', data)
}

export function tagDeleteRequest(id) {
    return _delete(`/problem_tags/${id}`)
}

export function tagEditRequest(id, data) {
    return _put(`/problem_tags/${id}`, data)
}

export function tagListRequest() {
    return _get('/problem_tags')
}

export function tagApplyRequest() {
    return _get('/problem_tags/apply')
}