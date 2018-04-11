<template>
  <el-main style="font-size: 0;height: 100%;position: relative;">
    <div style="margin-bottom: 10px;position: relative;">
      <el-button size="small">上传<i class="el-icon-upload el-icon--right"></i></el-button>
      <el-button size="small" @click="() => fetchList()">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
      <span style="margin: 0 0 0 10px;font-size: 12px;">共 {{ resourceListCount }} 个文件</span>
      <el-input clearable size="small"
        v-model="prefix"
        prefix-icon="el-icon-search"
        style="width: 200px;position: absolute;right: 0;"
        placeholder="请输入文件前缀搜索"
        @change="v => fetchList(v)"></el-input>
    </div>
    <div style="margin-bottom: 10px;position: relative;">
      <span style="font-size: 14px;">外链默认域名</span>
      <el-select size="small" v-model="domain" style="width: 230px;vertical-align: top;margin: 0 10px;">
        <el-option v-for="(item, index) in domains" :key="index"
          :label="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-button class="btn-copy" size="small" @click="() => {}">保存默认域名</el-button>
    </div>
    <div class="table-container">
      <el-table
        max-height="622"
        style="100%;"
        :header-cell-style="{'background': '#f5f7fa'}"
        :data="resourceListData">
        <el-table-column
          prop="key"
          label="文件名"></el-table-column>
        <el-table-column
          prop="mimeType"
          label="文件类型"></el-table-column>
        <el-table-column
          prop="type"
          label="存储类型">
          <template slot-scope="scope">
            <span v-if="scope.row['type'] === 0">标准存储</span>
            <span v-if="scope.row['type'] === 1">低频存储</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fsize"
          label="文件大小">
          <template slot-scope="scope">
            <span>{{ parseFloat(scope.row['fsize'] / 1024).toFixed(2) }} KB</span>
          </template>
        </el-table-column>
        <el-table-column
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
            <el-button @click="() => {}" type="text" size="small" icon="el-icon-view"></el-button>
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="text" size="small" icon="el-icon-more"></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type: 'download'}">下载</el-dropdown-item>
                <el-dropdown-item :command="{type: 'rename', key: scope.row['key']}">重命名</el-dropdown-item>
                <el-dropdown-item :command="{type: 'move', key: scope.row['key']}">移动</el-dropdown-item>
                <el-dropdown-item :command="{type: 'delete', key: scope.row['key']}">删除</el-dropdown-item>
                <el-dropdown-item :command="{type: 'copy', key: scope.row['key']}">复制外链</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <v-move-resource
      :visible="moveResourceVisible"
      :config="moveResourceConfig"
      @close="moveResourceVisible = false"
      @success="moveBucketResource"></v-move-resource>
  </el-main>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { objectEmptyFilter } from '@/utils/tools'
import { clipboard } from 'electron'
import VMoveResource from './MoveResource'
const { dialog } = require('electron').remote

export default {
  props: {
    bucket: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      prefix: '',
      domain: '',
      downloadPath: '',
      moveResourceVisible: false,
      moveResourceConfig: {}
    }
  },
  computed: {
    ...mapGetters({
      buckets: 'buckets',
      resourceListData: 'resourceListData',
      resourceListCount: 'resourceListCount'
    }),
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
    this.$nextTick(() => {
      if (!!this.bucket === true) {
        this.domain = this.domains[0] || ''
      }
    })
  },
  methods: {
    ...mapActions({
      _fetchList: 'FETCH_LIST',
      _deleteBucketResource: 'DELETE_BUCKET_RESOURCE',
      _moveBucketResource: 'MOVE_BUCKET_RESOURCE'
    }),
    async fetchList (prefix = '') {
      try {
        await this._fetchList(objectEmptyFilter({ bucket: this.bucket, prefix }))
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
        await this.fetchList()
        this.$message.success(`删除资源【${key}】成功！`)
      } catch (e) {
        console.warn(e)
      }
    },
    async moveBucketResource (payload) {
      try {
        const { bucketSrc, bucketDest, keySrc, keyDest, move } = payload
        await this._moveBucketResource({ bucketSrc, bucketDest, keySrc, keyDest })
        await this.fetchList()
        this.$message.success(move ? '资源文件移动成功！' : '资源文件重命名成功！')
      } catch (e) {
        console.warn(e)
      }
    },
    downloadFile () {
      let pathArr = dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
      })
      if (!!pathArr && pathArr[0]) {
        this.downloadPath = pathArr[0]
        console.log(`download path: ${pathArr[0]}`)
      }
    },
    copyLink (key) {
      clipboard.writeText(`http://${this.domain}/${key}`)
      this.$message.success('复制外链成功！')
    },
    openMoveDialog (key, move = false) {
      if (!!key === true) {
        this.moveResourceConfig = {
          move: move,
          keySrc: key,
          bucketSrc: this.bucket
        }
        this.moveResourceVisible = true
      }
    },
    handleCommand (command) {
      if (command['type'] === 'download') {
        // 下载文件
        this.downloadFile()
      } else if (command['type'] === 'copy') {
        // 复制外链
        this.copyLink(command['key'])
      } else if (command['type'] === 'delete') {
        // 删除文件
        this.deleteBucketResource(command['key'])
      } else if (command['type'] === 'rename') {
        // 文件重命名
        this.openMoveDialog(command['key'])
      } else if (command['type'] === 'move') {
        // 文件移动
        this.openMoveDialog(command['key'], true)
      }
    }
  },
  watch: {
    bucket (newVal) {
      this.domain = this.domains[0]
    }
  },
  filters: {
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

</style>
