import { _get, _post, _put, _delete } from './http.js'

export function contestCreateRequest(data) {
    return _post('/contests', data)
}

export function contestDeleteRequest(region) {
    return _delete(`/contests/${region}`)
}

export function contestEditRequest(region, data) {
    return _put(`/contests/${region}`, data)
}

export function contestListRequest(params) {
    return _get('/contests', params)
}

export function contestInfoRequest(region) {
    return _get(`/contests/${region}`)
}

export function contestRankRequest(region) {
    return _get(`/contests/${region}/rank_acm`)
}

export function contestRegisterRequest(region, data = {}) {
    return _post(`/contests/${region}/register`, data)
}

export function contestProblemListRequest(region, params) {
    return _get(`/regions/${region}`, params)
}

// 小组赛
export function contestAddLinkGroupRequest(region, data) {
    return _post(`/contests/${region}`, data)
}

export function contestDeleteLinkGroupRequest(region, group_id) {
    return _delete(`/contests/${region}/${group_id}`)
}

export function contestLinkGroupListRequest(region) {
    return _get(`/contests/${region}/groups`)
}
