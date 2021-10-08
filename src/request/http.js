import axios from 'axios'; // 引入axios
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import { BASE_URL } from '../utils/utils';
// 1. 根据环境配置默认请求地址
if (process.env.NODE_ENV == 'development') { axios.defaults.baseURL = '/api'; }
else if (process.env.NODE_ENV == 'debug') { axios.defaults.baseURL = BASE_URL; }
else if (process.env.NODE_ENV == 'production') { axios.defaults.baseURL = BASE_URL; }
// 2. 设置请求超时
axios.defaults.timeout = 10000
// 3. 自动携带cookie
axios.defaults.withCredentials = true;
// 3. 配置请求拦截
axios.interceptors.request.use(config => { return config }, error => { return Promise.reject(error) })
// 4. 配置响应拦截 
axios.interceptors.response.use(
    response => {
        if (response.status === 200) { return Promise.resolve(response); } else { return Promise.reject(response); }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录。未登录则跳转登录页面，并携带当前页面的路径
                case 401: router.replace({ path: '/login', query: { redirect: router.currentRoute.fullPath } });
                    break;
                // 404请求不存在
                case 404:
                    Toast({ message: '网络请求不存在', duration: 1500, forbidClick: true });
                    break;
                // 其他错误，直接抛出错误提示
                default:
                    Toast({ message: error.response.data.message, duration: 1500, forbidClick: true });
            }
            return Promise.reject(error.response);
        }
    }
)
// 5.封装get方法、post方法、delete方法、put方法
/**
  * get方法，对应get请求
  * @param {String} url [请求的url地址]
  * @param {Object} params [请求时携带的参数]
  */
export function _get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
  * post方法，对应post请求
  * @param {String} url [请求的url地址]
  * @param {Object} data [请求时携带的参数]
  */
export function _post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
  * put方法，对应post请求
  * @param {String} url [请求的url地址]
  * @param {Object} data [请求时携带的参数]
  */
export function _put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/**
  * dalete方法，对应post请求
  * @param {String} url [请求的url地址]
  * @param {Object} data [请求时携带的参数]
  */
export function _delete(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, { params })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
