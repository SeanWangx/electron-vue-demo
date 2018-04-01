import Vue from 'vue'
const Confirm = Vue.extend({
  render: h => h(require('./Confirm.vue'))
})
const showConfirm = (props = {}) => {
  const instance = new Confirm({
    propsData: { ...props }
  })
  const $vm = instance.$mount()
  document.querySelector('body').appendChild($vm.$el)
}
export default showConfirm
