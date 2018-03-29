<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'
import uuidv1 from 'uuid/v1'

export default {
  name: 'electron-vue-demo',
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      userValid: 'userValid'
    })
  },
  methods: {
    setClientValid (valid = false) {
      let uuid = uuidv1()
      let payload = {
        uuid,
        data: { valid }
      }
      ipcRenderer.once(`SET_CLIENT_VALID_SUCCESS_${uuid}`, (event, res) => {
        // console.log(res)
      })
      ipcRenderer.send('SET_CLIENT_VALID', payload)
    }
  },
  watch: {
    userValid (newVal) {
      this.setClientValid(!!newVal)
    }
  }
}
</script>

<style scoped>
#app {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
}
</style>
