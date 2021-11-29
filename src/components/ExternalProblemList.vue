<template>
  <el-card>
    <ProblemSearchBar :searchProblemList="searchProblemList" />
    <el-table :data="problemlist" @row-click="handleClickProblem">
      <el-table-column prop="inner_id" label="ID" width="80" />
      <el-table-column prop="is_accepted" width="30">
        <template slot-scope="scope">
          <i
            class="el-icon-success mySubmission"
            v-if="scope.row.is_accepted"
          />
        </template>
      </el-table-column>
      <el-table-column prop="out_problem.info.title" label="题目名称" />
      <el-table-column prop="out_problem.info.tags" label="标签" width="200">
        <template slot-scope="scope">
          <el-tag
            v-for="(item, index) in scope.row.out_problem.info.tags"
            :key="index"
            style="margin-right: 5px"
            >{{ item }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="out_problem.info.difficulty"
        label="难度"
        width="150"
      >
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            type="info"
            v-if="scope.row.out_problem.info.difficulty < 2.5"
            >Navie
          </el-tag>
          <el-tag
            effect="dark"
            type="success"
            v-else-if="scope.row.out_problem.info.difficulty < 5.0"
            >Easy
          </el-tag>
          <el-tag
            effect="dark"
            type="warning"
            v-else-if="scope.row.out_problem.info.difficulty < 7.5"
            >Middle
          </el-tag>
          <el-tag effect="dark" type="danger" v-else>Hard </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="submit_times" label="提交次数" width="150" />
      <el-table-column prop="accept_times" label="通过率" width="150">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="passingRateCalculate(scope.row)"
            color="#1db7b5"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      hide-on-single-page
      @current-change="getProblemList"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next, jumper"
      :total="total"
      class="table_pagination"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import { problemListFromRegionRequest } from "@/request/problemRequest";
import { userCheckOnlineRequest } from "@/request/userRequest";
import ProblemSearchBar from "@/components/ProblemSearchBar.vue";
import { passingRateCalculate } from "@/assets/config";
export default {
  components: {
    ProblemSearchBar,
  },
  props: {
    region: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      title_filter: "",
      tag_filter: [],
      difficulty_filter: "",
      currentPage: 1,
      pageSize: 8,
      total: null,
      problemlist: [],
    };
  },
  created() {
    this.getProblemList();
  },
  methods: {
    // 搜索题目列表
    getProblemList: function (currentPage = 1) {
      const params = {
        inner_id_order: true,
        title_filter: this.title_filter,
        tag_filter: this.tag_filter,
        difficulty_filter: this.difficulty_filter,
        release_filter: true,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemListFromRegionRequest(this.region, params)
        .then((response) => {
          this.currentPage = currentPage;
          this.problemlist = response.list;
          this.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 搜索题目列表
    searchProblemList(title_filter, tag_filter, difficulty_filter) {
      this.title_filter = title_filter;
      this.tag_filter = tag_filter;
      this.difficulty_filter = difficulty_filter;
      this.getProblemList();
    },

    passingRateCalculate,

    // 点击题目跳转至题目详情
    handleClickProblem(row) {
      userCheckOnlineRequest()
        .then((response) => {
          if (response) {
            const routeData = this.$router.resolve({
              name: "externalProblemDetail",
              params: {
                region: row.region,
                inner_id: row.inner_id,
                problem_id: row.out_problem.id,
              },
            });
            window.open(routeData.href, "_blank");
          }
        })
        .catch(() => {
          this.$message.info("请先登录");
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.mySubmission {
  font-size: 20px;
  display: flex;
  color: #5fc931;
}
</style>