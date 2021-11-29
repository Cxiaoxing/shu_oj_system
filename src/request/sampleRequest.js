import { _get, _post, _delete } from './http.js'

export function sampleCreateRequest(data){
    return _post(`/samples`, data)
}

export function sampleDeleteRequest(uuid){
    return _delete(`/samples/${uuid}`)
}

export function sampleListRequest(params) {
    return _get('/samples', params)
}

export function sampleInfoRequest(uuid){
    return _get(`/samples/${uuid}`)
}

