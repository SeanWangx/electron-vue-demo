import Vue from 'vue'
import ConfirmComponent from './index.vue'
const Confirm = Vue.extend(ConfirmComponent)

const showConfirm = (props = {}) => {
  const instance = new Confirm({
    propsData: { ...props }
  })
  const $vm = instance.$mount()
  document.querySelector('body').appendChild($vm.$el)
}
export default showConfirm
