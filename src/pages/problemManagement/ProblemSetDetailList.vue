<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/problemManage/setList' }"
        >题集列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ $route.params.region }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <ProblemList :region="$route.params.region" />
  </div>
</template>

<script>
import ProblemList from "@/components/InternalProblemList.vue";
export default {
  components: {
    ProblemList,
  },
};
</script>
