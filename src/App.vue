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