import axios from 'axios'

export default {
  install: (Vue, store, router) => {
    /* axios.interceptors.request.use(request => {
      store.dispatch('START_LOADING')
      return request
    }, error => {
      store.dispatch('STOP_LOADING')
      return Promise.reject(error)
    }) */
    axios.defaults.validateStatus = status => true
    axios.interceptors.response.use(response => {
      if (response.status !== 200 && response.data.error) {
        Vue.prototype.$message.error(response.data.error)
      }
      return response.status === 200 ? response.data : Promise.reject(response)
    }, error => {
      return Promise.reject(error)
    })

    router.beforeEach((to, from, next) => {
      if (store.getters['userValid'] !== true && to.name !== 'Login') {
        return next({
          path: '/login'
        })
      }
      if (store.getters['userValid'] === true && to.name === 'Login') {
        return next({
          path: '/'
        })
      }
      next()
    })
  }
}
