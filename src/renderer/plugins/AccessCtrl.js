import axios from 'axios'

export default {
  install: (Vue, store, router) => {
    axios.interceptors.request.use(request => {
      // console.log(request)
      return request
    }, error => {
      return Promise.reject(error)
    })
    axios.defaults.validateStatus = status => true
    axios.interceptors.response.use(response => {
      if (response.status !== 200 && response.data.error) {
        Vue.prototype.$message.error({
          message: response.data.error,
          center: true
        })
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
