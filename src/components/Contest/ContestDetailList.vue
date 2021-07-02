<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/contestBank' }"
        >竞赛列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ region }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card style="margin-top: 20px">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input size="medium" placeholder="请输入你想要搜索的题目名称" v-model="searchInput"
            @keyup.enter.native="getContestDetailList()">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary" @click="addProblem">添加题目</el-button>
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table :data="contestDetailList" style="margin-top: 20px">
        <el-table-column prop="inner_id" width="80" label="ID">
        </el-table-column>
        <el-table-column prop="out_problem.info.title" label="名称">
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
              @click="goDeleteProblem(scope.row.inner_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        hide-on-single-page
        @current-change="getContestDetailList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        style="margin-top: 30px; text-align: center"
      >
      </el-pagination>
    </el-card>
    <!-- 添加题目弹窗 -->
    <el-dialog
      title="添加题目"
      :visible.sync="addProblemDialogVisible"
      width="70%"
      @close="addProblemDialogClosed"
    >
      <!-- 内容主体区域 -->
      <!-- 搜索区域 -->
      <div>
        <el-row>
          <el-col :span="10">
            <el-input
              placeholder="请输入想要搜索的题目名称"
              v-model="searchInput1"
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
      <el-table
        :data="addProblemList"
        style="margin-top: 20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="info.title" label="题目"> </el-table-column>
        <el-table-column prop="info.tags" label="标签">
          <template slot-scope="scope">
            <el-tag
              class="tagsLayout"
              v-for="(item, index) in scope.row.info.tags"
              :key="index"
              >{{ item }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="info.difficulty"
          label="难度"
          :filters="[
            { text: '入门', value: 0.0 },
            { text: '简单', value: 2.5 },
            { text: '中等', value: 5.0 },
            { text: '困难', value: 7.5 },
          ]"
          :filter-method="filterDifficulty2"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              type="info"
              v-if="
                scope.row.info.difficulty >= 0 &&
                scope.row.info.difficulty < 2.5
              "
              >入门
            </el-tag>
            <el-tag
              effect="dark"
              type="success"
              v-if="
                scope.row.info.difficulty >= 2.5 &&
                scope.row.info.difficulty < 5.0
              "
              >简单
            </el-tag>
            <el-tag
              effect="dark"
              type="warning"
              v-if="
                scope.row.info.difficulty >= 5.0 &&
                scope.row.info.difficulty < 7.5
              "
              >中等
            </el-tag>
            <el-tag
              effect="dark"
              type="danger"
              v-if="
                scope.row.info.difficulty >= 7.5 &&
                scope.row.info.difficulty < 10.0
              "
              >困难
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="addProblemRequest()"
          >添加</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "contestDetailList",
  data() {
    return {
      // 接受前一个页面传来的 region
      region: "",
      // 获取到该题集的题目列表
      contestDetailList: [],
      // 搜索输入内容
      searchInput: "",
      // 当前页
      currentPage: 1,
      // 每页记录数
      pageSize: 20,
      // 总记录数
      total: null,
      // 多选
      multipleSelection: [],
      problem_ids: [],
      // 控制添加题目弹窗
      addProblemDialogVisible: false,
      // 获取到的所有题目列表
      addProblemList: [],
      searchInput1: "",
    };
  },
  created() {
    this.region = this.$route.params.region;
    this.getContestDetailList();
  },
  methods: {
    // 搜索题目列表
    getProblemList: function () {
      var that = this;
      this.$axios({
        method: "get",
        url: "/problems",
        params: {
          id_order: true,
          title_filter: this.searchInput1,
          limit: 100,
          offset: 0,
        },
      })
        .then(function (response) {
          console.log(response.data);
          that.addProblemList = response.data.list;
          that.total = response.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 获取该竞赛的题目列表
    getContestDetailList(currentPage = 1) {
      var that = this;
      this.$axios({
        method: "get",
        url: "/regions/" + this.region,
        params: {
          inner_id_order: true,
          title_filter: this.searchInput,
          limit: this.pageSize,
          offset: this.pageSize * (currentPage - 1),
        },
      })
        .then(function (response) {
          that.currentPage = currentPage;
          that.contestDetailList = response.data.list;
          that.total = response.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 点击题目跳转至题目详情
    goProblemDetail(pid) {
      let id = pid;
      let that = this;
      that.$router.push({ name: "problem", params: { id: id } });
    },

    // 删除竞赛中的题目
    goDeleteProblem(id) {
      var that = this;
      this.$axios({
        method: "delete",
        url: "/regions/" + this.region + "/" + id,
      })
        .then(function (response) {
          that.getContestDetailList(that.currentPage);
          that.$message({
            message: "删除题目成功！",
            type: "success",
          });
        })
        .catch(function (error) {
          // console.log(error);
          that.$message({
            message: "删除题目失败！",
            type: "warning",
          });
        });
    },

    // 选项改变时处理函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.problem_ids = [];
      for (var i = 0; i < val.length; i++) {
        this.problem_ids.push(val[i].id);
      }
    },

     //  根据困难度筛选
    filterDifficulty(value, row) {
      return (
        row.out_problem.info.difficulty >= value &&
        row.out_problem.info.difficulty < value + 2.5
      );
    },

    filterDifficulty2(value, row) {
      return row.info.difficulty >= value && row.info.difficulty < value + 2.5;
    },

    addProblemDialogClosed() {
      // this.$refs.addUserFormRef.resetFields();
    },

    // 打开添加题目弹窗
    addProblem() {
      let that = this;
      that.addProblemDialogVisible = true;
      that.getProblemList();
    },

    addProblemRequest() {
      const data = {
        problem_ids: this.problem_ids,
      };
      console.log(this.multipleSelection);
      const myHeaders = {
        "Content-Type": "application/json",
      };
      let that = this;
      this.$axios({
        method: "post",
        url: "/regions/" + that.region,
        headers: myHeaders,
        data: JSON.stringify(data),
      })
        .then(function (response) {
          //关闭对话框
          that.addProblemDialogVisible = false;
          //重新获取竞赛题目列表
          that.getContestDetailList(that.currentPage = 1);
          // 提示添加题目成功
          that.$message({
            message: "添加题目成功！",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "添加题目失败！",
            type: "warning",
          });
          console.log(error);
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
  },
};
</script>

<style lang='less' scoped>
.editpic {
  width: 25px;
}
.tagsLayout {
  margin-right: 5px;
}
</style>

