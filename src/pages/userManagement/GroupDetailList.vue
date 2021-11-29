<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/userManagement/list' }"
        >小组列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{groupTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <div>
        <div>
          <el-row :gutter="20">
            <el-col :span="2.5" :offset="19">
              <el-button
                type="primary"
                @click="addUserDialogVisible = true"
                plain
                >添加用户</el-button
              >
            </el-col>
            <el-col :span="2.5">
              <el-button type="primary" @click="handleExport()" plain
                >导出数据</el-button
              >
            </el-col>
          </el-row>
        </div>
        <!-- 列表区域 -->
        <div>
          <el-table
            :data="userlist"
            style="margin-top: 20px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="80"> </el-table-column>
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="school" label="学校"> </el-table-column>
            <el-table-column prop="student_number" label="学号">
            </el-table-column>
            <el-table-column prop="real_name" label="真实姓名">
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteUser(scope.row.id, scope.row.username)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
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
        </div>
      </div>
    </el-card>
    <!-- 添加用户弹窗 -->
    <addUserDialog
      :group_id="id"
      :addUserDialogVisible="addUserDialogVisible"
      :closeDialog="closeAddUserDialog"
    />
  </div>
</template>

<script>
import {
  groupInfoRequest,
  groupMembersListRequest,
  groupDeleteUserRequest,
} from "@/request/groupRequest";
import AddUserDialog from "@/components/AddUserDialog.vue";

export default {
  components: {
    AddUserDialog,
  },
  data() {
    return {
      id: null,
      currentPage: 1,
      pageSize: 8,
      total: null,
      userlist: [],
      groupTitle: "",

      addUserDialogVisible: false,
      multipleSelection: [],
      userInfo: {},
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getGroupTitle();
    this.getUserList();
  },
  methods: {
    // 选项改变时处理函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 导出数据
    handleExport() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = [
            "用户ID",
            "用户名",
            "邮箱",
            "学校",
            "学号",
            "真实姓名",
          ];
          const filterVal = [
            "id",
            "username",
            "email",
            "school",
            "student_number",
            "real_name",
          ];
          const list = this.multipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
          });
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "请至少选一个用户",
          type: "warning",
        });
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    // 获取小组标题
    getGroupTitle(){
      groupInfoRequest(this.id)
        .then((response) => {
          this.groupTitle = response.title;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 获取用户列表
    getUserList: function (currentPage = 1) {
      const that = this;
      const params = {
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      groupMembersListRequest(this.id, params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.userlist = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 删除用户
    deleteUser(user_id, username) {
      this.$confirm(
        "此操作将从此小组中删除用户 【" + username + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const that = this;
          groupDeleteUserRequest(this.id, user_id)
            .then(function () {
              that.getUserList(that.currentPage);
              that.$message({
                message: "用户删除成功",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "用户删除失败",
                type: "warning",
              });
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 关闭添加用户弹窗
    closeAddUserDialog() {
      this.addUserDialogVisible = false;
      this.getUserList(this.currentPage);
    },
  },
};
</script>
