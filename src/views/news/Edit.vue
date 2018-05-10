<template>
<div class="container">
  <el-form ref="news" :model="news" size="medium" label-position="top" :rules="editNewsRules">
    <el-row :gutter="60">
      <el-col :span="12">
        <el-form-item label="新闻标题" prop="title">
          <el-input class="title" auto-complete="off" v-model="news.title"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="作者" prop="author">
          <el-input class="author" auto-complete="off" v-model="news.author"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="60">
      <el-col :span="12">
        <el-form-item label="封面大图" prop="coverURL">
          <el-upload
            class="coverURL-uploader"
            action="https://example.com/"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
            :http-request="uploadCover">
            <img v-if="coverURL" :src="coverURL" class="coverURL">
            <i v-else class="el-icon-plus coverURL-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="封面小图" prop="thumbURL">
          <el-upload
            class="thumbURL-uploader"
            action="https://example.com/"
            :show-file-list="false"
            :on-success="handleThumbSuccess"
            :before-upload="beforeThumbUpload"
            :http-request="uploadThumb">
            <img v-if="news.thumbURL" :src="news.thumbURL" class="thumbURL">
            <i v-else class="el-icon-plus thumbURL-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col> -->
    </el-row>

    <el-row :gutter="60" v-if="topCoverShow">
      <el-col :span="24">
        <el-form-item label="置顶图" prop="topCoverURL">
          <el-upload
            class="topCoverURL-uploader"
            action="https://example.com/"
            :show-file-list="false"
            :on-success="handleTopCoverSuccess"
            :before-upload="beforeTopCoverUpload"
            :http-request="uploadTopCover">
            <img v-if="topCoverURL" :src="topCoverURL" class="topCoverURL">
            <i v-else class="el-icon-plus topCoverURL-uploader-icon"></i>
          </el-upload>
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
            v-model="news.abstract">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-form-item label="正文" prop="content">
        <vue-editor id="editor"
          useCustomImageHandler
          @imageAdded="uploadContentImg" v-model="news.content">
        </vue-editor>
      </el-form-item>
    </el-row>

    <el-row class="edit-footer">
      <el-button @click="cancelEdit('news')">取 消</el-button>
      <el-button type="primary" @click="edit('news')">确 定</el-button>
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
      news: {},
      newsContent: {},
      content: '',
      // 新建新闻的字段限制规则
      editNewsRules: {
        title: [
          {required: true, message: '标题不能为空', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'},
          // {pattern: /^[\u4E00-\u9FA5]+$/, message: '请填写中文'}
        ],
        content: [
          {required: true, message: '正文不能为空', trigger: 'blur'},
          {min: 5, message: '正文应不少于五个字符', trigger: 'blur'}
        ],
        coverURL: [
          {required: true, message: '封面图不能为空', trigger: 'blur'}
        ],
        topCoverURL: [
          {required: true, message: '置顶图不能为空', trigger: 'blur'}
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
      localStorage.setItem('bordrin-newsId', this.id)
    }
    if (this.tag && this.tag === 'head') {
      this.topCoverShow = true
    }
    this.getNewsById()
    this.getNewsContent()
  },
  methods: {
    // 根据id获取当前新闻
    async getNewsById() {
      let storageId = await localStorage.getItem('bordrin-newsId')
      console.log(storageId)
      this.id = this.id || storageId
      let data = await axios.get('/api/News/' + this.id)
      console.log(data.data)
      this.news = data.data
      this.coverURL = data.data.coverURL
      this.topCoverURL = data.data.topCoverURL
      if (data.data.tag === 'head') {
        this.topCoverShow = true
      }
    },
    async getNewsContent() {
      let storageId = await localStorage.getItem('bordrin-newsId')
      console.log(storageId)
      this.id = this.id || storageId
      let data = await axios.get('/api/News/' + this.id + '/newsContents')
      console.log(data.data)
      // this.newsContent = data.data.content
      this.news = Object.assign({}, this.news, {content: data.data.content})
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
    // 上传封面大图
    uploadCover(file) {
      let me = this
      let reader = new FileReader
      reader.onload = function(evt) {
        let image = new Image();
        image.onload = function () {
          if (this.width === 580 && this.height === 515) {
            upload.uploadHandle(file, function(err, url) {
              console.log(err, url)
              if (err) {
                console.log(err, '上传失败！')
              }
              me.coverURL = url
              me.news.coverURL = url
            })
          } else {
            me.$message({showClose: true, message: '图片尺寸必须为580*515！', type: 'warning'})
          }
        };
        image.src = evt.target.result;
      }
      console.log(file)
      reader.readAsDataURL(file.file)
      // let img = new Image()
      // let url = URL.createObjectURL(file)
      // img.src = url
      // img.onload = function () {
      //   console.log(this, this.width, this.height)
      //   if (this.width === 580 && this.height === 515) {
          // upload.uploadHandle(file, function(err, url) {
          //   console.log(err, url)
          //   if (err) {
          //     console.log(err, '上传失败！')
          //   }
          //   me.coverURL = url
          //   me.news.coverURL = url
          // })
      //   } else {
      //     me.$message({showClose: true, message: '图片尺寸必须为580*515！', type: 'warning'})
      //   }
      // }
    },
    // 上传置顶大图
    uploadTopCover(file) {
      let me = this
      let img = new Image()
      let url = URL.createObjectURL(file.file)
      img.src = url
      img.onload = function () {
        console.log(this, this.width, this.height)
        if (this.width === 1420 && this.height === 890) {
          upload.uploadHandle(file, function(err, url) {
            console.log(err, url)
            if (err) {
              console.log(err, '上传失败！')
            }
            me.topCoverURL = url
            me.news.topCoverURL = url
          })
        } else {
          me.$message({showClose: true, message: '图片尺寸必须为1420*890！', type: 'warning'})
        }
      }
    },
    // 上传封面小图
    uploadThumb(file) {
      let me = this
      upload.uploadHandle(file, function(err, url) {
        console.log(err, url)
        if (err) {
          console.log(err, '上传失败！')
        }
        me.news.thumbURL = url
      })
    },
    // 上传正文图片
    uploadContentImg(file, Editor, cursorLocation, resetUploader) {
      let me = this
      upload.uploadHandle(file, function(err, url) {
        console.log(err, url)
        if (err) {
          console.log(err, '上传失败！')
        }
        Editor.insertEmbed(cursorLocation, 'image', url)
        resetUploader()
      })
    },
    // 取消编辑
    cancelEdit(formName) {
      this.$refs[formName].resetFields()
      this.$router.push('/')
    },
    // 编辑新闻
    edit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.put('/api/News/' + this.id, {
            title: this.news.title,
            coverURL: this.news.coverURL,
            topCoverURL: this.news.topCoverURL,
            tag: this.news.tag,
            abstract: this.news.abstract,
            author: this.news.author,
            dateOfRelease: this.news.dateOfRelease
          })
            .then((response) => {
              console.log(response)
              if (response.status >= 200 && response.status < 300) {
                axios.put('/api/News/' + this.id + '/newsContents', {
                  content: this.news.content
                })
                  .then((response) => {
                    console.log(response)
                    if (response.status >= 200 && response.status < 300) {
                      this.$message({showClose: true, message: '编辑成功！', type: 'success'})
                      this.$router.push('/')
                    } else {
                      this.$message({showClose: true, message: response.status, type: 'warning'})
                    }
                  })
                  .catch((error) => {
                    this.$message({showClose: true, message: '编辑正文失败！', type: 'error'})
                  })
                // this.$message({showClose: true, message: '编辑成功！', type: 'success'})
                // this.$router.push('/')
              } else {
                this.$message({showClose: true, message: response.status, type: 'warning'})
              }
            })
            .catch(function (error) {
              this.$message({showClose: true, message: '编辑新闻失败！', type: 'error'})
            })
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

  /* .coverURL-uploader .el-upload, .thumbURL-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  } */
  .coverURL-uploader .coverURL:hover, .coverURL-uploader-icon:hover {
    border-color: #409EFF;
  }
  .coverURL-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 28px;
    color: #8c939d;
    width: 225px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .coverURL-uploader .coverURL {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 225px;
    height: 200px;
    display: block;
  }

  .topCoverURL-uploader .topCoverURL:hover, .topCoverURL-uploader-icon:hover {
    border-color: #409EFF;
  }
  .topCoverURL-uploader-icon {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    font-size: 28px;
    color: #8c939d;
    width: 640px;
    height: 400px;
    line-height: 400px;
    text-align: center;
  }
  .topCoverURL-uploader .topCoverURL {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 640px;
    height: 400px;
    display: block;
  }
  /* .coverURL-uploader .thumbURL {
    width: 200px;
    height: 200px;
    display: block;
  } */

  .edit-footer {
    text-align: right;
    margin-bottom: 30px;
  }
</style>
