import Crypto from 'crypto'

/**
 * 安全转换base64
 * @param {*} v 字符串
 */
export const urlSafeBase64Encode = v => {
  return v.toString().replace(/\//g, '_').replace(/\+/g, '-')
}

/**
 * 获取Authorization
 * @param {*} url 地址
 * @param {*} accessKey ak
 * @param {*} secretKey sk
 */
export const getAccessToken = (url, accessKey, secretKey) => {
  let signingStr = url + '\n'
  let sign = Crypto.createHmac('sha1', secretKey).update(signingStr).digest('base64')
  let encodedSign = urlSafeBase64Encode(sign)
  let accessToken = `${accessKey}:${encodedSign}`
  return accessToken
}
