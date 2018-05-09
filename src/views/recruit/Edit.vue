<template>
<div class="container">
  <el-form ref="recruit" :model="recruit" size="medium" label-position="top" :rules="editRecruitRules">
    <el-row :gutter="60">
      <el-col :span="12">
        <el-form-item label="职位名称" prop="title">
          <el-input class="title" auto-complete="off" v-model="recruit.title"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位地点" prop="cityName">
          <el-input class="cityName" auto-complete="off" v-model="recruit.cityName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="60" v-if="topCoverShow">
      <el-col :span="24">
        <el-form-item label="摘要" prop="abstract">
          <el-input
            type="textarea"
            autosize
            placeholder="请输入内容"
            v-model="recruit.abstract">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row class="edit-footer">
      <el-button @click="cancelEdit('recruit')">取 消</el-button>
      <el-button type="primary" @click="edit('recruit')">确 定</el-button>
    </el-row>
  </el-form>
</div>
</template>

<script>
import axios from 'axios'
import upload from '../../utils/upload'
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  data: function() {
    return {
      coverURL: '',
      topCoverURL: '',
      topCoverShow: false,
      recruit: {},
      recruitContent: {},
      content: '',
      // 新建新闻的字段限制规则
      editRecruitRules: {
        title: [
          {required: true, message: '职位不能为空', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'},
          // {pattern: /^[\u4E00-\u9FA5]+$/, message: '请填写中文'}
        ],
        cityName: [
          {required: true, message: '地点不能为空', trigger: 'blur'},
          {min: 5, message: '地点应不少于5个字符', trigger: 'blur'}
        ],
        abstract: [
          {required: true, message: '摘要不能为空', trigger: 'blur'}
        ]
      },
      id: null,
      tag: undefined,
      err: [],
      searchName: ''
    }
  },
  created() {
    console.log(this.$route.params)
    this.id = this.$route.params.id
    this.tag = this.$route.params.tag
    if (this.id || this.id === 0) {
      localStorage.setItem('bordrin-recruitId', this.id)
    }
    if (this.tag && this.tag === 'head') {
      this.topCoverShow = true
    }
    this.getRecruitById()
  },
  methods: {
    // 根据id获取当前新闻
    async getRecruitById() {
      let storageId = await localStorage.getItem('bordrin-recruitId')
      console.log(storageId)
      // this.id = this.id || storageId
      // let data = await axios.get('/api/Recruits/' + this.id)
      // console.log(data.data)
      // this.recruit = data.data
    },
    handleCoverSuccess() {
    },
    beforeCoverUpload() {
    },
    handleTopCoverSuccess() {
    },
    beforeTopCoverUpload() {
    },
    handleThumbSuccess() {
    },
    beforeThumbUpload() {
    },
    // 取消编辑
    cancelEdit(formName) {
      this.$refs[formName].resetFields()
      this.$router.push('/')
    },
    // 编辑职位
    edit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({showClose: true, message: '编辑成功！', type: 'success'})
        } else {
          this.$message({showClose: true, message: '您所填写的信息不完整，无法提交！', type: 'warning'})
          return false
        }
      });
    },
  }
}
</script>

<style scoped>
  .el-form {
    margin: 0 50px;
  }
  .edit-footer {
    text-align: right;
    margin-bottom: 30px;
  }
</style>
