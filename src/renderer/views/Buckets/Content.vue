<template>
    <el-main style="background: #ccc;font-size: 0;">
      <div style="margin-bottom: 10px;position: relative;">
        <el-button size="small">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button size="small">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
        <el-input clearable
          v-model="prefix" size="small"
          prefix-icon="el-icon-search"
          style="width: 200px;position: absolute;right: 0;"
          placeholder="请输入文件前缀搜索"
          @change="() => {}"></el-input>
      </div>
      <!-- <div style="font-size: 0;">
        <el-select size="small" v-model="domain" style="width: 250px;">
          <el-option v-for="(item, index) in domains" :key="index"
            :label="item" :value="item">{{ item }}</el-option>
        </el-select>
        <el-button style="vertical-align: top;" class="btn-copy" size="small" :data-clipboard-text="domain">复制</el-button>
      </div> -->
    </el-main>
</template>

<script>
export default {
  data () {
    return {
      prefix: ''
    }
  }
}
</script>

<style scoped>

</style>
