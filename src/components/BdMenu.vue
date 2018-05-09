<template>
  <div class="bd-menu">
    <el-menu
      router
      :default-active="curActive"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#0e9aef"
      text-color="#a7b1c2"
      active-text-color="#fff"

      style="z-index: 999">
      <el-submenu index="1" v-if="newsPermission">
        <template slot="title">新闻</template>
        <el-menu-item index="/news">列表</el-menu-item>
      </el-submenu>
      <el-submenu index="2" v-if="recruitPermission">
        <template slot="title">招聘</template>
        <el-menu-item index="/recruit">列表</el-menu-item>
      </el-submenu>
    </el-menu>

    <div class="toggle">
      <i class="el-icon-menu navMenu" @click="backPage" v-show="siteNavBack"></i>
      <el-menu class="el-menu-demo" mode="horizontal" background-color="#0e9aef" text-color="#fff"
               style="display: inline-block !important;">
        <el-submenu index="1">
          <template slot="title"><span class="welcome">欢迎您，管理员</span></template>
          <el-menu-item index="1-1" @click="editPW = true" v-show="editPWshow">
            修改密码
          </el-menu-item>
          <el-menu-item index="1-1" v-show="logoutShow" @click="logout">
            登出
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- <a href="javaScript:;" class="navMenu" id="userLogin" @click="signOut">
        <i class="cutline" style="display: inline-block">|</i>退出
      </a> -->
    </div>
  </div>
</template>

<script type="text/babel">
  import axios from 'axios'

  export default {
    name: 'BdMenu',
    data: function() {
      return {
        curActive: '/news/News',
        siteNavBack: false,
        siteNav: true,
        editPWshow: true,
        logoutShow: true,
        newsPermission: false,
        recruitPermission: false
      }
    },
    mounted() {
      let routePermission = localStorage.getItem('BDRoutePermission') || ''
      switch (routePermission) {
        case '10':
          this.newsPermission = true
          this.recruitPermission = false
          break
        case '01':
          this.newsPermission = false
          this.recruitPermission = true
          break
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath)
      },
      backPage() {
        this.$router.go(-1);//返回
      },
      logout() {
        axios.post('/api/Admins/logout').then((response) => {
          if (response.status >= 200 && response.status < 300) {
            console.log(response)
            localStorage.setItem('BDToken', '')
            this.$message({showClose: true, message: "登出成功！", type: 'success'})
            this.$router.push({
              name : 'login'
            })
          } else {
            this.$message({showClose: true, message: "登出失败！", type: 'error'})
          }
        })
        // this.$http.post('/logout').then((response)=>{
        //   this.$message({showClose: true, message: '退出成功！', type: 'success'});
        // })
      },
    }
  }
</script>

<style>
  .el-loading-mask {
    z-index: 1000 !important;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
  }

  .el-menu > li a {
    display: block;
  }

  .el-menu--horizontal {
    border-bottom: none !important;
  }

  .el-menu--horizontal .el-submenu > .el-menu {
    position: absolute;
    top: 60px !important;
    left: 0;
  }

  #enterBox .el-dialog .el-input__inner {
    color: #000;
  }

  #enterBox {
    background: #0e9aef !important;
  }

  .bd-menu .toggle {
    position: absolute;
    background: #0e9aef;
    height: 60px;
    line-height: 60px;
    top: 0;
    right: 30px;
    z-index: 1001;
    color: #1C5D8F;
  }

  .bd-menu .navMenu {
    position: relative;
    top: -23px;
  }

  .bd-menu .toggle > a {
    color: rgb(56, 107, 157);
  }

  .bd-menu .el-icon-edit.editPassword {
    color: #386B9D;
  }

  .bd-menu .toggle .el-submenu.is-active .el-submenu__title {
    border-bottom-color: #0C1330 !important;
  }

  .bd-menu .toggle .el-menu-item.is-active {
    color: #386B9D !important;
  }

  #setPW .el-dialog .el-input__inner {
    color: #000;
  }

  .bd-menu #setPW .el-form-item__label {
    color: #5182E1;
    width: 136px;
  }

  .bd-menu #setPW .setUserName {
    color: #8DC4EA;
  }

  .bd-menu .el-icon-menu.navMenu {
    cursor: pointer;
  }

  #userLogin {
    color: #fff;
  }

  .welcome {
    color: #fff;
  }

  .cutline {
    margin: 0 5px 0 0;
    color: #ffffff;
  }

  .el-icon-arrow-down:before {
    color: #ffffff;
  }
</style>
