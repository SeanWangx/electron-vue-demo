<template>
  <el-main style="font-size: 0;height: 100%;position: relative;">
    <div class="upload-title">
      <span>上传文件</span>
      <i class="el-icon-close upload-close" @click="close"></i>
      <!-- <el-button type="text" class="upload-close" size="large" @click="close" icon="el-icon-close"></el-button> -->
    </div>
    <div class="upload-container">
      <el-upload
        ref="upload"
        class="upload-content"
        name="file"
        :data="uploadData"
        :action="uploadURL"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-success="handleSuccess"
        :on-error="handleError">
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">网页不能上传超过 500M 的文件，大文件请<span @click="toTip" class="upload-tip"> 使用工具 </span>上传</div>
      </el-upload>
      <div class="upload-config">
        <div class="upload-config-item">
          <div>选择上传文件存储类型:</div>
          <div>
            <el-radio-group v-model="ctype" size="small">
              <el-radio :label="0" border>标准存储</el-radio>
              <el-radio :label="1" border>低频存储</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="upload-config-item">
          <div>设置路径前缀:</div>
          <div>
            <p>路径前缀可以用来分类文件，例如：</p>
            <p><span style="display: inline-block;height: 22px;color: #fff;background: #8f9bb4;">image/jpg/</span>your-file-name.jpg</p>
          </div>
          <div style="width: 250px;">
            <el-input v-model="prefix" placeholder="不设置默认为空" size="small"></el-input>
          </div>
        </div>
      </div>
    </div>
  </el-main>
</template>

<script>
import { mapGetters } from 'vuex'
import { shell } from 'electron'
import { getUploadToken } from '@/utils/tools'

const ZONE_UPLOAD = {
  'z0': 'up.qiniup.com',
  'z1': 'up-z1.qiniup.com',
  'z2': 'up-z2.qiniup.com',
  'na0': 'up-na0.qiniup.com',
  'as0': 'up-as0.qiniup.com'
}

export default {
  props: {
    bucket: {
      type: String,
      required: true
    },
    zone: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      refresh: false,
      ctype: 0,
      prefix: '',
      uploadData: {}
    }
  },
  computed: {
    ...mapGetters({
      accessKey: 'accessKey',
      secretKey: 'secretKey'
    }),
    uploadURL () {
      return !!this.zone === true ? `http://${ZONE_UPLOAD[this.zone]}` : ''
    }
  },
  deactivated () {
    this.refresh = false
    this.ctype = 0
    this.prefix = ''
    this.uploadData = {}
    this.$refs['upload'].clearFiles()
  },
  methods: {
    close () {
      this.$emit('change', { view: 'VContent', refresh: this.refresh })
    },
    toTip () {
      shell.openExternal('https://developer.qiniu.com/sdk#official-tool')
    },
    beforeUpload (file) {
      if (file.size && (file.size > 1024 * 1024 * 500)) {
        this.$message.error({
          message: '文件大小超出尺寸，上传失败！',
          center: true
        })
        return false
      }
      const mac = {
        accessKey: this.accessKey,
        secretKey: this.secretKey
      }
      const options = {
        scope: `${this.bucket}:${this.prefix + file.name}`,
        fileType: this.ctype
      }
      let uploadToken = getUploadToken(mac, options)
      this.$set(this.uploadData, 'key', this.prefix + file.name)
      this.$set(this.uploadData, 'token', uploadToken)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleSuccess (...args) {
      console.log(args)
      this.refresh = true
      this.$message.success({
        message: '上传文件成功！',
        center: true
      })
    },
    handleError (...args) {
      console.log(args)
      this.$message.error({
        message: '上传文件失败！',
        center: true
      })
    }
  }
}
</script>

<style scoped>
.upload-title {
    flex: 0 0 100%;
    width: 100%;
    height: 22px;
    margin: 0;
    padding: 30px 0;
    font-weight: 400;
    line-height: 22px;
    font-size: 0;
    text-align: center;
    position: relative;
}
.upload-container {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    height: calc(100% - 82px);
    margin: 0;
    padding: 0;
}
.upload-title > span {
    font-size: 16px;
}
.upload-close {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 52px;
    color: #d3d3d3;
    cursor: pointer;
}
.upload-close:hover {
    color: #999;
}
.upload-content {
    flex: 0 0 60%;
    width: 60%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
}
.upload-config {
    flex: 0 0 40%;
    width: 40%;
    height: 100%;
    margin: 0;
    padding: 0 0 0 20px;
    position: relative;
    box-sizing: border-box;
}
.upload-config-item {
    font-size: 14px;
}
.upload-config-item > div {
    margin: 0 0 20px 0;
}
.upload-config-item > div > p {
    margin: 0;
    font-size: 14px;
    color: #666f80;
    height: 22px;
    line-height: 22px;
}
.upload-tip {
    cursor: pointer;
    color: #409EFF;
    font-weight: 800;
}
</style>

<style>
.upload-content .el-upload-list {
    background: #fff !important;
    width: 100%;
    height: calc(100% - 72px);
    margin: 16px 0 0 0;
    padding: 0 10px 10px 10px;
    border: 1px solid #dcdfe5;
    border-radius: 4px;
    box-sizing: border-box;
    overflow-y: auto;
}
</style>
