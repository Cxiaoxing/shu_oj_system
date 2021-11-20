<template>
  <el-dialog
    title="添加题目"
    :visible.sync="addProblemDialogVisible"
    width="63%"
    @close="closeDialog"
  >
    <ProblemSearchBar :searchProblemList="searchProblemList" />
    <el-table :data="problemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="70"> </el-table-column>
      <el-table-column prop="id" label="ID" width="100"> </el-table-column>
      <el-table-column prop="info.title" label="题目"> </el-table-column>
      <el-table-column prop="info.tags" label="标签">
        <template slot-scope="scope">
          <el-tag
            style="margin-right: 5px"
            v-for="(item, index) in scope.row.info.tags"
            :key="index"
            >{{ item }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="info.difficulty" label="难度" width="180">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            type="info"
            v-if="scope.row.info.difficulty < 2.5"
            >Navie
          </el-tag>
          <el-tag
            effect="dark"
            type="success"
            v-else-if="scope.row.info.difficulty < 5.0"
            >Easy
          </el-tag>
          <el-tag
            effect="dark"
            type="warning"
            v-else-if="scope.row.info.difficulty < 7.5"
            >Middle
          </el-tag>
          <el-tag effect="dark" type="danger" v-else>Hard </el-tag>
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
      style="margin-top: 30px; text-align: center"
    >
    </el-pagination>
    <div style="width: 100%; display: flex; justify-content: flex-end">
      <el-button
        type="primary"
        style="margin-top: 20px"
        @click="addProblemRequest()"
        >添加</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import {
  problemListPrivateRequest,
  ProblemAddRegionRequest,
} from "@/request/problemRequest";
import ProblemSearchBar from "@/components/ProblemSearchBar.vue";

export default {
  props: {
    region: {
      type: String,
      false: "",
    },
    addProblemDialogVisible: {
      type: Boolean,
      default: false,
    },
    closeDialog: {
      type: Function,
      default: () => {},
    },
  },
  components: {
    ProblemSearchBar,
  },
  data() {
    return {
      title_filter: "",
      tag_filter: [],
      difficulty_filter: "",
      problemList: [],
      currentPage: 1,
      pageSize: 5,
      total: null,
      multipleSelection: [],
      problem_ids: [],
    };
  },
  created() {
    this.getProblemList();
  },
  methods: {
    // 搜索题目列表
    getProblemList(currentPage = 1) {
      const that = this;
      const params = {
        id_order: true,
        title_filter: this.title_filter,
        tag_filter: this.tag_filter,
        difficulty_filter: this.difficulty_filter,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemListPrivateRequest(params)
        .then(function (response) {
          console.log(response);
          that.currentPage = currentPage;
          that.problemList = response.list;
          that.total = response.total;
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

    // 选项改变时处理函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.problem_ids = val.map((item) => item.id);
    },

    // 发起添加题目请求
    addProblemRequest() {
      const data = {
        problem_ids: this.problem_ids,
      };
      ProblemAddRegionRequest(this.region, data)
        .then(() => {
          this.$message({
            message: "添加题目成功",
            type: "success",
          });
          this.closeDialog();
        })
        .catch(() => {
          this.$message({
            message: "添加题目失败",
            type: "warning",
          });
        });
    },
  },
};
</script>
