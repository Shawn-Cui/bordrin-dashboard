<template>
  <el-container class="app">

    <el-header>
      <bd-menu></bd-menu>
    </el-header>

    <el-container class="app-body">
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script type="text/babel">
import BdMenu from 'components/BdMenu'
import BdFooter from 'components/BdFooter'

export default {
  name: 'app',
  components: { BdMenu, BdFooter }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.app {
  background: #fff;
  .el-header {
    padding: 0;
  }
  .app-body {
    .el-main {
      padding: 40px 20px 0;
    }
  }
}
</style>
