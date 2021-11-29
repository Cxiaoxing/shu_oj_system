<template>
  <div class="form_box">
    <!-- 登录表单区域 -->
    <div v-show="showWhichForm === 'login'">
      <div class="top_title">登陆</div>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <el-form-item prop="username_or_email">
          <el-input
            placeholder="请输入用户名或邮箱"
            prefix-icon="el-icon-user"
            v-model="loginForm.username_or_email"
          ></el-input>
        </el-form-item>
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
      <div class="margin_top_10">
        <el-link
          :underline="false"
          type="primary"
          @click="switchForm('reset_password')"
          >忘记密码</el-link
        >
        <span style="margin: 0px 10px; color: #275ac0">|</span>
        <el-link
          :underline="false"
          type="primary"
          @click="switchForm('register')"
          >新用户注册</el-link
        >
      </div>
    </div>

    <!-- 注册区域表单 -->
    <div v-show="showWhichForm === 'register'">
      <div class="top_title">注册</div>
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
        <el-link :underline="false" type="primary" @click="switchForm('login')"
          >立即登录</el-link
        >
      </div>
    </div>
    <div v-show="showWhichForm === 'reset_password'">
      <div class="top_title">重置密码</div>
      <el-form
        :model="resetPasswordForm"
        :rules="resetPasswordFormRules"
        ref="resetPasswordFormRef"
      >
        <el-form-item prop="email">
          <el-input
            placeholder="请输入邮箱"
            prefix-icon="el-icon-message"
            v-model="resetPasswordForm.email"
          ></el-input>
        </el-form-item>
        <el-form-item prop="token">
          <el-row :gutter="15">
            <el-col :span="15">
              <el-input
                placeholder="请输入验证码"
                prefix-icon="el-icon-check"
                v-model="resetPasswordForm.token"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" plain @click="sendToken()">
                发送验证码
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="new_password">
          <el-input
            type="password"
            placeholder="请输入新密码"
            prefix-icon="el-icon-lock"
            v-model="resetPasswordForm.new_password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="beforeSubmitResetPasswordForm()"
          >重置密码</el-button
        >
        <el-button @click="jumpToHome()">取消</el-button>
      </div>
      <div class="margin_top_10">
        <el-link :underline="false" type="primary" @click="switchForm('login')"
          >已有用户登陆</el-link
        >
        <span style="margin: 0px 10px; color: #275ac0">|</span>
        <el-link
          :underline="false"
          type="primary"
          @click="switchForm('register')"
          >新用户注册</el-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { userLoginRequest, userRegisterRequest } from "@/request/userRequest";
import { checkEmail } from "@/assets/config";
import {
  userSendTokenRequest,
  userResetPasswordRequest,
} from "../request/userRequest";
export default {
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value === this.registerForm.password) {
        return callback();
      }
      callback(new Error("请确保两次输入密码一致"));
    };
    return {
      // 控制展示表单
      showWhichForm: "login",
      // 登录表单
      loginForm: {
        username_or_email: "",
        password: "",
      },
      loginFormRules: {
        username_or_email: [
          { required: true, message: "请输入用户名或邮箱", trigger: "blur" },
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
      // 重置密码
      resetPasswordForm: {
        email: "",
        token: "",
        new_password: "",
      },
      resetPasswordFormRules: {
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        token: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        new_password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    switchForm(flag) {
      this.$refs.loginFormRef.resetFields();
      this.$refs.registerFormRef.resetFields();
      this.$refs.resetPasswordFormRef.resetFields();
      this.showWhichForm = flag;
    },
    // 预验证登陆表单
    beforeSubmitLoginForm() {
      this.$refs["loginFormRef"].validate((valid) => {
        if (valid) {
          this.submitLoginForm(this.loginForm);
        }
      });
    },
    // 发起登录请求
    submitLoginForm(loginForm) {
      const data = {
        username_or_email: loginForm.username_or_email,
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
    beforeSubmitRegisterForm() {
      this.$refs["registerFormRef"].validate((valid) => {
        if (valid) {
          this.submitRegisterForm(this.registerForm);
        }
      });
    },

    // 发起注册请求
    submitRegisterForm(registerForm) {
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
          const loginForm = {
            username_or_email: registerForm.username,
            password: registerForm.password,
          };
          that.submitLoginForm(loginForm);
        })
        .catch(function (error) {
          that.$message({
            message: "注册失败",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 发送验证码
    sendToken() {
      userSendTokenRequest(this.resetPasswordForm.email)
        .then(() => {
          this.$message({
            message: "已发送验证码，请注意查收...",
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: "发送验证码失败【注意: 两小时之内只能发送一封验证邮件】",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 预验证重置密码表单
    beforeSubmitResetPasswordForm() {
      this.$refs["resetPasswordFormRef"].validate((valid) => {
        if (valid) {
          this.submitResetPasswordForm(this.resetPasswordForm);
        }
      });
    },

    submitResetPasswordForm(resetPasswordForm) {
      const data = {
        by_old_password: false,
        by_email: true,
        by_email_body: {
          email: resetPasswordForm.email,
          token: resetPasswordForm.token,
          new_password: resetPasswordForm.new_password,
        },
      };
      userResetPasswordRequest(data)
        .then(() => {
          this.$message({
            message: "重置密码成功",
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: "重置密码失败",
            type: "warning",
          });
          console.log(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.form_box {
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

.top_title {
  font-size: 30px;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
