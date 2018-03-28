import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(ElementUI)
axios.interceptors.response.use(response => {
  return response.status === 200 ? response.data : Promise.reject(response)
}, (error, v) => {
  return Promise.reject(error)
})
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
