<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域，展示批量导入入口 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 添加用户 -->
        <el-card>
          <div style="font-size: 20px; font-weight: 400; color: #303133">
            添加用户
          </div>
          <el-divider></el-divider>
          <el-form
            :model="addUserForm"
            :rules="addUserFormRules"
            ref="addUserFormRef"
            label-width="auto"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUserForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="addUserForm.password"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirm">
              <el-input
                v-model="addUserForm.password_confirm"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addUserForm.email"></el-input>
            </el-form-item>
            <el-form-item label="学校" prop="school">
              <el-input v-model="addUserForm.school"></el-input>
            </el-form-item>
            <el-form-item label="学号" prop="student_number">
              <el-input v-model="addUserForm.student_number"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="real_name">
              <el-input v-model="addUserForm.real_name"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="role" v-if="isSup">
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
          <div class="buttonWrap">
            <el-button type="primary" @click="addUser()">添加用户</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div style="font-size: 20px; font-weight: 400; color: #303133">
            批量添加用户
          </div>
          <el-divider></el-divider>
          <el-input
            type="textarea"
            :rows="isSup ? 22 : 19"
            :placeholder="batchAddPlaceholder"
            v-model="batchAddUserText"
          >
          </el-input>
          <div class="buttonWrap">
            <el-button type="primary" @click="batchAddUser()"
              >批量添加用户</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  userRegisterRequest,
  userBatchRegisterRequest,
} from "@/request/userRequest";
import { checkEmail } from "@/assets/config";
export default {
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value === this.addUserForm.password) {
        return callback();
      }
      callback(new Error("请确保两次输入密码一致"));
    };
    return {
      // 上传的文件列表
      fileList: [],
      isSup: false,
      // 添加用户的表单数据
      addUserForm: {
        username: "",
        password: "",
        password_confirm: "",
        email: "",
        role: "",
        school: "",
        student_number: "",
        real_name: "",
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
      // 添加用户的表单验证规则对象
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        password_confirm: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: confirmPassword, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 批量导入
      batchAddPlaceholder: `请通过excel表复制粘贴批量添加用户的 学号、姓名。${"\n"}例如：${"\t"}11111111 张三${"\n\t"}22222222 李四`,
      batchAddUserText: "",
    };
  },

  created() {
    this.isSup = window.localStorage.getItem("role") === "sup";
  },
  methods: {
    // 文件上传成功提示函数
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");

      console.log(res);
    },
    // 文件上传失败提示函数
    handleError(err, file, fileList) {
      this.$message.error("文件上传失败");
    },
    // 新建用户函数
    addUser() {
      this.$refs.addUserFormRef.validate((valid) => {
        if (valid) {
          const data = {
            username: this.addUserForm.username,
            password: this.addUserForm.password,
            email: this.addUserForm.email,
            role: this.addUserForm.role,
            school: this.addUserForm.school,
            student_number: this.addUserForm.student_number,
            real_name: this.addUserForm.real_name,
          };
          const that = this;
          userRegisterRequest(data)
            .then(function (response) {
              that.$message({
                message: "添加用户成功",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "添加用户失败",
                type: "warning",
              });
              console.log(error);
            });
        }
      });
    },
    // 批量添加用户
    batchAddUser() {
      const data = {
        list: this.batchAddUserText.split("\n").map((item) => {
          const [student_number, real_name] = item.split("\t");
          return { student_number, real_name };
        }),
      };
      userBatchRegisterRequest(data)
        .then((response) => {
          this.$message({
            message: "批量添加用户成功",
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: "批量添加用户失败",
            type: "warning",
          });
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>