import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './theme/index.css'
import axios from 'axios'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import VueCalendarHeatmap from 'vue-calendar-heatmap'
Vue.use(VueCalendarHeatmap)
Vue.use(mavonEditor)

// 配置请求根路径
axios.defaults.baseURL =process.env.NODE_ENV =='production' ? 'http://115.29.177.136:8080' : '/api';
axios.defaults.withCredentials = true;
// 在request 拦截器中，展示进度条 
axios.interceptors.request.use(config => {
  return config
})
// 在response 拦截器中，隐藏进度条 
axios.interceptors.response.use(config => {
  return config
})


Vue.prototype.$axios = axios
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
