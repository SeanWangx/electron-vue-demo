<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside style="width: 180px;">
      <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="height: calc(100% - 48px);overflow-y: auto">
        <el-menu-item
          class="bucket-item"
          v-for="(item, index) in buckets"
          :key="index"
          :index="index.toString()"
          @click="e => $noRepeat(selectBucket, e, item)">
          <span slot="title">{{ item.name }}</span>
          <el-button @click.stop="() => delBucket(item.name)" type="text" size="small" class="del-bucket" icon="el-icon-circle-close"></el-button>
        </el-menu-item>
      </el-menu>
      <div class="add-bucket">
        <el-button @click="addBucket" style="font-weight: 200;color: #fff;" type="text" icon="el-icon-circle-plus">新增</el-button>
      </div>
      <v-add-bucket
        :visible.sync="addBktVisible"
        @close="addBktVisible = false"
        @success="handleAddSuccess"></v-add-bucket>
    </el-aside>
    <!-- <el-main v-if="bucketSelected" style="font-size: 0;height: 100%;position: relative;">
      <div style="margin-bottom: 10px;position: relative;">
        <el-button size="small">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button size="small" @click="refresh">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
        <span style="margin: 0 0 0 10px;font-size: 12px;">共 {{ resource.length }} 个文件</span>
        <el-input clearable size="small"
          v-model="prefix"
          prefix-icon="el-icon-search"
          style="width: 200px;position: absolute;right: 0;"
          placeholder="请输入文件前缀搜索"
          @change="handlePrefixChange"></el-input>
      </div>
      <div style="margin-bottom: 10px;position: relative;">
        <span style="font-size: 14px;">外链默认域名</span>
        <el-select size="small" v-model="domainDefault" style="width: 230px;vertical-align: top;margin: 0 10px;">
          <el-option v-for="(item, index) in domainOptions" :key="index"
            :label="item" :value="item">{{ item }}</el-option>
        </el-select>
        <el-button class="btn-copy" size="small" @click="() => {}">保存默认域名</el-button>
      </div>
      <div class="table-container">
        <el-table
          max-height="622"
          style="100%;"
          :header-cell-style="{'background': '#f5f7fa'}"
          :data="resource">
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
            label="上传时间">
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
                  <el-dropdown-item :command="{type: '1'}">下载文件</el-dropdown-item>
                  <el-dropdown-item :command="{type: '2'}">复制外链</el-dropdown-item>
                  <el-dropdown-item :command="{type: '3', key: scope.row['key']}">删除文件</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main> -->
    <v-content v-if="bucket"
      :bucket="bucket"
      :domains="domains"
      :zone="zone"></v-content>
    <el-main v-else class="flex-container">
      <div style="flex: 1;text-align: center;">请选择或者<el-button style="margin: 0 4px;" type="primary" size="mini" @click="addBucket">新建</el-button>存储空间</div>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import Clipboard from 'clipboard'
import VAddBucket from './AddBucket'
import VContent from './Content'

