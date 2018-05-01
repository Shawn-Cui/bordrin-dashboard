<template>
  <div class="login">
    <el-form ref="login" :model="form" :rules="loginRules">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input v-model="form.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="login-footer">
      <el-button plain @click="enterSuccess('login')">登 录</el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data: function() {
      return {
        form: {
          username: '',
          password: ''
        },
        formLabelWidth: '120px',
        loginRules: {
          username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      async enterSuccess(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let loginData = {}
            if (this.form.username.indexOf('@') > -1) {
              loginData = {
                email: this.form.username,
                password: this.form.password
              }
            } else {
              loginData = {
                username: this.form.username,
                password: this.form.password
              }
            }
            axios.post('/api/Admins/login', loginData).then((response) => {
              if (response.status >= 200 && response.status < 300) {
                console.log(response)
                localStorage.setItem('BDToken', response.data.id)
                this.$message({showClose: true, message: "登录成功！", type: 'success'})
                this.$router.push({
                  name : 'news'
                })
              } else {
                this.$message({showClose: true, message: "登录失败！", type: 'error'})
              }
            })
          } else {
            this.$message({showClose: true, message: "您所填写的信息不完整，无法提交！", type: 'warning'})
            return false
          }
        })
      }
    }
  }
</script>

<style>
  body {
    background: #0e9aef;
  }
  .login {
    background: #0e9aef !important;
    position: relative;
    margin: 200px 35%;
    width: 30%;
  }
  .login label.el-form-item__label {
    color: #fff;
  }
  .login-footer {
    text-align: right;
  }
</style>
