<template>
  <el-dialog
    title="添加用户"
    :visible="addUserDialogVisible"
    width="63%"
    @close="closeDialog()"
  >
    <el-input
      style="width: 400px; margin-bottom: 10px"
      size="medium"
      placeholder="请输入想要搜索的用户名称"
      v-model="searchInput"
      @keyup.enter.native="getUserList()"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="getUserList()"
      ></el-button>
    </el-input>
    <el-table :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" width="80"> </el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        :formatter="roleFormtype"
      ></el-table-column>
      <el-table-column prop="school" label="学校"> </el-table-column>
      <el-table-column prop="student_number" label="学号"> </el-table-column>
      <el-table-column prop="real_name" label="真实姓名"> </el-table-column>
    </el-table>
    <el-pagination
      background
      hide-on-single-page
      @current-change="getUserList"
      :page-size="pageSize"
      :current-page="currentPage"
      layout="prev, pager, next, jumper"
      :total="total"
      class="table_pagination"
    >
    </el-pagination>
    <div class="buttonWrap">
      <el-button type="primary" @click="addUserRequest()">添加</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { userListRequest } from "@/request/userRequest";
import { groupAddUserRequest } from "@/request/groupRequest";

export default {
  props: {
    group_id: {
      type: Number,
      default: null,
    },
    addUserDialogVisible: {
      type: Boolean,
      default: false,
    },
    closeDialog: {
      type: Function,
    },
  },
  data() {
    return {
      searchInput: "",
      userList: [],
      currentPage: 1,
      pageSize: 5,
      total: null,
      multipleSelection: [],
      user_ids: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 搜索题目列表
    getUserList(currentPage = 1) {
      const params = {
        inner_id_order: true,
        username_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      userListRequest(params)
        .then((response) => {
          this.currentPage = currentPage;
          this.userList = response.list;
          this.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 选项改变时处理函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.user_ids = val.map((item) => item.id);
    },

    // 发起添加题目请求
    addUserRequest() {
      const data = {
        user_ids: this.user_ids,
      };
      groupAddUserRequest(this.group_id, data)
        .then(() => {
          this.$message({
            message: "添加用户成功",
            type: "success",
          });
          this.closeDialog();
        })
        .catch(() => {
          this.$message({
            message: "添加用户失败",
            type: "warning",
          });
        });
    },

    // 判断角色类型，返回对应文字
    roleFormtype(row, column, cellValue) {
      if (cellValue == "sup") {
        return "超级管理员";
      } else if (cellValue == "admin") {
        return "管理员";
      } else {
        return "普通用户";
      }
    },
  },
};
</script>
