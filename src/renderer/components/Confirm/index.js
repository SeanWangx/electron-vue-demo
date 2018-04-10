/* eslint-disable prefer-promise-reject-errors */
import Vue from 'vue'
import ConfirmComponent from './index.vue'
const Confirm = Vue.extend(ConfirmComponent)

const showConfirm = (props = {}) => {
  const instance = new Confirm({
    propsData: { ...props }
  })
  const $vm = instance.$mount()
  document.querySelector('body').appendChild($vm.$el)
  return new Promise((resolve, reject) => {
    $vm.$on('confirm', () => resolve())
    $vm.$on('cancel', () => reject('取消'))
  })
}
export default showConfirm
