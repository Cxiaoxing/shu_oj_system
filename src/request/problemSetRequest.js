import { _get, _post, _put, _delete } from './http.js'

export function problemSetCreateRequest(data) {
    return _post('/problem_sets', data)
}

export function problemSetListRequest(params) {
    return _get('problem_sets', params)
}

export function problemSetEditRequest(region, data) {
    return _put(`/problem_sets/${region}`, data)
}

export function problemSetDeleteRequest(region) {
    return _delete(`/problem_sets/${region}`)
}
