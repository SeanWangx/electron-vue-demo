<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header style="background: #e5e9f2;height: 48px;">
        <div style="text-align: center;line-height: 48px;position: relative;">
          <span>QN</span>
          <span class="logout-btn" v-if="userValid === true"><i class="el-icon-setting"></i></span>
        </div>
      </el-header>
      <el-main style="height: 100%;">
        <router-view></router-view>
      </el-main>
    </el-container>
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
  beforeMount () {
    console.log('beforeMount')
    if (this.userValid) {
      this.setClientValid(this.userValid)
    }
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
.logout-btn {
    display: inline-block;
    position: absolute;
    right: 0;
    cursor: pointer;
    font-size: 18px;
}
</style>
