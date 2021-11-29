<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题目列表</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{
          name: 'externalProblemDetail',
          params: { region, inner_id, problem_id },
        }"
        >{{ problemtitle }}</el-breadcrumb-item
      >
      <el-breadcrumb-item>我的提交</el-breadcrumb-item>
    </el-breadcrumb>

    <SubmissionTable :region="region" :problem_filter="problem_id" />
  </div>
</template>

<script>
import SubmissionTable from "@/components/submission/SubmissionTable.vue";
import { problemInfoFromRegionRequest } from "@/request/problemRequest";
export default {
  components: { SubmissionTable },
  data() {
    return {
      region: "",
      problem_id: null,
      inner_id: null,
      problemtitle: "",
    };
  },
  created() {
    this.region = this.$route.params.region;
    this.problem_id = parseInt(this.$route.params.problem_id);
    this.inner_id = this.$route.params.inner_id;
    this.getProblem(this.$route.params.inner_id);
  },
  methods: {
    getProblem(inner_id) {
      problemInfoFromRegionRequest(this.region, inner_id)
        .then((response) => {
          this.problemtitle = response.info.title;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>