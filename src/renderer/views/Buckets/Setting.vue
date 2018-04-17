<template>
  <el-main style="height: 100%">
    <div class="content-item" style="margin-bottom: 20px;">
      <el-button
        @click="() => $emit('back')"
        icon="el-icon-back"
        size="small"
        plain></el-button>
    </div>
    <div class="content-item">
      <h3>秘钥管理</h3>
      <el-form :model="macForm" label-width="80px" label-position="left" style="width: 430px;">
        <el-form-item label="AccessKey" size="mini">
          <el-input :value="macForm.accessKey" disabled></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" size="mini">
          <el-input :value="macForm.secretKey" disabled type="password"></el-input>
        </el-form-item>
        <div>
          <el-button
            @click="logout"
            size="small"
            plain="">登出</el-button>
        </div>
      </el-form>
    </div>
    <div class="content-item">
      <h3>下载设置</h3>
      <el-form :model="pathForm" label-width="80px" label-position="left" style="width: 430px;">
        <el-form-item label="DefaultPath" size="mini">
          <el-input :value="pathForm.downloadPath" disabled></el-input>
        </el-form-item>
        <div>
          <el-button
            @click="toSet"
            size="small"
            plain="">设置</el-button>
          <el-button
            @click="toReset"
            size="small"
            plain="">重置</el-button>
        </div>
      </el-form>
    </div>
  </el-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

const { dialog } = require('electron').remote

export default {
  computed: {
    ...mapGetters({
      accessKey: 'accessKey',
      secretKey: 'secretKey',
      downloadPath: 'downloadPath'
    }),
    macForm () {
      return {
        accessKey: this.accessKey,
        secretKey: this.secretKey
      }
    },
    pathForm () {
      return {
        downloadPath: this.downloadPath
      }
    }
  },
  mounted () {
    ipcRenderer.on('DIR_EXISTS_REPLY', (evt, res) => {
      const { downloadPath = '', exists = false } = res
      if (exists) {
        if (downloadPath !== this.downloadPath) {
          this.changeDownloadPath(downloadPath)
        }
      } else {
        this.$message.warning('实际默认下载路径不存在，已重置！')
        this.changeDownloadPath()
      }
    })
  },
  methods: {
    ...mapActions({
      _logout: 'LOGOUT',
      _changeDownloadPath: 'CHANGE_DOWNLOAD_PATH'
    }),
    async logout () {
      try {
        await this.$showConfirm({
          title: '提示',
          content: '是否确认登出？'
        })
        await this._logout()
      } catch (e) {
        console.warn(e)
      } finally {
        this.$router.replace('/login')
      }
    },
    async changeDownloadPath (downloadPath = '') {
      try {
        await this._changeDownloadPath({ downloadPath: downloadPath || '' })
      } catch (e) {
        console.warn(e)
      }
    },
    toSet () {
      let pathArr = dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
      })
      ipcRenderer.send('DIR_EXISTS', {
        downloadPath: pathArr === undefined ? this.downloadPath : (pathArr[0] || '')
      })
    },
    toReset () {
      this.changeDownloadPath()
    }
  }
}
</script>

<style scoped>
.content-item {
    display: block;
    width: 100%;
    height: auto;
    margin: 0 0 40px 0;
    padding: 0;
    position: relative;
}
</style>
