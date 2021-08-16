import { _get, _post, _put, _delete } from './http.js'

export function problemCreateRequest(data) {
    return _post('/problems/create', data)
}

export function problemPublicDeleteRequest(region) {
    return _delete(`/problems/${region}`)
}

export function problemPublicInfoRequest(region) {
    return _get(`/problems/${region}`)
}

export function problemPublicListRequest(params) {
    return _get('/problems', params)
}

export function problemPrivateDeleteRequest(region, inner_id) {
    return _delete(`/regions/${region}/${inner_id}`)
}

export function problemPrivateInfoRequest(region, inner_id) {
    return _get(`/regions/${region}/${inner_id}`)
}

export function problemPrivateListRequest(region, params) {
    return _get(`/regions/${region}`, params)
}

export function problemStatusChangeRequest(region, data) {
    return _post(`/problems/${region}/change_release_state`, data)
}

export function problemEditRequest(region, data) {
    return _put(`/problems/${region}`, data)
}

export function ProblemAddRegionRequest(region, data) {
    return _post(`/regions/${region}`, data)
}
