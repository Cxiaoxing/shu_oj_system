<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>提交状态</el-breadcrumb-item>
    </el-breadcrumb>

    <SubmissionTable region="set_main"/>
  </div>
</template>
<script>
import SubmissionTable from "@/components/submission/SubmissionTable.vue";
export default {
  components: {
    SubmissionTable,
  },
};
</script>
