<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div>
        <div>
          <el-row>
            <el-col :span="10">
              <el-input
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
            </el-col>
            <el-col :span="2" :offset="12">
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
            style="margin-top: 15px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="80"> </el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="role"
              label="角色"
              :formatter="roleFormtype"
            ></el-table-column>
            <el-table-column prop="school" label="学校"> </el-table-column>
            <el-table-column prop="student_number" label="学号">
            </el-table-column>
            <el-table-column prop="real_name" label="真实姓名">
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="showEditDialog(scope.row.id)"
                  >编辑</el-button
                >
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

    <!-- 修改用户信息弹窗 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="30%"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="userInfo"
        :rules="userInfoRules"
        ref="userInfoRef"
        label-width="auto"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="userInfo.password"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input
            v-model="userInfo.password_confirm"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role" v-if="isSup">
          <el-select v-model="userInfo.role" placeholder="请选择用户角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学校" prop="school">
          <el-input v-model="userInfo.school"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="student_number">
          <el-input v-model="userInfo.student_number"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="real_name">
          <el-input v-model="userInfo.real_name"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="editUser()">更新</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {
  userInfoRequest,
  userListRequest,
  userEditRequest,
  userDeleteRequest,
} from "@/request/userRequest";
import { checkEmail } from "@/assets/config";

export default {
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value === this.userInfo.password) {
        return callback();
      }
      callback(new Error("请确保两次输入密码一致"));
    };
    return {
      searchInput: "",
      currentPage: 1,
      pageSize: 8,
      total: null,
      userlist: [],

      isSup: false,
      editDialogVisible: false,
      multipleSelection: [],
      userInfo: {},
      userInfoRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password_confirm: [{ validator: confirmPassword, trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 角色选择
      options: [
        {
          value: "sup",
          label: "超级管理员",
        },
        {
          value: "admin",
          label: "管理员",
        },
        {
          value: "",
          label: "普通用户",
        },
      ],
    };
  },
  created() {
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
            "用户角色",
            "学校",
            "学号",
            "真实姓名",
          ];
          const filterVal = [
            "id",
            "username",
            "email",
            "role",
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

    // 获取用户列表
    getUserList: function (currentPage = 1) {
      const that = this;
      const params = {
        inner_id_order: true,
        username_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      userListRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.userlist = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //展示修改用户信息弹窗
    showEditDialog(id) {
      this.getUserInfo(id);
      this.isSup = window.localStorage.getItem("role") === "sup";
      this.editDialogVisible = true;
    },

    //获取某个用户的具体信息
    getUserInfo(region) {
      const that = this;
      userInfoRequest(region)
        .then(function (response) {
          const update_password = {
            password: "",
            password_confirm: "",
          };
          that.userInfo = { ...response, ...update_password };
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 预验证修改用户表单
    editUser() {
      this.$refs.userInfoRef.validate((valid) => {
        if (valid) {
          this.editUserRequest(this.userInfo);
        }
      });
    },

    // 发起修改用户请求
    editUserRequest: function (userInfo) {
      const data = {
        new_username: userInfo.username,
        new_password: userInfo.password,
        new_email: userInfo.email,
        new_role: userInfo.role,
        new_school: userInfo.school,
        new_student_number: userInfo.student_number,
        new_real_name: userInfo.real_name,
      };
      const that = this;
      userEditRequest(userInfo.id, data)
        .then(function (response) {
          //关闭对话框
          that.editDialogVisible = false;
          //重新获取用户列表
          that.getUserList(that.currentPage);
          // 提示用户修改成功
          that.$message({
            message: "修改用户信息成功",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "修改用户信息失败",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 逐个删除用户
    deleteUser(id, username) {
      this.$confirm(
        "此操作将永久删除用户 【" + username + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const that = this;
          userDeleteRequest(id)
            .then(function (response) {
              //重新获取用户列表
              that.getUserList(that.currentPage);
              // 提示用户删除成功
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

    // 批量删除用户
    mulDeleteUser() {
      // todo: 批量删除用户功能
      const that = this;
      this.$confirm("此操作将永久删除所选中的用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios({
            method: "delete",
            url: "/proble/",
          })
            .then(function (response) {
              //重新获取用户列表
              that.getUserList(that.currentPage);
              // 提示用户删除成功
              that.$message({
                message: "删除成功",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "删除失败",
                type: "warning",
              });
              console.log(error);
            });
        })
        .catch(function () {
          that.$message({
            type: "info",
            message: "已取消删除",
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
