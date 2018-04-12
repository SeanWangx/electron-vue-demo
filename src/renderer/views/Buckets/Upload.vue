<template>
  <div>
    <p>Upload</p>
    <el-button @click="refresh = !refresh">{{ refresh }}</el-button>
    <el-button @click="back">Back</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      refresh: false
    }
  },
  deactivated () {
    this.refresh = false
  },
  methods: {
    back () {
      this.$emit('change', { view: 'VContent', refresh: this.refresh })
    }
  }
}
</script>

<style scoped>

</style>
