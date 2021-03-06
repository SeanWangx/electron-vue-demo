import Crypto from 'crypto'

/**
 * 判断未定义
 * @param {*} v
 */
const isUndef = v => {
  return v === undefined || v === null
}

/**
 * 判断泛对象类型
 * @param {*} obj
 */
const isObject = obj => {
  return obj !== null && typeof obj === 'object'
}

/**
 * 判断数组类型
 * @param {*} arr
 */
const isArray = arr => {
  return Array.isArray(arr)
}

/**
 * 判断空对象
 * @param {*} obj
 */
const isEmptyObj = obj => {
  if (!isObject(obj)) {
    return false
  }
  if (isArray(obj)) {
    return obj.length === 0
  } else {
    for (let key in obj) {
      return false
    }
    return true
  }
}

/**
 * 深复制数组
 * @param {*} arr
 */
const deepCopyArr = arr => {
  return arr.map(item => {
    return isArray(item) ? deepCopyArr(item) : (
      isObject(item) ? deepCopyObj(item) : item
    )
  })
}

/**
 * 深复制对象
 * @param {*} obj
 */
export const deepCopyObj = obj => {
  return Object.keys(obj).reduce((newObj, item) => {
    return {
      ...newObj,
      [item]: isArray(obj[item]) ? deepCopyArr(obj[item]) : (
        isObject(obj[item]) ? deepCopyObj(obj[item]) : obj[item]
      )
    }
  }, {})
}

/**
 * 数组去空
 * @param {*} arr
 */
const arrayEmptyFilter = arr => {
  let newArray = []
  arr.map(item => {
    if (isUndef(item) || isEmptyObj(item) || item === '') {
    } else {
      if (isObject(item)) {
        let _obj = isArray(item) ? arrayEmptyFilter(item) : objectEmptyFilter(item)
        if (!isEmptyObj(_obj)) {
          newArray.push(_obj)
        }
      } else {
        newArray.push(item)
      }
    }
  })
  return newArray
}

/**
 * 对象去空
 * @param {*} obj
 */
export const objectEmptyFilter = obj => {
  return Object.keys(obj).reduce((newObj, item) => {
    if (isUndef(obj[item]) || isEmptyObj(obj[item]) || obj[item] === '') {
      return { ...newObj }
    } else {
      if (isObject(obj[item])) {
        let _obj = isArray(obj[item]) ? arrayEmptyFilter(obj[item]) : objectEmptyFilter(obj[item])
        if (!isEmptyObj(_obj)) {
          return { ...newObj, [item]: _obj }
        } else {
          return { ...newObj }
        }
      } else {
        return { ...newObj, [item]: obj[item] }
      }
    }
  }, {})
}

/**
 * 资源大小计算
 * @param {*} size 资源大小
 */
export const sizeCalculation = (size = 0) => {
  const _obj = {
    size,
    unit: 'B'
  }
  if (_obj.size > 1024 * 1024 * 1024) {
    _obj.unit = 'GB'
    _obj.size = _obj.size / (1024 * 1024 * 1024)
  } else if (_obj.size > 1024 * 1024) {
    _obj.unit = 'MB'
    _obj.size = _obj.size / (1024 * 1024)
  } else if (_obj.size > 1024) {
    _obj.unit = 'KB'
    _obj.size = _obj.size / 1024
  }
  return {
    size: parseFloat(_obj.size).toFixed(2),
    unit: _obj.unit
  }
}

/**
 * 安全转换base64
 * @param {*} v 字符串
 */
export const urlSafeBase64Encode = v => {
  return Buffer.from(v).toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
}

/**
 * 获取Authorization
 * @param {*} mac 秘钥
 *          |- accessKey
 *          |- secretKey
 * @param {*} url 地址
 */
export const getAccessToken = (mac, url) => {
  const { accessKey, secretKey } = mac
  let signingStr = url + '\n'
  let sign = Crypto.createHmac('sha1', secretKey).update(signingStr).digest()
  let encodedSign = urlSafeBase64Encode(sign)
  let accessToken = `${accessKey}:${encodedSign}`
  return accessToken
}

/**
 * 获取上传策略
 * @param {*} options 上传策略
 */
const getPutPolicy = (options) => {
  return JSON.stringify({
    deadline: new Date().getTime() + 3600,
    ...options
  })
}

export const getUploadToken = (mac, options) => {
  const { accessKey, secretKey } = mac
  let putPolicy = getPutPolicy(options)
  let encodedPutPolicy = urlSafeBase64Encode(putPolicy)
  let sign = Crypto.createHmac('sha1', secretKey).update(encodedPutPolicy).digest()
  let encodedSign = urlSafeBase64Encode(sign)
  let uploadToken = `${accessKey}:${encodedSign}:${encodedPutPolicy}`
  return uploadToken
}

/**
 * 首字母大写
 * @param {*} str
 */
// const firstUpperCase = str => str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
/**
 * 首字母小写
 * @param {*} str
 */
// const firstLowerCase = str => str.replace(/( |^)[A-Z]/g, (L) => L.toLowerCase())

/**
 * 数组转大写
 * @param {*} arr
 * @param {*} exception
 */
/* const arrayCapitalize = (arr, exception) => {
  return arr.map(item => {
    if (isArray(item)) {
      return arrayCapitalize(item, exception)
    } else if (isObject(item)) {
      return objectCapitalize(item, exception)
    } else {
      return item
    }
  })
} */
/**
 * 对象键首字母大写
 * @param {*} obj
 * @param {*} exception
 */
/* export const objectCapitalize = (obj, exception) => {
  return Object.keys(obj).reduce((newObj, item) => {
    let key = (exception && exception.test(item)) ? item : firstUpperCase(item)
    return {
      ...newObj,
      [key]: isArray(obj[item]) ? arrayCapitalize(obj[item]) : (
        isObject(obj[item]) ? objectCapitalize(obj[item]) : obj[item]
      )
    }
  }, {})
} */
/**
 * 数组转小写
 * @param {*} arr
 * @param {*} exception
 */
/* const arrayUncapitalize = (arr, exception) => {
  return arr.map(item => {
    if (isArray(item)) {
      return arrayUncapitalize(item, exception)
    } else if (isObject(item)) {
      return objectUncapitalize(item, exception)
    } else {
      return item
    }
  })
} */
/**
 * 对象键首字母小写
 * @param {*} obj
 * @param {*} exception
 */
/* export const objectUncapitalize = (obj, exception) => {
  return Object.keys(obj).reduce((newObj, item) => {
    let key = (exception && exception.test(item)) ? item : firstLowerCase(item)
    return {
      ...newObj,
      [key]: isArray(obj[item]) ? arrayUncapitalize(obj[item]) : (
        isObject(obj[item]) ? objectUncapitalize(obj[item]) : obj[item]
      )
    }
  }, {})
} */

/**
 * 请求参数传数组转对象
 * @param {*} arr
 */
/* export const postArr2Obj = arr => {
  return arr.reduce((newObj, item, index) => {
    return {
      ...newObj,
      [index]: item
    }
  }, {})
} */
