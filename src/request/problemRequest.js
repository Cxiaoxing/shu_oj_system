import { _get, _post, _put, _delete } from './http.js'

export function problemCreateRequest(data) {
    return _post('/problems', data)
}

export function problemDeleteRequest(problem_id) {
    return _delete(`/problems/${problem_id}`)
}

export function problemEditRequest(problem_id, data) {
    return _put(`/problems/${problem_id}`, data)
}

export function problemStatusChangeRequest(problem_id, data) {
    return _post(`/problems/${problem_id}/change_release_state`, data)
}

export function problemTitleRequest(problem_id){
    // todo: 改接口
    return _get(`problems/${problem_id}/title`)
}

export function problemSingleTestCaseInfoRequest(region, problem_id, test_case_id, isInput) {
    return _get(`/regions/${region}/${problem_id}/test_case/${test_case_id}?input=${isInput}`)
}

// 内部接口
export function problemListPrivateRequest(params) {
    return _get('/problems', params)
}

export function problemInfoPrivateRequest(problem_id) {
    return _get(`/problems/${problem_id}`)
}

// 域
export function ProblemAddFromRegionRequest(region, data) {
    return _post(`/regions/${region}`, data)
}

export function problemDeleteFromRegionRequest(region, problem_id) {
    return _delete(`/regions/${region}/${problem_id}`)
}

export function problemListFromRegionRequest(region, params) {
    return _get(`/regions/${region}`, params)
}

export function problemInfoFromRegionRequest(region, inner_id) {
    return _get(`/regions/${region}/${inner_id}`)
}
