<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题集</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input
        placeholder="请输入你想要搜索的题集名称"
        v-model="searchInput"
        @keyup.enter.native="getProblemSetList()"
        class="singleSearchBar"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getProblemSetList()"
        ></el-button>
      </el-input>

      <el-table :data="problemSetList" @row-click="handleClickProblemSet">
        <el-table-column
          prop="title"
          label="题集名称"
          min-width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="introduction"
          label="简介"
          min-width="600"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <el-pagination
        background
        hide-on-single-page
        @current-change="getProblemSetList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        class="table_pagination"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { problemSetListRequest } from "@/request/problemSetRequest";
export default {
  data() {
    return {
      problemSetList: [],
      searchInput: "",
      currentPage: 1,
      pageSize: 8,
      total: null,
    };
  },
  created() {
    this.getProblemSetList();
  },
  methods: {
    // 获取题集列表
    getProblemSetList(currentPage = 1) {
      const params = {
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemSetListRequest(params)
        .then((response) => {
          this.currentPage = currentPage;
          this.problemSetList = response.list.filter((item) => {
            return item.region !== "set_main";
          });
          this.total = response.total;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 查看题集详情
    handleClickProblemSet(row) {
      this.$router.push({
        name: "problemSetDetail",
        params: { region: row.region },
      });
    },
  },
};
</script>
