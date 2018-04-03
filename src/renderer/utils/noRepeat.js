/**
 * 防止重复请求
 * @param {*} args
 *  |- fn 方法
 *  |- context 上下文
 */
const noRepeat = (...args) => {
  let fn = args.shift()
  let context = args.shift()
  let $el = context.$el
  if ($el.getAttribute('request-status') === 'pending') {
    return
  }
  let returnValue = fn.call(context, ...args)
  if (
    Object.prototype.toString.call(returnValue) === '[object Promise]'
  ) {
    $el.setAttribute('request-status', 'pending')
    return returnValue.then(() => {
      $el.setAttribute('request-status', '')
    })
  } else {
    throw new Error('Wrapped action should return a promise object')
  }
}

export default noRepeat
