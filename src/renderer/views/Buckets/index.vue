<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside style="width: 200px;">
      <el-menu style="height: calc(100% - 48px);overflow-y: auto">
        <el-menu-item class="bucket-item"
          v-for="(item, index) in buckets"
          :key="index"
          :index="index.toString()"
          @click="e => $noRepeat(handleClickBucket, e, item.name)">
          <span slot="title">{{ item.name }}</span>
          <el-button @click.stop="() => handeDelBucket(item.name)" type="text" size="small" class="del-bucket" icon="el-icon-circle-close"></el-button>
        </el-menu-item>
      </el-menu>
      <div class="add-bucket">
        <el-button @click="addBktVisible = true" style="font-weight: 200;" type="text" icon="el-icon-circle-plus">新增</el-button>
      </div>
      <v-add-bucket
        :visible.sync="addBktVisible"
        @close="addBktVisible = false"
        @success="handleAddSuccess"></v-add-bucket>
    </el-aside>
    <el-main style="background: #ccc;font-size: 0;">
      <el-select size="small" v-model="domain" style="width: 250px;">
        <el-option v-for="(item, index) in domains" :key="index"
          :label="item" :value="item">{{ item }}</el-option>
      </el-select>
      <el-button class="btn-copy" size="small" :data-clipboard-text="domain">复制</el-button>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Clipboard from 'clipboard'
import VAddBucket from './AddBucket'

export default {
  data () {
    return {
      domains: [],
      marker: '',
      items: [],
      domain: '',

      addBktVisible: false
    }
  },
  computed: {
    ...mapGetters({
      buckets: 'buckets'
    })
  },
  mounted () {
    this.clipboard = new Clipboard('.btn-copy')
    this.clipboard.on('success', e => {
      this.$message.success(`复制空间域名成功: ${this.domain} !`)
      e.clearSelection()
    })
  },
  methods: {
    ...mapActions({
      fetchBuckets: 'FETCH_BUCKETS',
      createBucket: 'CREATE_BUCKET',
      deleteBucket: 'DELETE_BUCKET',
      fetchList: 'FETCH_LIST',
      fetchBucketDomain: 'FETCH_BUCKET_DOMAIN'
    }),
    async handleClickBucket (bucket) {
      this.domains = []
      this.domain = ''
      this.marker = ''
      this.items = []
      try {
        const domains = await this.fetchBucketDomain({ bucket })
        this.domains = [...domains]
        this.domain = this.domains[0] || ''
        const resObj = await this.fetchList({ bucket })
        const { marker = '', items = [] } = resObj
        this.marker = marker
        this.items = items
      } catch (e) {
        console.warn(e)
      } finally {
        console.log(this.domains)
        console.log(this.marker)
        console.log(this.items)
      }
    },
    handleCopyDomain () {
      // TODO
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
</style>
