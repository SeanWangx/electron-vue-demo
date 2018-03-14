<template>
  <div class="wrapper-container">
    <div class="common-format login-container">
      <el-button type="primary" @click="handleClick">Login</el-button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import uuidv1 from 'uuid/v1'
export default {
  name: 'Login',
  methods: {
    handleClick () {
      console.log('Login')
      let uuid = uuidv1()
      let payload = {
        uuid,
        data: 'Hello World!'
      }
      ipcRenderer.once(`TEST_CHANNEL_SUCCESS_${uuid}`, (event, arg) => {
        console.log(arg)
      })
      ipcRenderer.send('TEST_CHANNEL', payload)
    }
  }
}
</script>

<style scoped>
.login-container {
    text-align: center;
}
</style>
