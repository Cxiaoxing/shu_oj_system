<template>
  <div class="login_box">
    <!-- 登录表单区域 -->
    <div v-if="showLoginForm">
      <div class="login_head">SHUOJ</div>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="beforeSubmitLoginForm()"
          >登录</el-button
        >
        <el-button @click="jumpToHome()">取消</el-button>
      </div>
      <!-- 注册入口 -->
      <div class="margin_top_10">
        <span style="font-size: 14px">还没有账号？</span>
        <el-link
          :underline="false"
          type="primary"
          @click="showLoginForm = false"
          >立即注册</el-link
        >
      </div>
    </div>

    <!-- 注册区域表单 -->
    <div v-else>
      <div class="login_head">SHUOJ</div>
      <el-form
        :model="registerForm"
        :rules="registerFormRules"
        ref="registerFormRef"
      >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            v-model="registerForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="registerForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="password_confirm">
          <el-input
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock"
            v-model="registerForm.password_confirm"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input
            placeholder="请输入邮箱"
            prefix-icon="el-icon-message"
            v-model="registerForm.email"
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="beforeSubmitRegisterForm()"
          >注册</el-button
        >
        <el-button @click="jumpToHome()">取消</el-button>
      </div>
      <!-- 登录入口 -->
      <div class="margin_top_10">
        <span style="font-size: 14px">已有账号？</span>
        <el-link :underline="false" type="primary" @click="showLoginForm = true"
          >立即登录</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { userLoginRequest, userRegisterRequest } from "@/request/userRequest";
import { checkEmail } from "@/assets/config";
export default {
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value === this.registerForm.password) {
        return callback();
      }
      callback(new Error("请确保两次输入密码一致"));
    };
    return {
      // 控制展示登录/注册表单
      showLoginForm: true,
      // 登录表单
      loginForm: {
        username: "",
        password: "",
      },
      // 登陆表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      // 注册表单
      registerForm: {
        username: "",
        password: "",
        password_confirm: "",
        email: "",
      },
      // 注册表单验证规则
      registerFormRules: {
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
    };
  },
  methods: {
    // 预验证登陆表单
    beforeSubmitLoginForm: function () {
      this.$refs["loginFormRef"].validate((valid) => {
        if (valid) {
          this.submitLoginForm(this.loginForm);
        }
      });
    },
    // 发起登录请求
    submitLoginForm: function (loginForm) {
      const data = {
        username: loginForm.username,
        password: loginForm.password,
      };
      const that = this;
      userLoginRequest(data)
        .then(function (response) {
          that.$message({
            message: "登陆成功",
            type: "success",
          });
          that.$router.push("/home");
        })
        .catch(function (error) {
          that.$message({
            message: "登陆失败",
            type: "warning",
          });
          console.log(error);
        });
    },

    jumpToHome() {
      this.$router.push("/home");
    },

    // 预验证注册表单
    beforeSubmitRegisterForm: function () {
      this.$refs["registerFormRef"].validate((valid) => {
        if (valid) {
          this.submitRegisterForm(this.registerForm);
        } else {
        }
      });
    },

    // 发起注册请求
    submitRegisterForm: function (registerForm) {
      const data = {
        username: registerForm.username,
        password: registerForm.password,
        email: registerForm.email,
        role: "",
      };
      const that = this;
      userRegisterRequest(data)
        .then(function () {
          // 提示用户注册成功
          that.$message({
            message: "注册成功，自动登录中...",
            type: "success",
          });
          that.submitLoginForm(that.registerForm);
        })
        .catch(function (error) {
          that.$message({
            message: "注册失败",
            type: "warning",
          });
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.login_box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 50px 80px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgb(184, 182, 182);
}

.login_head {
  font-size: 30px;
  font-weight: 400;
  margin-bottom: 10px;
}
</style>
