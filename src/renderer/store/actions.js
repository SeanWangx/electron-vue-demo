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
    commit(M.SET_RESOURCE_LIST_DATA, [])
    commit(M.SET_RESOURCE_LIST_COUNT, 0)
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
            zone: '',
            domains: []
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
  },
  /**
   * 删除bucket
   */
  [A.DELETE_BUCKET] ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const { accessKey, secretKey } = state
      if (!!accessKey && !!secretKey) {
        const { bucket } = payload
        let accessToken = getAccessToken(`/drop/${bucket}`, accessKey, secretKey)
        axios.post(`http://rs.qiniu.com/drop/${bucket}`, null, {
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
  },
  /**
   * 获取存储空间中内容
   */
  [A.FETCH_LIST] ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const { accessKey, secretKey } = state
      if (!!accessKey && !!secretKey) {
        const {
          bucket,
          marker = '',
          limit = '10000', // 不分页了
          prefix = '',
          delimiter = ''
        } = payload
        let Marker = marker ? `&marker=${marker}` : ''
        let Limit = limit ? `&limit=${limit}` : ''
        let Prefix = prefix ? `&prefix=${encodeURI(prefix)}` : ''
        let Delimiter = delimiter ? `&delimiter=${encodeURI(delimiter)}` : ''
        if (!!bucket === false) {
          reject(new Error('缺失存储空间名'))
        } else {
          let uri = `/list?bucket=${bucket}${Marker}${Limit}${Prefix}${Delimiter}`
          let accessToken = getAccessToken(uri, accessKey, secretKey)
          axios.get(`http://rsf.qbox.me${uri}`, {
            method: 'get',
            headers: {
              'Authorization': `QBox ${accessToken}`
            }
          }).then(res => {
            const { items = [] } = res
            commit(M.SET_RESOURCE_LIST_DATA, items)
            commit(M.SET_RESOURCE_LIST_COUNT, items.length)
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        }
      } else {
        reject(new Error('缺失秘钥'))
      }
    })
  },
  /**
   * 获取空间域名
   */
  [A.FETCH_BUCKET_DOMAIN] ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const { accessKey, secretKey } = state
      if (!!accessKey && !!secretKey) {
        const { bucket } = payload
        if (!!bucket === false) {
          reject(new Error('缺失存储空间名'))
        } else {
          let uri = `/v6/domain/list?tbl=${bucket}`
          let accessToken = getAccessToken(uri, accessKey, secretKey)
          axios.get(`http://api.qiniu.com${uri}`, {
            method: 'get',
            headers: {
              'Authorization': `QBox ${accessToken}`
            }
          }).then(res => {
            commit(M.SET_DOMAINS, { bucket, domains: res })
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        }
      } else {
        reject(new Error('缺失秘钥'))
      }
    })
  },
  /**
   * 获取存储空间区域zone
   */
  [A.FETCH_BUCKET_ZONE] ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const { accessKey, secretKey } = state
      if (!!accessKey && !!secretKey) {
        const { bucket } = payload
        if (!!bucket === false) {
          reject(new Error('缺失存储空间名'))
        } else {
          let uri = `/v2/query?ak=${accessKey}&bucket=${bucket}`
          let accessToken = getAccessToken(uri, accessKey, secretKey)
          axios.get(`http://uc.qbox.me${uri}`, {
            methods: 'get',
            headers: {
              'Authorization': `QBox ${accessToken}`
            }
          }).then(res => {
            let uploadURL = res['up']['src']['main'][0]
            let zone = ''
            if (uploadURL.indexOf('up-as0') !== -1) {
              zone = 'as0'
            } else if (uploadURL.indexOf('up-na0') !== -1) {
              zone = 'na0'
            } else if (uploadURL.indexOf('up-z2') !== -1) {
              zone = 'z2'
            } else if (uploadURL.indexOf('up-z1') !== -1) {
              zone = 'z1'
            } else {
              zone = 'z0'
            }
            commit(M.SET_ZONE, { bucket, zone })
            resolve(zone)
          }).catch(err => {
            reject(err)
          })
        }
      } else {
        reject(new Error('缺失秘钥'))
      }
    })
  },
  /**
   * 删除指定资源
   */
  [A.DELETE_BUCKET_RESOURCE] ({ commit, state }, payload) {
    return new Promise((resolve, reject) => {
      const { accessKey, secretKey } = state
      if (!!accessKey && !!secretKey) {
        const { bucket, key } = payload
        if (!!bucket && !!key) {
          let entry = `${bucket}:${key}`
          let encodedEntryURI = urlSafeBase64Encode(Buffer.from(entry).toString('base64'))
          let uri = `/delete/${encodedEntryURI}`
          let accessToken = getAccessToken(uri, accessKey, secretKey)
          axios.post(`http://rs.qiniu.com${uri}`, null, {
            method: 'post',
            headers: {
              'Authorization': `QBox ${accessToken}`
            }
          }).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } else {
          reject(new Error('缺失请求资源名'))
        }
      } else {
        reject(new Error('缺失秘钥'))
      }
    })
  }
}
