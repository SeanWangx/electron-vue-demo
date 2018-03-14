<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'electron-vue-demo',
    data () {
      return {

      }
    }
  }
</script>

<style scoped>
#app {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    position: relative;
}
</style>
