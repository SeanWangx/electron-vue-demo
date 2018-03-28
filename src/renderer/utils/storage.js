export default {
  set (key, value) {
    if (!!key && !!value) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  },
  get (key, defaultValue = '') {
    if (!!key === true) {
      let _v = window.localStorage.getItem(key)
      return _v ? JSON.stringify(_v) : defaultValue
    }
  }
}
