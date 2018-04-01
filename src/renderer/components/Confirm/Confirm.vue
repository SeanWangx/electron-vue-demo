<template>
  <el-dialog
    center="true"
    append-to-body="true"
    width="500px"
    class="confirm-dialog"
    :title="title"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false">

    <div class="confirm-content"
      v-html="content" v-if="dangerouslyUseHTMLString === true"></div>

    <div class="confirm-content"
      v-else>{{ content }}</div>

    <div style="text-align:center;">
      <el-button size="small" type="primary" @click="confirm">
        <span style="display:inline-block;width: 80px;">{{ confirmButtonText }}</span>
      </el-button>
      <el-button v-show="showClose" size="small" type="default" @click="cancel">
        <span style="display:inline-block;width: 80px;">{{ cancelButtonText }}</span>
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    content: {
      type: String,
      default: '内容'
    },
    dangerouslyUseHTMLString: {
      type: Boolean,
      default: false
    },
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      visible: false
    }
  },
  mounted () {
    this.visible = true
  },
  destroyed () {
    this.$el.remove()
  },
  methods: {
    close () {
      this.visible = false
      this.$destory()
    },
    confirm () {
      this.$emit('confirm')
      this.close()
    },
    cancel () {
      this.$emit('cancel')
      this.close()
    }
  }
}
</script>

<style scoped>

.confirm-dialog .confirm-content {
    display: block;
    position: relative;
    width: 100%;
    height: auto;
    margin: 0 0 30px 0;
    padding: 30px 0;
    text-align: center;
    color: #333;
    font-size: 14px;
    font-weight: 200;
}
</style>
