<template>
  <div class="login">
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth" :rules="loginRules">
        <el-input v-model="form.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="login-footer">
      <el-button plain @click="enterSuccess">登 录</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        form: {
          username: process.env.USER_NAME,
          password: process.env.PASS_WD
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
      enterSuccess() {
        this.$router.push({
          name : 'news'
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
