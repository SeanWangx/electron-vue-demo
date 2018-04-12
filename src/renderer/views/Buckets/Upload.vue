<template>
  <el-main style="font-size: 0;height: 100%;position: relative;">
    <div class="upload-title">
      <span>上传文件</span>
      <i class="el-icon-close upload-close" @click="close"></i>
      <!-- <el-button type="text" class="upload-close" size="large" @click="close" icon="el-icon-close"></el-button> -->
    </div>
    <div class="upload-container">
      <el-upload
        class="upload-content"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview">
        <el-button size="small" type="primary">选择文件</el-button>
        <div slot="tip" class="el-upload__tip">网页不能上传超过 500M 的文件，大文件请<span @click="toTip" class="upload-tip"> 使用工具 </span>上传</div>
      </el-upload>
      <div class="upload-config">
        <div class="upload-ctype">
          <div>选择上传文件存储类型:</div>
          <div>
            <el-radio-group v-model="ctype" size="small">
              <el-radio label="0" border>标准存储</el-radio>
              <el-radio label="1" border>低频存储</el-radio>
            </el-radio-group>
          </div>
        </div>
        <el-button size="small" @click="refresh = !refresh">{{ refresh }}</el-button> 
      </div>
    </div>
  </el-main>
</template>

<script>
import { shell } from 'electron'
export default {
  data () {
    return {
      refresh: false,
      ctype: '0'
    }
  },
  deactivated () {
    this.refresh = false
  },
  methods: {
    close () {
      this.$emit('change', { view: 'VContent', refresh: this.refresh })
    },
    toTip () {
      shell.openExternal('https://developer.qiniu.com/sdk#official-tool')
    },
    handlePreview (file) {
      console.log(file)
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
.upload-ctype {
    font-size: 14px;
}
.upload-ctype > div {
    margin: 0 0 20px 0;
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
