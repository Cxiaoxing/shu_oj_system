<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/practice' }"
        >题目列表</el-breadcrumb-item
      >
      
      <el-breadcrumb-item :to="{ path: '/problem/'+ id }">{{ problem_info.title }}</el-breadcrumb-item>
      <el-breadcrumb-item>测试点结果</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <div
      v-for="(test_case, index) in test_cases"
      v-bind:key="index"
      :class="[
        'test_case',
        test_case.result == 'SUCCESS' ? 'success' : 'warning',
      ]"
    >
      <div>#{{ index + 1 }}</div>
      <div class="content">
        <div>
          {{ test_case.result }}
        </div>
        <div>{{ test_case.cpu_time }}ms/{{ test_case.memory }}B</div>
      </div>
    </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id:0,
      problem_info: {},
      problem_contents: {},
      test_cases: [],
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getProblem(this.id);
    this.getTestCases();
    console.log(this.test_cases);
  },

  methods: {
    getTestCases: function () {
      this.test_cases = JSON.parse(sessionStorage.getItem("test_cases"));
    },
    getProblem: function (region) {
      var that = this;
      this.$axios({
        method: "get",
        url: "/problems/" + region,
      })
        .then(function (response) {
          console.log(response.data);
          that.problem_info = response.data.info;
          that.problem_contents = response.data.contents;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>

<style>
.test_case {
  margin:5px;
  height: 100px;
  width: 100px;
  text-align: center;
}
.success {
  background-color: greenyellow;
}
.warning {
  background-color: red;
}
.content{
  margin-top: 25px;
}
</style>