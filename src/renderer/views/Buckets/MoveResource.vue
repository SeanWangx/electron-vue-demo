<template>
  <el-dialog
    center
    width="500px"
    :title="config['move'] ? '移动资源' : '重命名资源'"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible.sync="visibleInner"
    @close="handleClose">
    <el-form
      size="small"
      ref="form"
      label-width="120px"
      label-position="left"
      :model="form"
      :rules="rules">
      <el-form-item label="文件名称" prop="keyDest">
        <el-input
          v-model="form.keyDest"
          placeholder="请输入文件名称">
          <template slot="append">{{ form.appendText }}</template>
        </el-input>
      </el-form-item>
      <el-form-item label="存储空间" prop="bucketDest">
        <el-select
          :disabled="config['move'] === false"
          v-model="form.bucketDest"
          placeholder="请选择存储空间"
          style="width: 100%;">
          <el-option v-for="(item, index) in buckets" :key="index" :value="item['name']" :label="item['name']"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="mini" @click="cancel">取 消</el-button>
      <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      visibleInner: this.visible,
      form: {
        keyDest: '',
        appendText: '',
        bucketDest: ''
      },
      rules: {
        keyDest: [
          { required: true, message: '请输入资源名称', trigger: 'change' }
        ],
        bucketDest: [
          { required: true, message: '请选择存储空间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      buckets: 'buckets'
    })
  },
  methods: {
    closeDialog () {
      this.$emit('close')
      this.visibleInner = false
    },
    handleClose () {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    confirm () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let payload = {
            move: this.config['move'],
            keySrc: this.config['keySrc'],
            bucketSrc: this.config['bucketSrc'],
            keyDest: this.form.keyDest + this.form.appendText,
            bucketDest: this.form.bucketDest
          }
          this.$emit('success', payload)
          this.closeDialog()
        } else {
          console.warn('no')
        }
      })
    },
    cancel () {
      this.closeDialog()
    }
  },
  watch: {
    visible (val) {
      this.visibleInner = val
      if (val === true) {
        this.form.bucketDest = this.config.bucketSrc
        let _buf = this.config.keySrc.split('.')
        if (_buf.length > 1) {
          this.form.appendText = '.' + _buf.pop()
          this.form.keyDest = _buf.join('.')
        } else {
          this.form.appendText = ''
          this.form.keyDest = _buf.join('.')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
