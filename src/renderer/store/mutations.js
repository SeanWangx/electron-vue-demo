import { mutations as M } from '../constant'
import storage from '../utils/storage'

export default {
  [M.SET_ACCCESS_KEY] (state, accessKey = '') {
    state.storage = accessKey
    storage.set('accessKey', accessKey)
  },
  [M.SET_SECRET_KEY] (state, secretKey = '') {
    state.secretKey = secretKey
    storage.set('secretKey', secretKey)
  },
  [M.SET_USER_VALID] (state, userValid = false) {
    state.userValid = userValid
    storage.set('userValid', userValid)
  },
  [M.SET_BUCKETS] (state, buckets = []) {
    state.buckets = buckets
    storage.set('buckets', buckets)
  }
}
