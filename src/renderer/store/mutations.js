import { mutations as M } from '../constant'
import storage from '../utils/storage'

export default {
  [M.SET_ACCESS_KEY] (state, accessKey = '') {
    state.accessKey = accessKey
    storage.set('accessKey', state.storage)
  },
  [M.SET_SECRET_KEY] (state, secretKey = '') {
    state.secretKey = secretKey
    storage.set('secretKey', state.secretKey)
  },
  [M.SET_USER_VALID] (state, userValid = false) {
    state.userValid = userValid
    storage.set('userValid', state.userValid)
  },
  [M.SET_BUCKETS] (state, buckets = []) {
    state.buckets = buckets
    storage.set('buckets', state.buckets)
  },
  [M.SET_ZONE] (state, payload = {}) {
    const { bucket, zone } = payload
    state.buckets = state.buckets.map(item => {
      return {
        ...item,
        zone: item['name'] === bucket ? zone : item['zone']
      }
    })
    storage.set('buckets', state.buckets)
  },
  [M.SET_DOMAINS] (state, payload = {}) {
    const { bucket, domains } = payload
    state.buckets = state.buckets.map(item => {
      return {
        ...item,
        domains: item['name'] === bucket ? domains : item['domains']
      }
    })
    storage.set('buckets', state.buckets)
  },
  [M.SET_RESOURCE_LIST_DATA] (state, resourceListData = []) {
    state.resourceListData = resourceListData
  },
  [M.SET_RESOURCE_LIST_COUNT] (state, resourceListCount = 0) {
    state.resourceListCount = resourceListCount
  }
}
