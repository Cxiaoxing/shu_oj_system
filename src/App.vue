<template>
  <div id="app">
    <!-- 路由占位符 -->
    <keep-alive>
      <!-- 路由跳转保存当前状态 -->
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
  font-family: PingFang SC;
}

.el-dialog {
  border-radius: 5px;
}
</style>
