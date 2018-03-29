<template>
  <el-container style="width: 100%;height: 100%;">
    <el-aside style="width: 200px;">
      <el-menu style="height: calc(100% - 56px);overflow-y: auto">
        <el-menu-item v-for="(item, index) in buckets" :key="index" :index="index.toString()">
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
      <div class="add-bucket">
        <el-button @click="addBktVisible = true" style="font-weight: 200;" type="text" icon="el-icon-circle-plus">新增</el-button>
      </div>
    </el-aside>
    <el-main style="background: #ccc;"></el-main>

    <el-dialog
      center
      width="500px"
      title="创建存储空间"
      :visible.sync="addBktVisible"
      @open="handleOpenAddBkt">
      <el-form
        size="small"
        ref="addBktForm"
        label-width="120px"
        label-position="left"
        :model="addBktForm"
        :rules="addBktRules">
        <el-form-item label="存储空间名称" prop="name">
          <el-input clearable
            v-model="addBktForm.name"
            placeholder="请输入存储空间名称"
            :maxlength="64"
            :minlength="4"></el-input>
        </el-form-item>
        <el-form-item label="存储区域" prop="region">
          <el-select clearable
            v-model="addBktForm.region"
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
        <el-button size="mini" @click="addBktVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleConfirmAddBkt">确 定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import VAddBkt from './AddBkt'
export default {
  data () {
    let checkLength = (rule, value, callback) => {
      if (value.length >= 4 && value.length <= 64) {
        callback()
      } else {
        return callback(new Error('存储空间名称在4～64个字符之间'))
      }
    }
    let checkContent = (rule, value, callback) => {
      if (/^[0-9a-zA-Z-]+$/g.test(value)) {
        callback()
      } else {
        return callback(new Error('存储空间名称只能包含字母、数字、中划线'))
      }
    }
    return {
      addBktVisible: false,
      addBktForm: {
        name: '',
        region: 'z0'
      },
      addBktRules: {
        name: [
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
  computed: {
    ...mapGetters({
      buckets: 'buckets'
    })
  },
  mounted () {
    console.log(this.buckets)
  },
  methods: {
    handleOpenAddBkt () {
      if (this.$refs['addBktForm']) {
        this.$refs['addBktForm'].resetFields()
      }
    },
    handleConfirmAddBkt () {
      this.$refs['addBktForm'].validate(valid => {
        if (valid) {
          console.log('yes', this.addBktForm)
        } else {
          console.warn('no')
        }
      })
    }
  },
  components: {
    VAddBkt
  }
}
</script>

<style scoped>
.add-bucket {
    display: block;
    width: 100%;
    height: 56px;
    margin: 0;
    padding: 0 20px;
    line-height: 56px;
    box-sizing: border-box;
    background: #D3DCE6;
}
</style>
