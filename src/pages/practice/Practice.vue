<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库</el-breadcrumb-item>
    </el-breadcrumb>

    <ProblemList region="set_main" />
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



