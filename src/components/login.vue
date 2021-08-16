<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 左侧插画 -->
      <img
        class="login_picture"
        src="https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/login.svg"
      />
      <!-- 登录表单区域 -->
      <div class="login_form" v-if="showLoginForm">
        <div class="login_word">SHUOJ</div>
        <el-form
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
          class="login_input"
        >
          <!-- 账号 -->
          <el-form-item class="login_input_item" prop="account">
            <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model="loginForm.account"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item class="login_input_item" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model="loginForm.password"
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="login_button">
            <el-button type="primary" @click="submitLoginForm()"
              >登录</el-button
            >
            <el-button>取消</el-button>
          </el-form-item>
          <!-- 注册入口 -->
          <div
            style="
              width: 150px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <span style="font-size: 14px">还没有账号？</span>
            <el-link
              :underline="false"
              type="primary"
              @click="showLoginForm = false"
              >立即注册</el-link
            >
          </div>
        </el-form>
      </div>
      <!-- 注册区域表单 -->
      <div class="register_form" v-if="showLoginForm === false">
        <div class="login_word">SHUOJ</div>
        <el-form
          :model="registerForm"
          :rules="registerFormRules"
          ref="registerFormRef"
          class="register_input"
        >
          <!-- 账号 -->
          <el-form-item class="register_input_item" prop="account">
            <el-input
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              v-model="registerForm.account"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item class="register_input_item" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              v-model="registerForm.password"
            ></el-input>
          </el-form-item>
          <!-- 手机号 -->
          <el-form-item class="register_input_item" prop="mobile">
            <el-input
              type="password"
              placeholder="请输入手机号"
              prefix-icon="el-icon-lock"
              v-model="registerForm.mobile"
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="register_button">
            <el-button type="primary" @click="submitRegisterForm()"
              >注册</el-button
            >
          </el-form-item>
          <!-- 登录入口 -->
          <div
            style="
              width: 130px;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <span style="font-size: 14px">已有帐号</span>
            <el-link
              :underline="false"
              type="primary"
              @click="showLoginForm = true"
              >立即登录</el-link
            >
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { userLoginRequest, userRegisterRequest } from "../request/userRequest";
export default {
  name: "login",
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
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      // 返回一个错误提示
      callback(new Error("请输入合法的手机号码"));
    };

    return {
      // 控制展示登录/注册表单
      showLoginForm: true,
      // 登录表单
      loginForm: {
        account: "",
        password: "",
      },
      // 登录表单验证规则
      loginFormRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },

      // 注册表单
      registerForm: {
        account: "",
        password: "",
        mobile: "",
        role: "",
      },
      // 注册表达验证规则
      registerFormRules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mobile: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 预验证登陆表单
    submitLoginForm: function () {
      this.$refs["loginFormRef"].validate((valid) => {
        if (valid) {
          this.loginRequest(this.loginForm);
        } else {
          this.$message({
            message: "请输入用户名或密码！",
            type: "warning",
          });
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 发起登录请求
    loginRequest: function (loginForm) {
      const data = {
        account: loginForm.account,
        password: loginForm.password,
      };
      let that = this;
      userLoginRequest(data)
        .then(function (response) {
          that.$message({
            message: "登陆成功！",
            type: "success",
          });
          that.$router.push("/home");
        })
        .catch(function (error) {
          that.$message({
            message: "用户名或密码错误！",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 预验证注册表单
    submitRegisterForm: function () {
      this.$refs.registerFormRef.validate((valid) => {
        if (valid) {
          this.registerRequest(this.registerForm);
        } else {
          this.$message({
            message: "请输入用户名或密码！",
            type: "warning",
          });
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 发起注册请求
    registerRequest: function (registerForm) {
      const data = {
        account: this.registerForm.account,
        password: this.registerForm.password,
        mobile: this.registerForm.mobile,
        role: this.registerForm.role,
      };
      let that = this;
      userRegisterRequest(data)
        .then(function (response) {
          //展示登录界面
          that.showLoginForm = true;
          // 提示用户注册成功
          that.$message({
            message: "注册成功！",
            type: "success",
          });
          that.loginRequest(that.registerForm);
        })
        .catch(function (error) {
          that.$message({
            message: "注册失败！",
            type: "warning",
          });
          console.log(error);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  background-size: 100%;
  font-family: PingFang SC;
}

.login_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 600px;
  height: 400px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px rgb(184, 182, 182);
}
.login_picture {
  width: 350px;
  // margin-left: -50px;
}

.login_form {
  margin-right: 50px;
}
.login_word {
  font-family: PingFang SC;
  font-size: 30px;
  font-weight: 400;
}
.login_input {
  margin-top: 20px;
}
.login_input_item {
  display: flex;
  flex-direction: row;
}

.register_form {
  margin-right: 50px;
}

.register_input {
  margin-top: 20px;
}

.register_input_item {
  display: flex;
  flex-direction: row;
}
</style>
