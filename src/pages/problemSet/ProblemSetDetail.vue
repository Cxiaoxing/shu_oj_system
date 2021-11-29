<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/problemSet' }"
        >题集</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ $route.params.region }}</el-breadcrumb-item>
    </el-breadcrumb>

    <ProblemList :region="$route.params.region" />
  </div>
</template>

<script>
import ProblemList from "@/components/ExternalProblemList.vue";
export default {
  components: {
    ProblemList,
  },
};
</script>
