import axios from 'axios'
axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
    return config
  })

export function getAuth() {
    console.log(1111111)
    axios.get('http://115.29.177.136:8080/users/me')
    .then((res)=>{
        console.log(res);   //  处理成功的函数 相当于success
        return 100
    })
    .catch((error)=>{
        console.log(error)  //  错误处理 相当于error
        return 200
    })
    
}