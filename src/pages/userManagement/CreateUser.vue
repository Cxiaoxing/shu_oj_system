<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域，展示批量导入入口 -->
    <el-card class="firstCard" v-if="false">
      <div
        style="
          font-family: PingFang SC;
          font-size: 20px;
          font-weight: 400;
          color: #303133;
        "
      >
        批量添加用户
      </div>
      <el-divider></el-divider>
      <!-- todo: 改接口，展现 -->
      <el-upload
        ref="upload"
        action="http://111.229.161.159:8000/users"
        accept=".zip"
        :show-file-list="true"
        :file-list="fileList"
        :auto-upload="true"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <el-button type="primary">上传EXCEL文件</el-button>
      </el-upload>
      <!-- todo: 上传文件指引 -->
      <el-link
        class="linkWord"
        target="_blank"
        href="https://www.feishu.cn/docs/doccnw7qEdpKQ3N46ERmzSbaS5f#"
        >如何批量添加用户？</el-link
      >
    </el-card>
    <!-- 添加用户 -->
    <el-card class="secondCard">
      <div
        style="
          font-family: PingFang SC;
          font-size: 20px;
          font-weight: 400;
          color: #303133;
        "
      >
        添加用户
      </div>
      <el-divider></el-divider>
      <el-form
        :model="addUserForm"
        :rules="addUserFormRules"
        ref="addUserFormRef"
        label-position="left"
        size="medium"
        style="width: 300px"
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
      <el-button type="primary" @click="addUser()">添加用户</el-button>
    </el-card>
  </div>
</template>
<script>
import { userRegisterRequest } from "@/request/userRequest";
import { BASE_URL } from "@/assets/config";
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
      BASE_URL: BASE_URL,
      // 上传的文件列表
      fileList: [],
      // 添加用户的表单数据
      addUserForm: {
        account: "",
        password: "",
        mobile: "",
        role: "",
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
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
    };
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
    // 创建用户函数
    addUser() {
      this.$refs.addUserFormRef.validate((valid) => {
        if (valid) {
          const data = {
            account: this.addUserForm.account,
            password: this.addUserForm.password,
            mobile: this.addUserForm.mobile,
            role: this.addUserForm.role,
          };
          let that = this;
          userRegisterRequest(data)
            .then(function (response) {
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.secondCard {
  margin-top: 20px;
}
</style>