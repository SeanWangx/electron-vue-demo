<template>
  <div class="wrapper-container">
    Buckets
  </div>
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
