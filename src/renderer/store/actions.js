import axios from 'axios'
import { actions as A, mutations as M } from '../constant'
import { getAccessToken } from '../utils/tools'

export default {
  /**
   * 登录并获取bucket列表
   */
  [A.LOGIN] ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      const { accessKey, secretKey } = payload
      dispatch(A.FETCH_BUCKETS, { accessKey, secretKey }).then(res => {
        // console.log(res)
        commit(M.SET_ACCCESS_KEY, accessKey)
        commit(M.SET_SECRET_KEY, secretKey)
        commit(M.SET_USER_VALID, true)
      }).catch(error => {
        console.error(error)
      })
    })
  },
  /**
   * 登出
   */
  [A.LOGOUT] ({ commit }) {
    commit(M.SET_BUCKETS, [])
    commit(M.SET_ACCCESS_KEY, '')
    commit(M.SET_SECRET_KEY, '')
    commit(M.SET_USER_VALID, false)
  },
  /**
   * 获取bucket列表
   */
  [A.FETCH_BUCKETS] ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      let accessKey
      let secretKey
      if (payload['accessKey'] && payload['secretKey']) {
        accessKey = payload['accessKey']
        secretKey = payload['secretKey']
      } else if (state['accessKey'] && state['secretKey']) {
        accessKey = state['accessKey']
        secretKey = state['secretKey']
      } else {
        reject(new Error('Missing keys'))
      }
      let accessToken = getAccessToken('/buckets', accessKey, secretKey)
      axios.get('https://rs.qbox.me/buckets', {
        method: 'get',
        headers: {
          'Authorization': `QBox ${accessToken}`
        }
      }).then(res => {
        // console.log(res)
        commit(M.SET_BUCKETS, res)
        resolve()
      }).catch(error => {
        // console.warn(error)
        reject(error)
      })
    })
  }
}
