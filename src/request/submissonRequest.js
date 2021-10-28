import { _get, _post } from './http.js'

export function submissionListRequest(params) {
    return _get('/submissions', params)
}

export function submissionRequest(region, inner_id, data){
    return _post(`/regions/${region}/${inner_id}/submission`, data)
}

export function submissionLimitedResultRequest(uuid){
    // todo: 改接口
    return _get(`/submissions/${uuid}`)
}

export function submissionResultRequest(uuid){
    return _get(`/submissions/${uuid}`)
}