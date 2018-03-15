<template>
  <div class="wrapper-container flex-container">
    <div class="login-container">
        <el-button v-show="userValid === false" type="primary" @click="login">Login</el-button>
        <el-button v-show="userValid === true" type="default" @click="logout">Logout</el-button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import uuidv1 from 'uuid/v1'
export default {
  name: 'Login',
  data () {
    return {
      userValid: false
    }
  },
  methods: {
    login () {
      let uuid = uuidv1()
      let payload = {
        uuid,
        data: 'Login'
      }
      ipcRenderer.once(`LOGIN_SUCCESS_${uuid}`, (event, arg) => {
        console.log(arg)
        this.userValid = true
      })
      ipcRenderer.send('LOGIN', payload)
    },
    logout () {
      let uuid = uuidv1()
      let payload = {
        uuid,
        data: 'Logout'
      }
      ipcRenderer.once(`LOGOUT_SUCCESS_${uuid}`, (event, arg) => {
        console.log(arg)
        this.userValid = false
      })
      ipcRenderer.send('LOGOUT', payload)
    }
  }
}
</script>

<style scoped>
.login-container {
    display: block;
    width: 100%;
    height: auto;
    margin: 0;
    padding: 0 20px;
    box-sizing: border-box;
    text-align: center;
}
</style>
