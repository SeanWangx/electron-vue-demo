<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header style="background: #B3C0D1;height: 48px;">
        <div style="text-align: center;line-height: 48px;position: relative;">
          <span>QN</span>
          <span class="logout-btn" v-if="userValid === true" @click="logout"><i class="el-icon-setting"></i></span>
        </div>
      </el-header>
      <el-container style="height: 100%;">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    ...mapActions({
      _logout: 'LOGOUT'
    }),
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
    },
    logout () {
      this._logout().then(() => {
        this.$router.replace('/login')
      })
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
    padding: 0 15px;
    position: absolute;
    right: -20px;
    cursor: pointer;
    font-size: 18px;
}
</style>
