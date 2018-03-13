<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <input type="text" v-model="msg">
    <button class="alt" @click="handleClick">Click Me</button>
  </div>
</template>

<script>
  export default {
    name: 'electron-vue-demo',
    data () {
      return {
        msg: 'Hello World'
      }
    },
    methods: {
      handleClick () {
        console.log(this.msg)
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
    font-size: 0;
    background: #eee;
}
input {
  display: inline-block;
  width: 150px;
  height: 30px;
  margin: 0 20px 0 0;
  padding: 8px;
  box-sizing: border-box;
  outline: none;
  border: 1px solid #ccc;
  font-size: 14px;
}
button {
    display: inline-block;
    width: 100px;
    height: 30px;
    margin: 0;
    padding: 8px 22px;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
    border-radius: 15px;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    border: 1px solid #4fc08d;
}
button.alt {
    color: #42b983;
    background-color: transparent;
}
</style>
