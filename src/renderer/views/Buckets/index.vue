<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside style="width: 200px;">
      <el-menu style="height: calc(100% - 56px);overflow-y: auto">
        <el-menu-item v-for="(item, index) in buckets" :key="index" :index="index.toString()">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
      <div class="add-bucket">
        <el-button @click="addBktVisible = true" style="font-weight: 200;" type="text" icon="el-icon-circle-plus">新增</el-button>
      </div>
    </el-aside>
    <el-main style="background: #ccc;"></el-main>
    <v-add-bucket
      :visible.sync="addBktVisible"
      @close="addBktVisible = false"
      @success="handleAddSuccess"></v-add-bucket>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VAddBucket from './AddBucket'
export default {
  data () {
    return {
      addBktVisible: false
    }
  },
  computed: {
    ...mapGetters({
      buckets: 'buckets'
    })
  },
  methods: {
    ...mapActions({
      fetchBuckets: 'FETCH_BUCKETS'
    }),
    handleAddSuccess () {
      this.fetchBuckets({}).then(() => {
        console.log('fetch bucket list successfully')
      }).catch(error => {
        console.error('fetch bucket list failed', error)
      })
    }
  },
  components: {
    VAddBucket
  }
}
</script>

<style scoped>
.add-bucket {
    display: block;
    width: 100%;
    height: 56px;
    margin: 0;
    padding: 0 20px;
    line-height: 56px;
    box-sizing: border-box;
    background: #D3DCE6;
}
</style>
