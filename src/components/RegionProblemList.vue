<template>
  <div>
    <el-card style="margin-top: 20px">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="40">
        <el-col :span="20">
          <ProblemSearchBar :searchProblemList="searchProblemList" />
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary" @click="addProblemDialogVisible = true"
            >添加题目</el-button
          >
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="problemList" style="margin-top: 20px">
        <el-table-column prop="inner_id" width="80" label="ID">
        </el-table-column>
        <el-table-column prop="out_problem.info.title" label="名称">
        </el-table-column>
        <el-table-column prop="out_problem.info.tags" label="标签">
          <template slot-scope="scope">
            <el-tag
              style="margin-right: 5px"
              v-for="(item, index) in scope.row.out_problem.info.tags"
              :key="index"
              >{{ item }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="out_problem.info.difficulty" label="难度">
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
        <el-table-column prop="submit_times" label="提交次数"></el-table-column>
        <el-table-column
          prop="accept_times"
          label="通过率"
          :formatter="passingRateFormtype"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              size="small"
              @click="goProblemDetail(scope.row.out_problem.id)"
              >查看</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="small"
              @click="
                goDeleteProblem(
                  scope.row.out_problem.id,
                  scope.row.out_problem.info.title
                )
              "
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
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
    <!-- 添加题目弹窗 -->
    <addProblemDialog
      :region="region"
      :addProblemDialogVisible="addProblemDialogVisible"
      :closeDialog="closeAddProblemDialog"
    />
  </div>
</template>

<script>
import {
  problemDeleteFromRegionRequest,
  problemListFromRegionRequest,
} from "@/request/problemRequest";
import ProblemSearchBar from "./ProblemSearchBar.vue";
import AddProblemDialog from "./AddProblemDialog.vue";
export default {
  components: {
    ProblemSearchBar,
    AddProblemDialog,
  },
  props: {
    region: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      problemList: [],
      title_filter: "",
      tag_filter: [],
      difficulty_filter: "",
      currentPage: 1,
      pageSize: 10,
      total: null,
      addProblemDialogVisible: false,
    };
  },
  created() {
    this.getProblemList();
  },
  methods: {
    // 获取该region的题目列表
    getProblemList(currentPage = 1) {
      const that = this;
      const params = {
        inner_id_order: true,
        title_filter: this.title_filter,
        tag_filter: this.tag_filter,
        difficulty_filter: this.difficulty_filter,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemListFromRegionRequest(this.region, params)
        .then(function (response) {
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

    // 点击题目跳转至题目详情
    goProblemDetail(id) {
      this.$router.push({
        name: "problemDetail",
        params: { id: id },
      });
    },

    // 删除region中的题目
    goDeleteProblem(id, title) {
      this.$confirm(
        "此操作将从region中删除题目 【" + title + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          problemDeleteFromRegionRequest(this.region, id)
            .then(() => {
              this.getProblemList(this.currentPage);
              this.$message({
                message: "删除题目成功",
                type: "success",
              });
            })
            .catch(() => {
              this.$message({
                message: "删除题目失败",
                type: "warning",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 计算通过率，返回对应文字
    passingRateFormtype(row, column, cellValue) {
      if (row.submit_times == 0) {
        return 0 + ".00%";
      } else {
        return ((row.accept_times / row.submit_times) * 100).toFixed(2) + "%";
      }
    },

    // 关闭添加题目弹窗
    closeAddProblemDialog() {
      this.addProblemDialogVisible = false;
      this.getProblemList(this.currentPage);
    },
  },
};
</script>