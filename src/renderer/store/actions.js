import axios from 'axios'
import { actions as A, mutations as M } from '../constant'
import { getAccessToken, urlSafeBase64Encode } from '../utils/tools'

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
        resolve()
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
  [A.FETCH_BUCKETS] ({ commit, state }, payload = {}) {
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
      axios.get('http://rs.qbox.me/buckets', {
        method: 'get',
        headers: {
          'Authorization': `QBox ${accessToken}`
        }
      }).then(res => {
        // console.log(res)
        commit(M.SET_BUCKETS, res.map(item => {
          return {
            name: item,
            zone: null
          }
        }))
        resolve()
      }).catch(err => {
        // console.warn(err)
        reject(err)
      })
    })
  },
  /**
   * 创建bucket
   */
  [A.CREATE_BUCKET] ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const { accessKey, secretKey } = state
      if (!!accessKey && !!secretKey) {
        const { bucket, region } = payload
        let encodedBucketName = urlSafeBase64Encode(Buffer.from(bucket).toString('base64'))
        let accessToken = getAccessToken(`/mkbucketv2/${encodedBucketName}/region/${region}`, accessKey, secretKey)
        axios.post(`http://rs.qiniu.com/mkbucketv2/${encodedBucketName}/region/${region}`, null, {
          method: 'post',
          headers: {
            'Authorization': `QBox ${accessToken}`
          }
        }).then(res => {
          resolve()
        }).catch(err => {
          reject(err)
        })
      } else {
        reject(new Error('缺失秘钥'))
      }
    })
  }
}
