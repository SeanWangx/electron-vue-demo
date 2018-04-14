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
        :visible="addBktVisible"
        @close="addBktVisible = false"
        @success="handleAddSuccess"></v-add-bucket>
    </el-aside>

    <keep-alive>
      <component v-if="bucket !== ''"
        :is="view"
        :bucket="bucket"
        :domains="domains"
        :zone="zone"
        :refresh="needRefresh"
        @change="handleViewChange"></component>
    </keep-alive>

    <el-main v-if="bucket === ''" v-loading="loading" class="flex-container">
      <div style="flex: 1;text-align: center;">请选择或者<el-button style="margin: 0 4px;" type="primary" size="mini" @click="addBucket">新建</el-button>存储空间</div>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VAddBucket from './components/AddBucket'
import VContent from './Content'
import VUpload from './Upload'

export default {
  data () {
    return {
      loading: true,

      needRefresh: false,
      view: 'VContent',

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
    this.fetchBuckets()
  },
  methods: {
    ...mapActions({
      _fetchBuckets: 'FETCH_BUCKETS',
      _createBucket: 'CREATE_BUCKET',
      _deleteBucket: 'DELETE_BUCKET',
      _fetchList: 'FETCH_LIST',
      _fetchBucketDomain: 'FETCH_BUCKET_DOMAIN',
      _fetchBucketZone: 'FETCH_BUCKET_ZONE'
    }),
    handleViewChange (v = {}) {
      const { view = 'VContent', refresh = false } = v
      this.needRefresh = refresh
      this.view = view
    },
    defaultClick (bucket) {
      this.$nextTick(() => {
        let _index = this.buckets.reduce((acc, cur, index) => {
          if (acc === null) {
            acc = cur['name'] === bucket ? index : acc
          }
          return acc
        }, null)
        if (_index === null) {
          _index = this.buckets[0] ? 0 : null
        }
        if (_index !== null) {
          this.$nextTick(() => {
            document.querySelectorAll('.bucket-item')[_index].click()
          })
        } else {
          this.bucket = ''
        }
      })
    },
    async fetchBuckets () {
      this.loading = true
      try {
        await this._fetchBuckets({})
        this.defaultClick(this.bucket)
      } catch (e) {
        console.warn(e)
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 2000)
      }
    },
    async selectBucket (bucketObj) {
      this.view = 'VContent'
      this.needRefresh = false
      this.domains = bucketObj['domains'] || []
      this.zone = bucketObj['zone'] || ''
      try {
        // 查询存储空间区域
        if (!!this.zone === false) {
          this.zone = await this._fetchBucketZone({ bucket: bucketObj['name'] })
        }
        // 查询存储空间域名
        if (!!this.domains === false || this.domains.length === 0) {
          this.domains = await this._fetchBucketDomain({ bucket: bucketObj['name'] })
        }
        // 查询存储空间数据记录
        await this._fetchList({ bucket: bucketObj['name'] })
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
        await this._createBucket({ bucket, region })
        this.fetchBuckets()
        this.$message.success({
          message: `新增存储空间【${bucket}】成功！`,
          center: true
        })
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
        await this._deleteBucket({ bucket })
        this.fetchBuckets()
        this.$message.success({
          message: `删除存储空间【${bucket}】成功！`,
          center: true
        })
      } catch (e) {
        console.warn(e)
      }
    }
  },
  components: {
    VContent,
    VUpload,
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