export default {
  data () {
    return {
      bucket: '',
      domains: [],
      zone: '',

      addBktVisible: false
    }
  },
  computed: {
    ...mapGetters({
      buckets: 'buckets'
    })
  },
  beforeMount () {
    this.fetchBuckets({}).then(() => {
      this.defaultClick('')
    })
    /* this.clipboard = new Clipboard('.btn-copy')
    this.clipboard.on('success', e => {
      this.$message.success(`复制空间域名成功: ${this.domainDefault} !`)
      e.clearSelection()
    }) */
  },
  methods: {
    ...mapActions({
      fetchBuckets: 'FETCH_BUCKETS',
      createBucket: 'CREATE_BUCKET',
      deleteBucket: 'DELETE_BUCKET',
      fetchList: 'FETCH_LIST',
      fetchBucketDomain: 'FETCH_BUCKET_DOMAIN',
      fetchBucketZone: 'FETCH_BUCKET_ZONE',
      deleteBucketResource: 'DELETE_BUCKET_RESOURCE'
    }),
    defaultClick (bucket) {
      this.$nextTick(() => {
        let _index = this.buckets.reduce((acc, cur, index) => {
          if (acc === null) {
            acc = cur['name'] === bucket ? index : acc
          }
          return acc
        }, null)
        _index = (_index === null && this.buckets[0]) ? 0 : null
        if (_index !== null) {
          document.querySelectorAll('.bucket-item')[_index].click()
        } else {
          this.bucket = ''
        }
      })
    },
    async selectBucket (bucketObj) {
      this.domains = bucketObj['domains'] || []
      this.zone = bucketObj['zone'] || ''
      try {
        // 查询存储空间区域
        if (!!this.zone === false) {
          this.zone = await this.fetchBucketZone({ bucket: bucketObj['name'] })
        }
        // 查询存储空间域名
        if (!!this.domains || this.domains.length === 0) {
          this.domains = await this.fetchBucketDomain({ bucket: bucketObj['name'] })
        }
        // 查询存储空间数据记录
        await this.fetchList({ bucket: bucketObj['name'] })
      } catch (e) {
        console.warn(e)
      } finally {
        this.bucket = bucketObj['name']
      }
    },
    addBucket () {
      this.addBktVisible = true
    },
    async handleAddSuccess (form = {}) {
      try {
        const { bucket, region } = form
        await this.createBucket({ bucket, region })
        await this.fetchBuckets({})
        this.defaultClick(this.bucket)
      } catch (e) {
        console.warn(e)
      }
    },
    async delBucket (bucket) {
      try {
        await this.$showConfirm({
          title: '提示',
          content: `是否确认删除: ${bucket} ?`
        })
        await this.deleteBucket({ bucket })
        await this.fetchBuckets({})
        this.defaultClick(this.bucket)
      } catch (e) {
        console.warn(e)
      }
    },

    async refresh () {
      try {
        const resObj = await this.fetchList({ bucket: this.bucketSelected['name'] })
        const { items = [] } = resObj
        this.resource = items
      } catch (e) {
        console.warn(e)
      }
    },
    deleteResource (key) {
      this.$showConfirm({
        title: '提示',
        content: `是否确认删除: ${key} ?`
      }).then(() => {
        let payload = { key, bucket: this.bucketSelected['name'] }
        this.deleteBucketResource(payload).then(res => {
          this.refresh()
        }).catch(err => {
          console.warn(err)
        })
      }).catch(() => {
        console.warn('取消')
      })
    },
    handleCommand (command) {
      if (command['type'] === '1') {
        // 下载文件
      } else if (command['type'] === '2') {
        // 复制外链
      } else if (command['type'] === '3') {
        // 删除文件
        const { key = '' } = command
        this.deleteResource(key)
      }
    },
    async handlePrefixChange (val) {
      try {
        // 查询存储空间数据记录
        const resObj = await this.fetchList({
          prefix: val,
          bucket: this.bucketSelected['name']
        })
        // const { marker = '', items = [] } = resObj
        const { items = [] } = resObj
        // this.marker = marker
        this.resource = items
      } catch (e) {
        console.warn(e)
      }
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
    VContent,
    VAddBucket
  }
}
</script>

<style scoped>
.bucket-item {
    padding-right: 30px;
    height: 48px;
    line-height: 48px;
}
.bucket-item .del-bucket {
    display: none;
}
.bucket-item:hover .del-bucket {
    display: inline-block;
    height: 100%;
    position: absolute;
    right: 0;
    border: none;
    color: inherit;
}
.add-bucket {
    display: block;
    width: 100%;
    height: 48px;
    margin: 0;
    padding: 0 20px;
    border-right: 1px solid #fff;
    line-height: 48px;
    box-sizing: border-box;
    background: #4b4f53;
}
.table-container {
    display: block;
    width: 100%;
    height: 574px;
    margin: 0;
    padding: 0;
    position: relative;
    /* background: #ccc; */
}
</style>
