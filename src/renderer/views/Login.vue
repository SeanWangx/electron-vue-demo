<template>
  <div class="wrapper-container flex-container">
    <div class="login-container">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="AccessKey" prop="AccessKey">
          <el-input v-model="form.AccessKey" size="small" placeholder="AccessKey" clearable></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="SecretKey">
          <el-input v-model="form.SecretKey" size="small" placeholder="SecretKey" clearable :type="type">
            <template slot="append">
              <el-button type="text" @click="visible = !visible">{{ visible ? '隐藏' : '显示' }}</el-button>
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
import { getAccessToken } from '@/utils/tools'
export default {
  name: 'Login',
  data () {
    return {
      visible: false,
      type: 'password',
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
      }
    }
  },
  methods: {
    _login () {
      let accessToken = getAccessToken('/buckets', this.form.AccessKey, this.form.SecretKey)
      this.$http.get('https://rs.qbox.me/buckets', {
        method: 'get',
        headers: {
          'Authorization': `QBox ${accessToken}`
        }
      }).then(res => {
        // todo
      }).catch(error => {
        console.warn(error)
      })
    },
    login () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this._login()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  watch: {
    visible (newVal) {
      this.type = newVal ? 'text' : 'password'
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
