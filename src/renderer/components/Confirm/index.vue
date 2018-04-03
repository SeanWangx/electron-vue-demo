<template>
  <el-dialog
    width="400px"
    class="confirm-dialog"
    :title="title"
    :visible.sync="visible"
    :center="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false">

    <div class="confirm-content"
      v-html="content" v-if="dangerouslyUseHTMLString === true"></div>

    <div class="confirm-content"
      v-else>{{ content }}</div>

    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="confirm" type="primary">{{ confirmButtonText }}</el-button>
      <el-button size="mini" @click="cancel" type="default" v-show="showClose">{{ cancelButtonText }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Confirm',
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
      this.$destroy()
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
    margin: 0;
    padding: 0;
    text-align: center;
    color: #333;
    font-size: 14px;
    font-weight: 200;
}
</style>
