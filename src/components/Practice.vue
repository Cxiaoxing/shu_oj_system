<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题集</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <!-- 搜索区域 -->
      <div>
        <el-row>
          <el-col :span="10">
            <el-input
              placeholder="请输入想要搜索的题目名称"
              v-model="searchInput"
              @keyup.enter.native="getProblemList()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getProblemList()"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 列表区域 -->
      <el-table
        :data="problemlist"
        style="margin-top: 20px"
        @row-click="handleClickProblem"
      >
        <el-table-column prop="out_problem.id" label="ID" width="80">
        </el-table-column>
        <el-table-column prop="out_problem.info.title" label="题目">
        </el-table-column>
        <el-table-column prop="out_problem.info.tags" label="标签">
          <template slot-scope="scope">
            <el-tag
              class="tagsLayout"
              v-for="(item, index) in scope.row.out_problem.info.tags"
              :key="index"
              >{{ item }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="out_problem.info.difficulty"
          label="难度"
          :filters="[
            { text: '入门', value: 0.0 },
            { text: '简单', value: 2.5 },
            { text: '中等', value: 5.0 },
            { text: '困难', value: 7.5 },
          ]"
          :filter-method="filterDifficulty"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              type="info"
              v-if="
                scope.row.out_problem.info.difficulty >= 0 &&
                scope.row.out_problem.info.difficulty < 2.5
              "
              >入门
            </el-tag>
            <el-tag
              effect="dark"
              type="success"
              v-if="
                scope.row.out_problem.info.difficulty >= 2.5 &&
                scope.row.out_problem.info.difficulty < 5.0
              "
              >简单
            </el-tag>
            <el-tag
              effect="dark"
              type="warning"
              v-if="
                scope.row.out_problem.info.difficulty >= 5.0 &&
                scope.row.out_problem.info.difficulty < 7.5
              "
              >中等
            </el-tag>
            <el-tag
              effect="dark"
              type="danger"
              v-if="
                scope.row.out_problem.info.difficulty >= 7.5 &&
                scope.row.out_problem.info.difficulty < 10.0
              "
              >困难
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submit_times" label="提交次数"></el-table-column>
        <el-table-column
          prop="accept_times"
          label="通过率"
          :formatter="passingRateFormtype"
        >
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
        style="margin-top: 30px; text-align: center"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { problemPrivateListRequest } from "../request/problemRequest";
import { userCheckOnlineRequest } from "../request/userRequest";
export default {
  data() {
    return {
      searchInput: "",
      currentPage: 1,
      pageSize: 10,
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
      var that = this;
      const params = {
        problem_id_order: true,
        title_filter: this.searchInput,
        release_filter: true,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemPrivateListRequest("set_main", params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.problemlist = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 点击题目跳转至题目详情
    handleClickProblem(row, column, event, cell) {
      let id = row.inner_id;
      var that = this;
      // 调用 me 接口获取用户状态
      userCheckOnlineRequest()
        .then(function (response) {
          if (response) {
            that.$router.push({ name: "problemDetail", params: { id: id } });
          }
        })
        .catch(function (error) {
          console.log(error);
          // 提示用户登录
          that.$message({
            message: "请先登录！",
            type: "info",
          });
        });
    },

    //  根据困难度筛选
    filterDifficulty(value, row) {
      return (
        row.out_problem.info.difficulty >= value &&
        row.out_problem.info.difficulty < value + 2.5
      );
    },

    // 计算通过率，返回对应文字
    passingRateFormtype(row, column, cellValue) {
      if (row.submit_times == 0) {
        return 0 + ".00%";
      } else {
        return ((row.accept_times / row.submit_times) * 100).toFixed(2) + "%";
      }
    },
  },
};
</script>

<style lang='less' scoped>
.tagsLayout {
  margin-right: 5px;
}
</style>

