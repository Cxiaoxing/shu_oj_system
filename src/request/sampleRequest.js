import { _get, _post, _delete } from './http.js'

export function sampleListRequest(params) {
    return _get('/samples', params)
}

export function sampleRequest(data){
    return _post(`/samples`, data)
}

export function sampleResultRequest(uuid){
    return _get(`/samples/${uuid}`)
}

export function sampleDeleteRequest(uuid){
    return _delete(`/samples/${uuid}`)
}