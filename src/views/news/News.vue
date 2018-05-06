<template>
  <el-container class="new-style" id="news">
    <el-header class="el-header">
      <strong class="strongCol">新闻列表</strong>
      <el-button type="primary" size="small" icon="el-icon-plus" class="fr" @click="addBox = true">
        新增
      </el-button>
      <el-input class="check" size="small" placeholder="请输入搜索关键字：" v-model="search" highlight-current-row="false">
        <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
      </el-input>
    </el-header>
    <el-main>
      
      <el-table :data="newsList" border stripe class="tableWidth" column-key="k">
        <el-table-column align="center" label="置顶">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="head" :label="scope.row.id" @change="changeHead(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">
            <span>{{ scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="作者">
          <template slot-scope="scope">
            <span>{{ scope.row.author}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="封面图">
          <template slot-scope="scope">
            <span><img class="coverURL" :src="scope.row.coverURL"></span>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="小图">
          <template slot-scope="scope">
            <span><img class="thumbURL" :src="scope.row.coverURL"></span>
          </template>
        </el-table-column> -->
        <el-table-column align="center" label="日期">
          <template slot-scope="scope">
            <span>{{ scope.row.dateOfRelease | formatDateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope)"></el-button>
            <el-button type="success" icon="el-icon-view" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block marginTop">
        <!--分页-->
        <v-paging :pag-msg="msg" @send="getPage" :msg="localPage"></v-paging>
      </div>
    </el-main>
    <!--新增新闻-->
    <el-dialog title="新增新闻" :visible.sync="addBox" width="50%" class="limit-table" id="addForm" :close-on-click-modal="false">
      <el-form ref="news" :model="news" size="medium" label-position="top" :rules="createNewsRules">
        <el-form-item label="新闻标题" prop="title">
          <el-input class="title" auto-complete="off" v-model="news.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd('news')">取 消</el-button>
        <el-button type="primary" @click="subBtn('news')">提 交</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  import paging from "../../public/paging"
  import axios from 'axios'
  
  export default {
    name: "news",
    data() {
      return {
        // 搜索关键字
        search: '',
        head: null,
        // 新闻列表
        newsList: [],
        msg: {
          // 每页数据
          pagNumber: 5,
          // 总数据
          pagTotal: null
        },
        // 当前第几页
        localPage: 1,
        addBox: false,
        // 新增新闻信息
        news: {
          title: ''
        },
        // 新建新闻的字段限制规则
        createNewsRules: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
            // {pattern: /^[\u4E00-\u9FA5]+$/, message: '请填写中文'}
          ]
        },
      }
    },
    components: {
      "v-paging": paging,
    },
    watch: {
      localPage: function (newValue, oldValue) {
        this.localPage = newValue;
        this.getNewsList();
      }
    },
    mounted() {
      this.getNewsList()
    },
    methods: {
      searchOrder() {
        let filter = {
          where: {
            title: {
              like: '%' + this.search + '%'
            }
          }
        }
        this.searchNews(filter);
      },
      // 根据关键字搜索新闻
      async searchNews(search) {
        let filter = {
          skip: (this.localPage - 1) * this.msg.pagNumber,
          limit: this.msg.pagNumber,
          order: 'dateOfRelease DESC'
        }
        filter.where = search.where

        let res = await axios.get('/api/News?filter=' + encodeURI(JSON.stringify(filter)), {
          params: {
            skip: this.localPage * this.msg.pagNumber,
            limit: this.msg.pagNumber,
            order: 'dateOfRelease DESC',
            title: search
          }
        })
        console.log(res)
        this.newsList = res.data
        let totalRes = await axios.get('/api/News/count', {
          params: {
            order: 'dateOfRelease DESC',
            title: search
          }
        })
        this.msg.pagTotal = totalRes.count
      },
      cancleAdd(formName) {
        this.addBox = false;
        this.$refs[formName].resetFields();
      },
      changeHead(news) {
        this.$confirm('将此新闻设为置顶新闻？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.get('/api/News?filter[where][tag]=head').then((response) => {
            if (response.status >= 200 && response.status < 300) {
              if (!response.data || response.data.length === 0 || response.data[0].id !== news.id) {
                axios.put('/api/News/' + news.id, {
                  title: news.title || '',
                  dateOfRelease: news.dateOfRelease || '',
                  author: news.author || '',
                  coverURL: news.coverURL || '',
                  topCoverURL: news.topCoverURL || '',
                  tag: 'head'
                }).then((response) => {
                  this.$router.push({
                    name : 'news.edit',
                    params: {
                      id : news.id,
                      tag: 'head'
                    }
                  })
                })
              }
            }  
          })
        })
      },
      // 新增新闻
      subBtn: async function (formName) {
        // let formData = new FormData()
        // formData.append("title", this.news.title)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/api/News', {
              title: this.news.title,
              dateOfRelease: new Date().toString()
            }).then((response) => {
              if (response.status >= 200 && response.status < 300) {
                let news = response.data
                axios.post('/api/News/' + response.data.id + '/newsContents', {}).then((response) => {
                  if (response.status >= 200 && response.status < 300) {
                    this.msg.pagTotal += 1
                    this.$refs[formName].resetFields()
                    this.addBox = false
                    this.getNewsList()
                    this.$message({showClose: true, message: "新增新闻成功！", type: 'success'})
                    this.$router.push({
                      name : 'news.edit',
                      params: {
                        id : news.id
                      }
                    })
                  } else {
                    this.$message({showClose: true, message: "新增新闻失败！", type: 'error'})
                  }
                })
              } else {
                this.$message({showClose: true, message: "新增新闻失败！", type: 'error'})
              }
            })
          } else {
            this.$message({showClose: true, message: "您所填写的信息不完整，无法提交", type: 'warning'})
            return false
          }
        });
      },
      getPage(localPage) {
        this.localPage = localPage;
      },
      // 获取新闻列表
      async getNewsList() {
        let filter = {
          skip: (this.localPage - 1) * this.msg.pagNumber,
          limit: this.msg.pagNumber,
          order: 'dateOfRelease DESC'
        }
        let res = await axios.get('/api/News?filter=' + encodeURI(JSON.stringify(filter)), {
          params: {
            skip: this.localPage * this.msg.pagNumber,
            limit: this.msg.pagNumber,
            order: 'dateOfRelease DESC',
          }
        })
        let headRes = await axios.get('/api/News?filter[where][tag]=head')
        if (headRes.data && headRes.data.length > 0) {
          this.head = headRes.data[0].id
        }
        this.newsList = res.data
        let totalRes = await axios.get('/api/News')
        this.msg.pagTotal = totalRes.count
      },
      // 编辑新闻
      handleEdit(item) {
        this.$router.push({
          name : 'news.edit',
          params: {
            id : item.row.id
          }
        })
      },
      // 删除新闻
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该新闻，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let delId = parseInt(row.id)
          axios.delete("/api/News/" + delId + '/newsContents').then((response) => {
            if (response.status >= 200 && response.status < 300) {
              axios.delete("/api/News/" + delId).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                  this.msg.pagTotal -= 1
                  this.getNewsList()
                  this.$message({showClose: true, message: '删除新闻成功！', type: 'success'})
                } else {
                  this.$message({showClose: true, message: '删除新闻失败！', type: 'error'})
                }
              })
            } else {
              this.$message({showClose: true, message: '删除新闻失败！', type: 'error'})
            }
          })
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'})
        })
      }
    }
  }
