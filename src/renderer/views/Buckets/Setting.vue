<template>
  <el-main style="height: 100%">
    <div class="content-item">
      <el-button
        @click="() => $emit('back')"
        icon="el-icon-back"
        size="small"
        plain></el-button>
    </div>
    <div class="content-item">
      <el-button
        @click="logout"
        size="small"
        plain="">登出</el-button>
    </div>
  </el-main>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions({
      _logout: 'LOGOUT'
    }),
    async logout () {
      try {
        await this._logout()
      } catch (e) {
        console.warn(e)
      } finally {
        this.$router.replace('/login')
      }
    }
  }
}
</script>

<style scoped>
.content-item {
    display: block;
    width: 100%;
    height: auto;
    margin: 0 0 10px 0;
    padding: 0;
    position: relative;
}
</style>
