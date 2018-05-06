<template>
  <el-container class="new-style" id="recruit">
    <el-header class="el-header">
      <strong class="strongCol">招聘列表</strong>
      <el-button type="primary" size="small" icon="el-icon-plus" class="fr" @click="addBox = true">
        新增
      </el-button>
      <el-input class="check" size="small" placeholder="请输入搜索关键字：" v-model="search" highlight-current-row="false">
        <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
      </el-input>
    </el-header>
    <el-main>
      
      <el-table :data="recruitList" border stripe class="tableWidth" column-key="k">
        <el-table-column align="center" label="地区">
          <template slot-scope="scope">
            <span>{{ scope.row.cityName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="职位">
          <template slot-scope="scope">
            <span>{{ scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope)"></el-button>
            <el-button type="success" icon="el-icon-view" size="mini"></el-button>
            <el-button type="success" icon="el-icon-document" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block marginTop">
        <!--分页-->
        <v-paging :pag-msg="msg" @send="getPage" :msg="localPage"></v-paging>
      </div>
    </el-main>
    <!--新增招聘-->
    <el-dialog title="新增招聘" :visible.sync="addBox" width="50%" class="limit-table" id="addForm" :close-on-click-modal="false">
      <el-form ref="recruit" :model="recruit" size="medium" label-position="top" :rules="createRecruitRules">
        <el-form-item label="职位名称" prop="title">
          <el-input class="title" auto-complete="off" v-model="recruit.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd('recruit')">取 消</el-button>
        <el-button type="primary" @click="subBtn('recruit')">提 交</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  import paging from "../../public/paging"
  import axios from 'axios'
  
  export default {
    name: "recruit",
    data() {
      return {
        // 搜索关键字
        search: '',
        head: null,
        // 招聘列表
        recruitList: [
          { id: 1, cityName: '北京', title: '汽车约束系统工程师' },
          { id: 2, cityName: '上海', title: '汽车约束系统工程师' },
          { id: 3, cityName: '成都', title: '汽车约束系统工程师' },
          { id: 4, cityName: '杭州', title: '汽车约束系统工程师' },
          { id: 5, cityName: '深圳', title: '汽车约束系统工程师' }
        ],
        msg: {
          // 每页数据
          pagNumber: 5,
          // 总数据
          pagTotal: null
        },
        // 当前第几页
        localPage: 1,
        addBox: false,
        // 新增招聘信息
        recruit: {
          title: ''
        },
        // 新建招聘的字段限制规则
        createRecruitRules: {
          title: [
            { required: true, message: '职位不能为空', trigger: 'blur' },
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
        this.getRecruitList();
      }
    },
    mounted() {
      this.getRecruitList()
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
        this.searchRecruit(filter);
      },
      // 根据关键字搜索招聘
      async searchRecruit(search) {
        let filter = {
          skip: (this.localPage - 1) * this.msg.pagNumber,
          limit: this.msg.pagNumber,
          order: 'dateOfRelease DESC'
        }
        filter.where = search.where

        // let res = await axios.get('/api/Recruits?filter=' + encodeURI(JSON.stringify(filter)), {
        //   params: {
        //     skip: this.localPage * this.msg.pagNumber,
        //     limit: this.msg.pagNumber,
        //     order: 'dateOfRelease DESC',
        //     title: search
        //   }
        // })
        // console.log(res)
        // this.recruitList = res.data
        // let totalRes = await axios.get('/api/Recruits/count', {
        //   params: {
        //     order: 'dateOfRelease DESC',
        //     title: search
        //   }
        // })
        // this.msg.pagTotal = totalRes.count
      },
      cancleAdd(formName) {
        this.addBox = false;
        this.$refs[formName].resetFields();
      },
      // 新增招聘
      subBtn: async function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({showClose: true, message: "新增招聘成功！", type: 'success'})
          } else {
            this.$message({showClose: true, message: "您所填写的信息不完整，无法提交", type: 'warning'})
            return false
          }
        })
      },
      getPage(localPage) {
        this.localPage = localPage;
      },
      // 获取招聘列表
      getRecruitList() {
        console.log('recruit list')
        this.msg.pagTotal = 15
      },
      // 编辑招聘
      handleEdit(item) {
        this.$router.push({
          name : 'recruit.edit',
          params: {
            id : item.row.id
          }
        })
      },
      // 删除新闻
      handleDelete(index, row) {
        this.$confirm('此操作将永久删除该招聘，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('delete')
          this.$message({showClose: true, message: '删除招聘成功！', type: 'success'})
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'})
        })
      }
    }
  }
</script>

<style>
  #recruit .el-form-item--mini .el-form-item__content {
    color: #fff;
  }

  #recruit .limit-table .el-dialog__title, #recruit .limit-table .el-form-item__label {
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

  #recruit .tobeCheck {
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

  #recruit .buttonwidthTwo { /*按钮所占宽度*/
    width: 35%;
  }

  #recruit .buttonwidthThree { /*通过，不通过，退出按钮样式*/
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
