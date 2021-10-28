<template>
  <div style="font-family: PingFang SC">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <div>
        <!-- 搜索区域与添加区域 -->
        <div>
          <el-row>
            <el-col :span="8">
              <el-input
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
            </el-col>
            <el-col :span="1" :offset="1">
              <el-button type="primary" @click="addDialogVisible = true"
                >添加用户</el-button
              >
            </el-col>
            <el-col :span="1" :offset="11">
              <el-button
                v-if="multipleSelection.length != 0"
                type="primary"
                @click="handleExport()"
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
            <el-table-column prop="account" label="账号"> </el-table-column>
            <el-table-column
              prop="mobile"
              label="手机号"
              :formatter="mobileFormtype"
            ></el-table-column>
            <el-table-column
              prop="role"
              label="角色"
              :formatter="roleFormtype"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  size="small"
                  @click="showEditDialog(scope.row.id)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  size="small"
                  @click="deleteUser(scope.row.id, scope.row.account)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            hide-on-single-page
            @current-change="getUserList"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="prev, pager, next, jumper"
            :total="total"
            style="margin-top: 30px; text-align: center"
          >
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 添加用户弹窗 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-position="left"
        size="medium"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="addUserForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select
            v-model="addUserForm.role"
            placeholder="请选择用户角色"
            size="medium"
          >
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
      </el-form>
      <el-button type="primary" plain size="medium" @click="addUser()"
        >添加用户</el-button
      >
    </el-dialog>

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
        label-position="left"
        size="medium"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="userInfo.account"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="userInfo.mobile"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
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
      </el-form>
      <el-button type="primary" plain size="medium" @click="editUser()"
        >更新</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import {
  userInfoRequest,
  userListRequest,
  userRegisterRequest,
  userEditRequest,
  userDeleteRequest,
} from "@/request/userRequest";
export default {
  data() {
    // 自定义邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback();
      }
      callback(new Error("请输入合法邮箱"));
    };
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
      if (!value || regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error("请输入合法的手机号码"));
    };

    return {
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
      // 控制修改用户信息弹窗
      editDialogVisible: false,
      // 控制添加用户弹窗
      addDialogVisible: false,
      // 控制删除用户弹窗
      deleteDialogVisible: false,
      // 多选用户
      multipleSelection: [],

      // 添加用户的表单数据
      addUserForm: {
        account: "",
        password: "",
        mobile: "",
        role: "",
      },
      // 添加用户的表单验证规则对象
      addUserFormRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      // 搜索输入内容
      searchInput: "",
      // 当前页
      currentPage: 1,
      // 每页记录数
      pageSize: 20,
      // 总记录数
      total: null,
      // 查询到的用户列表
      userlist: [],
      // 查询到的用户信息
      userInfo: {},
      // 查询到的用户ID
      userId: "",
      // 修改表单的验证规则对象
      userInfoRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        mobile: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        role: [{ required: false, message: "请输入用户角色", trigger: "blur" }],
      },
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
          const tHeader = ["用户ID", "用户名", "手机号", "用户角色"];
          const filterVal = ["id", "account", "mobile", "role"];
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
          message: "请至少选一项数据",
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

    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },

    // 获取用户列表
    getUserList: function (currentPage = 1) {
      let that = this;
      const params = {
        id_order: true,
        account_filter: this.searchInput,
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
      this.editDialogVisible = true;
    },

    //获取某个用户的具体信息
    getUserInfo(region) {
      var that = this;
      userInfoRequest(region)
        .then(function (response) {
          that.userInfo = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 预验证添加用户表单
    addUser() {
      this.$refs.addUserFormRef.validate((valid) => {
        if (valid) {
          this.addUserRequest(this.addUserForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 发起添加用户请求
    addUserRequest: function (addUserForm) {
      const data = {
        account: this.addUserForm.account,
        password: this.addUserForm.password,
        mobile: this.addUserForm.mobile,
        role: this.addUserForm.role,
      };
      let that = this;
      userRegisterRequest(data)
        .then(function (response) {
          //关闭对话框
          that.addDialogVisible = false;
          //重新获取用户列表
          that.getUserList(that.currentPage);
          // 提示用户修改成功
          that.$message({
            message: "添加用户成功！",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "添加用户失败！",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 预验证修改用户表单
    editUser() {
      this.$refs.userInfoRef.validate((valid) => {
        if (valid) {
          this.editUserRequest(this.userInfo);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 发起修改用户请求
    editUserRequest: function (userInfo) {
      const data = {
        new_account: this.userInfo.account,
        new_mobile: this.userInfo.mobile,
        new_role: this.userInfo.role,
      };
      let that = this;
      userEditRequest(this.userInfo.id, data)
        .then(function (response) {
          //关闭对话框
          that.editDialogVisible = false;
          //重新获取用户列表
          that.getUserList(that.currentPage);
          // 提示用户修改成功
          that.$message({
            message: "修改用户信息成功！",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "修改用户信息失败！",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 逐个删除用户
    deleteUser(id, account) {
      this.$confirm(
        "此操作将永久删除用户 【" + account + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let that = this;
          userDeleteRequest(id)
            .then(function (response) {
              //重新获取用户列表
              that.getUserList(that.currentPage);
              // 提示用户删除成功
              that.$message({
                message: "用户删除成功！",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "用户删除失败！",
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
      this.$confirm("此操作将永久删除所选中的用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let that = this;
          this.$axios({
            method: "delete",
            url: "/proble/",
          })
            .then(function (response) {
              //重新获取用户列表
              that.getUserList(that.currentPage);
              // 提示用户删除成功
              that.$message({
                message: "删除成功！",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "删除失败！",
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
    // 判断角色类型，返回对应文字
    roleFormtype(row, column, cellValue) {
      if (cellValue == "sup") {
        return "超级管理员";
      } else if (cellValue == "admin") {
        return "管理员";
      } else if (cellValue == "") {
        return "普通用户";
      }
    },
    //
    mobileFormtype(row, column, cellValue) {
      if (cellValue == null) {
        return "暂未绑定手机号";
      } else {
        return cellValue;
      }
    },
  },
};
</script>

<style lang='less' scoped>
.editpic {
  width: 25px;
}
</style>
