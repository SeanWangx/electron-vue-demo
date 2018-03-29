<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside style="width: 200px;">
      <el-menu>
        <el-menu-item v-for="(item, index) in buckets" :key="index" :index="index.toString()">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main style="background: #ccc;"></el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      buckets: 'buckets'
    })
  },
  mounted () {
    console.log(this.buckets)
  }
}
</script>

<style scoped>

</style>
