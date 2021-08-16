import { _get, _post } from './http.js'

export function submissionListRequest(params) {
    return _get('/submissions', params)
}

export function submissionRequest(region, inner_id, data){
    return _post(`/regions/${region}/${inner_id}/submission`, data)
}

export function submissionResultRequest(uuid){
    return _get(`/submissions/${uuid}`)
}