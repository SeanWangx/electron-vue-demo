import CryptoJs from 'crypto-js'
const urlSafeBase64Encode = v => {
  return v.toString(CryptoJs.enc.Base64).replace(/\//g, '_').replace(/\+/g, '-')
}

export const getAccessToken = (url, accessKey, secretKey) => {
  let signingStr = url + '\n'
  let sign = CryptoJs.HmacSHA1(signingStr, secretKey)
  let encodedSign = urlSafeBase64Encode(sign)
  let accessToken = `${accessKey}:${encodedSign}`
  return accessToken
}
