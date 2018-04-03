import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import AccessCtrl from './plugins/AccessCtrl'
import ElementUI from 'element-ui'
import showConfirm from '@/components/Confirm'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI)
Vue.use(AccessCtrl, store, router)

Vue.http = Vue.prototype.$http = axios
Vue.showConfirm = Vue.prototype.$showConfirm = showConfirm

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
