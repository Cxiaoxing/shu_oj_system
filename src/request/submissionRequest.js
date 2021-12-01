import { _get, _post } from './http.js'

export function submissionCreateRequest(region, inner_id, data){
    return _post(`/regions/${region}/${inner_id}/submission`, data)
}

export function submissionListRequest(params) {
    return _get('/submissions', params)
}

export function submissionInfoRequest(uuid){
    return _get(`/submissions/${uuid}`)
}
