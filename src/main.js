import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js' //UI按需引入，且设置主题色
import mavonEditor from 'mavon-editor' //markdown显示
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
