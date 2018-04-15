<template>
  <el-main class="content-container flex-container" v-loading="loading">

    <div v-if="bucket !== ''" class="has-bucket">
      <div style="margin-bottom: 10px;position: relative;height: 32px;">
        <el-button size="small" @click="() => $emit('change', { view: 'VUpload' })">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button size="small" @click="() => fetchList()">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
        <span style="margin: 0 0 0 10px;font-size: 12px;">共 {{ resourceListCount }} 个文件</span>
        <span style="margin: 0 0 0 10px;font-size: 12px;">共{{ resourceListFSize }}存储量</span>
        <el-input clearable size="small"
          v-model="prefix"
          prefix-icon="el-icon-search"
          style="width: 200px;position: absolute;right: 0;"
          placeholder="请输入文件前缀搜索"
          @change="v => fetchList(v)"></el-input>
      </div>
      <div style="margin-bottom: 10px;position: relative;height: 32px;">
        <span style="font-size: 14px;">外链默认域名</span>
        <el-select size="small" v-model="domain" style="width: 230px;vertical-align: top;margin: 0 10px;">
          <el-option v-for="(item, index) in domains" :key="index"
            :label="item" :value="item">{{ item }}</el-option>
        </el-select>
        <el-button class="btn-copy" size="small" @click="() => {}">保存默认域名</el-button>
      </div>
      <div class="table-container">
        <el-table
          size="small"
          max-height="622"
          style="100%;"
          :header-cell-style="{'background': '#f5f7fa'}"
          :data="resourceListData">
          <el-table-column
            sortable
            prop="key"
            label="文件名"></el-table-column>
          <el-table-column
            sortable
            prop="mimeType"
            label="文件类型"></el-table-column>
          <el-table-column
            sortable
            prop="type"
            label="存储类型">
            <template slot-scope="scope">
              <span v-if="scope.row['type'] === 0">标准存储</span>
              <span v-if="scope.row['type'] === 1">低频存储</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="fsize"
            label="文件大小">
            <template slot-scope="scope">
              <span>{{  scope.row['fsize'] |fsizeConvert }}</span>
            </template>
          </el-table-column>
          <el-table-column
            sortable
            prop="putTime"
            label="最近更新时间">
            <template slot-scope="scope">
              <span>{{ parseInt(scope.row['putTime'] / 10000) | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作">
            <template slot-scope="scope">
              <el-popover
                placement="left"
                width="300"
                trigger="click">
                <el-button slot="reference" type="text" size="small" icon="el-icon-view" @click="() => previewImg(scope.row)"></el-button>
                <div class="file-container">
                  <div class="file-title">{{ previewInfo['key'] }}</div>
                  <div class="file-preview">
                    <img :src="previewInfo['src']">
                    <i v-show="previewInfo['src'] === ''" class="el-icon-loading"></i>
                  </div>
                  <div class="file-info">
                    <p>
                      <span class="info-title">文件大小:</span>
                      <span class="info-text">{{ previewInfo['fsize'] | fsizeConvert }}</span>
                    </p>
                    <p>
                      <span class="info-title">最后更新:</span>
                      <span class="info-text">{{ parseInt(previewInfo['putTime'] / 10000) | dateFormat }}</span>
                    </p>
                    <p>
                      <span class="info-title">外链地址:</span>
                      <span class="info-text">
                        <a @click="() => toFileLink(previewInfo['key'])">{{ `http://${domain}/${previewInfo['key']}` }}</a>
                      </span>
                    </p>
                  </div>
                  <div class="file-operator">
                    <el-button size="mini" @click="() => downloadFile(scope.row['key'])" round>下载文件</el-button>
                    <el-button size="mini" @click="() => copyLink(scope.row['key'])" round>复制外链</el-button>
                  </div>
                </div>
              </el-popover>

              <el-dropdown trigger="click" @command="handleCommand">
                <el-button type="text" size="small" icon="el-icon-more"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 'download', key: scope.row['key']}">下载文件</el-dropdown-item>
                  <el-dropdown-item :command="{type: 'move', key: scope.row['key']}">移动文件</el-dropdown-item>
                  <el-dropdown-item :command="{type: 'delete', key: scope.row['key']}">删除文件</el-dropdown-item>
                  <el-dropdown-item :command="{type: 'copy', key: scope.row['key']}">复制外链</el-dropdown-item>
                  <el-dropdown-item :command="{type: 'ctype', key: scope.row['key'], ctype: scope.row['type']}">{{ `转${scope.row['type'] === 0 ? '低频' : '标准'}存储` }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <v-move-resource
          :visible="moveResourceVisible"
          :config="moveResourceConfig"
          @close="moveResourceVisible = false"
          @success="moveBucketResource"></v-move-resource>
      </div>
    </div>
    <div v-if="bucket === ''" class="no-bucket">
      <span>请选择或者<el-button style="margin: 0 4px;" type="primary" size="mini" @click="$emit('create')">新建</el-button>存储空间</span>
    </div>
  </el-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { objectEmptyFilter, sizeCalculation } from '@/utils/tools'
import { clipboard, shell, ipcRenderer } from 'electron'
import VMoveResource from './components/MoveResource'

const { dialog } = require('electron').remote

export default {
  props: {
    bucket: {
      type: String,
      required: true
    },
    refresh: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      prefix: '',
      domain: '',
      downloadPath: '',
      moveResourceVisible: false,
      moveResourceConfig: {},
      previewInfo: {}
    }
  },
  computed: {
    ...mapGetters({
      buckets: 'buckets',
      resourceListData: 'resourceListData',
      resourceListCount: 'resourceListCount'
    }),
    resourceListFSize () {
      let fsize = this.resourceListData.reduce((acc, cur) => acc + (cur['fsize'] || 0), 0)
      let fsizeObj = sizeCalculation(fsize)
      return ` ${fsizeObj.size} ${fsizeObj.unit}`
    },
    bucketSelected () {
      return this.buckets.filter(item => item['name'] === this.bucket)[0] || {}
    },
    zone () {
      return this.bucketSelected['zone'] || ''
    },
    domains () {
      return this.bucketSelected['domains'] || []
    }
  },
  mounted () {
    ipcRenderer.on('DOWNLOAD_FILE_REPLY', (evt, res) => {
      const { fn = 'error', message = '——' } = res || {}
      this.$message[fn]({
        message: `下载${fn === 'success' ? '成功' : '失败'}【${message}】！`,
        center: true,
        duration: 5000
      })
    })
    this.$nextTick(() => {
      if (!!this.bucket === true) {
        this.domain = this.domains[0] || ''
      }
    })
  },
  activated () {
    if (this.refresh) {
      this.fetchList(this.prefix)
    }
  },
  methods: {
    ...mapActions({
      _fetchList: 'FETCH_LIST',
      _deleteBucketResource: 'DELETE_BUCKET_RESOURCE',
      _moveBucketResource: 'MOVE_BUCKET_RESOURCE',
      _changeFileType: 'CHANGE_FILE_TYPE'
    }),
    async fetchList (prefix = '') {
      try {
        this.prefix = prefix
        await this._fetchList(objectEmptyFilter({ bucket: this.bucket, prefix: this.prefix }))
      } catch (e) {
        console.warn(e)
      }
    },
    async deleteBucketResource (key) {
      try {
        await this.$showConfirm({
          title: '提示',
          content: `是否确认删除: ${key} ?`
        })
        await this._deleteBucketResource({
          key,
          bucket: this.bucket
        })
        await this.fetchList(this.prefix)
        this.$message.success({
          message: `删除资源【${key}】成功！`,
          center: true
        })
      } catch (e) {
        console.warn(e)
      }
    },
    async moveBucketResource (payload) {
      try {
        const { bucketSrc, bucketDest, keySrc, keyDest } = payload
        await this._moveBucketResource({ bucketSrc, bucketDest, keySrc, keyDest })
        await this.fetchList(this.prefix)
        this.$message.success({
          message: '资源文件移动成功！',
          center: true
        })
      } catch (e) {
        console.warn(e)
      }
    },
    async changeFileType (payload) {
      try {
        const { key, type = 0 } = payload
        await this.$showConfirm({
          title: '提示',
          content: `是否将【${key}】 转为${type === 0 ? '低频' : '标准'}存储？`
        })
        await this._changeFileType({
          key,
          bucket: this.bucket,
          type: 0 - type + 1
        })
        await this.fetchList(this.prefix)
        this.$message.success({
          message: '修改存储方式成功！',
          center: true
        })
      } catch (e) {
        console.warn(e)
      }
    },
    downloadFile (key) {
      let filePath = dialog.showSaveDialog({
        defaultPath: key
      })
      let fileURI = `http://${this.domain}/${key}`
      if (filePath) {
        ipcRenderer.send('DOWNLOAD_FILE', { filePath, fileURI })
      } else {
        this.$message.error({
          message: '信息缺失，无法下载！',
          center: true
        })
      }
    },
    copyLink (key) {
      clipboard.writeText(`http://${this.domain}/${key}`)
      this.$message.success({
        message: '复制外链成功！',
        center: true
      })
    },
    openMoveDialog (key) {
      if (!!key === true) {
        this.moveResourceConfig = {
          keySrc: key,
          bucketSrc: this.bucket
        }
        this.moveResourceVisible = true
      }
    },
    handleCommand (command) {
      if (command['type'] === 'download') {
        // 下载文件
        this.downloadFile(command['key'])
      } else if (command['type'] === 'copy') {
        // 复制外链
        this.copyLink(command['key'])
      } else if (command['type'] === 'delete') {
        // 删除文件
        this.deleteBucketResource(command['key'])
      } else if (command['type'] === 'move') {
        // 文件移动
        this.openMoveDialog(command['key'])
      } else if (command['type'] === 'ctype') {
        // 转换存储格式
        this.changeFileType({
          key: command['key'],
          type: command['ctype']
        })
      }
    },
    toFileLink (key) {
      shell.openExternal(`http://${this.domain}/${key}`)
    },
    previewImg (fileInfo) {
      this.previewInfo = { ...fileInfo, src: '' }
      let url = /\.(jpe?g|gif|png|svg|ico)$/i.test(this.previewInfo['key'].toLowerCase()) ? `http://${this.domain}/${this.previewInfo['key']}` : '/static/no-prev.png'
      const img = new Image()
      img.src = url
      img.onload = () => {
        this.previewInfo.src = url
      }
    }
  },
  watch: {
    bucket (newVal) {
      this.domain = this.domains[0]
    }
  },
  filters: {
    fsizeConvert (val) {
      let fsizeObj = sizeCalculation(val)
      return `${fsizeObj.size} ${fsizeObj.unit}`
    },
    dateFormat (val) {
      if (!!val === false) {
        return ''
      } else {
        let _dt = new Date(val)
        let year = _dt.getFullYear()
        let month = _dt.getMonth() + 1
        let day = _dt.getDate()
        let hour = _dt.getHours()
        let min = _dt.getMinutes()
        let sec = _dt.getSeconds()
        return `${year}-${month}-${day} ${hour}:${min}:${sec}`
      }
    }
  },
  components: {
    VMoveResource
  }
}
</script>

<style scoped>
.content-container {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 0;
}
.has-bucket {
    flex: 1;
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
}
.no-bucket {
    flex: 1;
    text-align: center;
    font-size: 14px;
}
.table-container {
    display: block;
    width: 100%;
    height: calc(100% - 84px);
    position: relative;
    margin: 0;
    padding: 0;
}
.file-container {
    display: block;
    width: 100%;
    height: auto;
    position: relative;
    margin: 0;
    padding: 0;
    text-align: center;
    font-size: 14px;
}
.file-title {
    font-size: 16px;
    text-align: center;
}
.file-preview {
    display: block;
    width: 270px;
    height: 270px;
    margin: 20px auto;
    padding: 0;
    position: relative;
    line-height: 270px;
}
.file-preview i {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 28px;
    padding: 121px;
}
.file-preview img {
    display: inline-block;
    vertical-align: middle;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin: 0;
    padding: 0;
}
.file-info {
    display: block;
    width: 260px;
    height: auto;
    margin: 20px auto;
    padding: 0;
    position: relative;
    color: #7a8599;
    text-align: left;
    font-size: 0;
}
.file-info p {
  margin: 0 0 10px 0;
}
.file-info span {
    display: inline-block;
    word-wrap: break-word;
    font-size: 14px;
}
span.info-title {
    width: 80px;
}
span.info-text {
    width: calc(100% - 80px);
    vertical-align: top;
}
span.info-text a, a:active, a:hover {
    cursor: pointer;
    color: #409EFF;
    text-decoration: none;
}
.file-operator {
    display: block;
    width: 260px;
    height: auto;
    margin: 20px auto;
    padding: 0;
    position: relative;
    text-align: center;
    font-size: 0;
}
</style>
