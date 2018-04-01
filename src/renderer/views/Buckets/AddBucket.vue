<template>
  <el-dialog
    center
    width="500px"
    title="创建存储空间"
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
      <el-form-item label="存储空间名称" prop="bucket">
        <el-input clearable
          v-model="form.bucket"
          placeholder="请输入存储空间名称"
          :maxlength="64"
          :minlength="4"></el-input>
      </el-form-item>
      <el-form-item label="存储区域" prop="region">
        <el-select clearable
          v-model="form.region"
          placeholder="请选择存储区域"
          style="width: 100%;">
          <el-option label="华东" value="z0"></el-option>
          <el-option label="华北" value="z1"></el-option>
          <el-option label="华南" value="z2"></el-option>
          <el-option label="北美" value="na0"></el-option>
          <el-option label="东南亚" value="as0"></el-option>
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
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let checkLength = (rule, value, callback) => {
      if (value.length >= 4 && value.length <= 64) {
        callback()
      } else {
        return callback(new Error('存储空间名称在4～64个字符之间'))
      }
    }
    let checkContent = (rule, value, callback) => {
      if (/^[0-9a-zA-Z-_]+$/g.test(value)) {
        callback()
      } else {
        return callback(new Error('存储空间名称只能包含字母、数字、中划线、下划线'))
      }
    }
    return {
      visibleInner: this.visible,
      form: {
        bucket: '',
        region: 'z0'
      },
      rules: {
        bucket: [
          { required: true, message: '请输入存储空间名称', trigger: 'change' },
          { validator: checkLength, trigger: 'change' },
          { validator: checkContent, trigger: 'change' }
        ],
        region: [
          { required: true, message: '请选择存储区域', trigger: 'change' }
        ]
      }
    }
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
          this.$emit('success', this.form)
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
    }
  }
}
</script>

<style scoped>

</style>