</script>

<style>
  #news .el-form-item--mini .el-form-item__content {
    color: #fff;
  }

  #news .limit-table .el-dialog__title, #news .limit-table .el-form-item__label {
    color: #0e9aef;
  }

  .strongCol {
    display: block;
    margin-bottom: 15px;
    color: #0e9aef;
  }

  .check {
    width: 50%;
    float: right;
  }

  #news .tobeCheck {
    color: #0e9aef;
  }

  /* .fr {
    float: right;
  } */

  .fr.batchBtn {
    margin: 0 0 0 15px;
  }

  /** 美化input file **/
  .file {
    position: relative;
    display: inline-block;
    width: 70px;
    text-align: center;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 12px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
  }

  .file input {
    position: absolute;
    /*font-size: 100px;*/
    right: 0;
    top: 0;
    opacity: 0;
  }

  .file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
  }

  p.bottomTitlt {
    margin: 0;
    letter-spacing: 2px;
    padding: 0;
  }

  #addForm .el-icon-success {
    color: #67c23a;
    font-size: 14px;
    display: inline-block;
    opacity: 0;
  }

  /* #news .companyNameMsg {
    cursor: pointer;
  } */

  #news .buttonwidthTwo { /*按钮所占宽度*/
    width: 35%;
  }

  #news .buttonwidthThree { /*通过，不通过，退出按钮样式*/
    width: 50%;
    height: 40px
  }

  .el-button--primary {
    background-color: #0e9aef;
    border-color: #0e9aef;
  }

  .el-form-item.is-required .el-form-item__label:before {
    content: '';
    margin: 0;
  }

  .el-form-item.is-required .el-form-item__label:after {
    content: '*';
    color: #f56c6c;
    margin-left: 8px;
  }

  .coverURL {
    width: 112px;
    height: 100px;
  }

  /* .thumbURL {
    width: 113px;
    height: 100px;
  } */

  .el-pagination {
    padding: 0;
    text-align: right;
  }

  .title {
    width: 100%;
  }

  span.el-radio__label {
    display: none;
  }
</style>
