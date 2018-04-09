<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside style="width: 200px;">
      <el-menu style="height: calc(100% - 48px);overflow-y: auto">
        <el-menu-item class="bucket-item"
          v-for="(item, index) in buckets"
          :key="index"
          :index="index.toString()"
          @click="e => $noRepeat(handleClickBucket, e, item)">
          <span slot="title">{{ item.name }}</span>
          <el-button @click.stop="() => handeDelBucket(item.name)" type="text" size="small" class="del-bucket" icon="el-icon-circle-close"></el-button>
        </el-menu-item>
      </el-menu>
      <div class="add-bucket">
        <el-button @click="handleAddBucket" style="font-weight: 200;" type="text" icon="el-icon-circle-plus">新增</el-button>
      </div>
      <v-add-bucket
        :visible.sync="addBktVisible"
        @close="addBktVisible = false"
        @success="handleAddSuccess"></v-add-bucket>
    </el-aside>
    <el-main v-if="bucketSelected" style="font-size: 0;height: 100%;position: relative;">
      <div style="margin-bottom: 10px;position: relative;">
        <el-button size="small">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button size="small">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
        <span style="margin: 0 0 0 10px;font-size: 12px;">共 {{ resource.length }} 个文件</span>
        <el-input clearable size="small"
          v-model="prefix"
          prefix-icon="el-icon-search"
          style="width: 200px;position: absolute;right: 0;"
          placeholder="请输入文件前缀搜索"
          @change="() => {}"></el-input>
      </div>
      <div style="margin-bottom: 10px;position: relative;">
        <span style="font-size: 14px;">外链默认域名</span>
        <el-select size="small" v-model="domainDefault" style="width: 230px;vertical-align: top;margin: 0 10px;">
          <el-option v-for="(item, index) in domainOptions" :key="index"
            :label="item" :value="item">{{ item }}</el-option>
        </el-select>
        <!-- <el-button class="btn-copy" size="small" :data-clipboard-text="domainDefault">保存默认域名</el-button> -->
        <el-button class="btn-copy" size="small" @click="() => {}">保存默认域名</el-button>
      </div>
      <div class="table-container">
        <el-table
          max-height="574px"
          style="100%;"
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
        </el-table>
      </div>
    </el-main>
    <el-main v-else class="flex-container">
      <div style="flex: 1;text-align: center;">请选择或者<el-button style="margin: 0 4px;" type="primary" size="mini" @click="handleAddBucket">新建</el-button>存储空间</div>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import Clipboard from 'clipboard'
import VAddBucket from './AddBucket'

export default {
  data () {
    return {
      bucketSelected: '',
      domainOptions: [],
      // marker: '',
      resource: [],
      domainDefault: '',
      prefix: '',

      addBktVisible: false
    }
  },
  computed: {
    ...mapGetters({
      buckets: 'buckets'
    })
  },
  beforeMount () {
    this.fetchBuckets({})
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
      fetchBucketZone: 'FETCH_BUCKET_ZONE'
    }),
    async handleClickBucket (bucket) {
      this.bucketSelected = bucket
      this.domainOptions = []
      this.domainDefault = ''
      // this.marker = ''
      this.resource = []
      try {
        // 查询存储空间区域
        !!bucket['zone'] || await this.fetchBucketZone({ bucket: bucket['name'] })

        // 查询存储空间域名
        if (!!bucket['domains'] && bucket['domains'].length > 0) {
          this.domainOptions = bucket['domains']
          this.domainDefault = this.domainOptions[0] || ''
        } else {
          const domainOptions = await this.fetchBucketDomain({ bucket: bucket['name'] })
          this.domainOptions = [...domainOptions]
          this.domainDefault = this.domainOptions[0] || ''
        }

        // 查询存储空间数据记录
        const resObj = await this.fetchList({ bucket: bucket['name'] })
        // const { marker = '', items = [] } = resObj
        const { items = [] } = resObj
        // this.marker = marker
        this.resource = items
      } catch (e) {
        console.warn(e)
      }
    },
    handleAddBucket () {
      this.addBktVisible = true
    },
    handleAddSuccess (form = {}) {
      const { bucket, region } = form
      if (!!bucket && !!region) {
        this.createBucket({ bucket, region }).then(res => {
          return this.fetchBuckets({})
        }).then(() => {
          console.log('fetch bucket list successfully')
        }).catch(err => {
          console.error(err)
        })
      }
    },
    handeDelBucket (bucket) {
      this.$showConfirm({
        title: '提示',
        content: `是否确认删除: ${bucket} ?`
      }).then(() => {
        this.deleteBucket({ bucket }).then(res => {
          return this.fetchBuckets({})
        }).then(() => {
          console.log('fetch bucket list successfully')
        }).catch(err => {
          console.error(err)
        })
      }).catch(() => {
        console.warn('取消')
      })
    }
  },
  components: {
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
    line-height: 48px;
    box-sizing: border-box;
    background: #D3DCE6;
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
