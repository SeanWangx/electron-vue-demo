import CryptoJs from 'crypto-js'

/**
 * 安全转换base64
 * @param {*} v 字符串
 */
const urlSafeBase64Encode = v => {
  return v.toString(CryptoJs.enc.Base64).replace(/\//g, '_').replace(/\+/g, '-')
}

/**
 * 获取Authorization
 * @param {*} url 地址
 * @param {*} accessKey ak
 * @param {*} secretKey sk
 */
export const getAccessToken = (url, accessKey, secretKey) => {
  let signingStr = url + '\n'
  let sign = CryptoJs.HmacSHA1(signingStr, secretKey)
  let encodedSign = urlSafeBase64Encode(sign)
  let accessToken = `${accessKey}:${encodedSign}`
  return accessToken
}
