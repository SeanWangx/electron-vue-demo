<template>
  <div class="wrapper-container flex-container">
    <div class="login-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="AccessKey" prop="AccessKey">
          <el-input v-model="form.AccessKey" size="small" placeholder="AccessKey" clearable></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="SecretKey">
          <el-input v-model="form.SecretKey" size="small" placeholder="SecretKey" clearable :type="pwdType">
            <template slot="append">
              <el-button type="text" @click="handleToggle">{{ pwdVisible ? '隐藏' : '显示' }}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <div>
          <el-button size="small" type="primary" @click="login">Login</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { ipcRenderer } from 'electron'
// import uuidv1 from 'uuid/v1'
// import { getAccessToken } from '@/utils/tools'
export default {
  name: 'Login',
  data () {
    return {
      form: {
        AccessKey: '',
        SecretKey: ''
      },
      rules: {
        AccessKey: [
          { required: true, message: '请输入AccessKey', trigger: 'change' }
        ],
        SecretKey: [
          { required: true, message: '请输入SecretKey', trigger: 'change' }
        ]
      },
      pwdVisible: false,
      pwdType: 'password'
    }
  },
  methods: {
    handleToggle () {
      this.pwdVisible = !this.pwdVisible
      this.pwdType = this.pwdVisible ? 'text' : 'password'
    },
    login () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // TODO
        } else {
          console.log('error submit!!')
          return false
        }
      })
      /* let uuid = uuidv1()
      let payload = {
        uuid,
        data: 'Login'
      }
      ipcRenderer.once(`LOGIN_SUCCESS_${uuid}`, (event, arg) => {
        console.log(arg)
      })
      ipcRenderer.send('LOGIN', payload) */
      /* if (!!this.AccessKey && !!this.SecretKey) {
        let accessToken = getAccessToken('/buckets', this.AccessKey, this.SecretKey)
        let uuid = uuidv1()
        let payload = {
          uuid,
          data: {
            url: 'https://rs.qbox.me/buckets',
            authorization: `QBox ${accessToken}`
          }
        }
        ipcRenderer.once(`TEST_CHANNEL_SUCCESS_${uuid}`, (event, arg) => {
          console.log('response', arg)
        })
        ipcRenderer.send('TEST_CHANNEL', payload)
      } */
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
