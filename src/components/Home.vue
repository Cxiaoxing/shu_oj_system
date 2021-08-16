<template>
  <div class="homeWrap">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div style="display: flex; align-items: center">
          <img class="logoImage" src="../img/logo.svg" />
        </div>
        <div id="userCenter">
          <el-dropdown @command="handleCommand">
            <img class="user" src="../img/home/user.svg" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="user" v-if="isLogin"
                >个人中心</el-dropdown-item
              >
              <el-dropdown-item command="login" v-if="isLogin === false"
                >登录</el-dropdown-item
              >
              <el-dropdown-item command="logout" v-if="isLogin"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <!-- 页面主体 -->
      <el-container>
        <!-- 侧边栏菜单区域 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div
            id="collapse"
            style="
              cursor: pointer;
              margin-top: 10px;
              display: flex;
              justify-content: center;
              align-items: center;
            "
            @click="toggleCollapse"
          >
            <i v-if="isCollapse === false" class="el-icon-s-fold icon"></i>
            <i v-if="isCollapse === true" class="el-icon-s-unfold icon"></i>
          </div>
          <el-menu
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <!-- 首页 -->
            <el-menu-item index="/welcome">
              <i class="el-icon-s-home"></i>
              <span slot="title" style="font-family: PingFang SC">首页</span>
            </el-menu-item>
            <!-- 练习题集（对外） -->
            <el-menu-item index="/practice" id="problemSet">
              <i class="el-icon-menu"></i>
              <span slot="title" style="font-family: PingFang SC">题集</span>
            </el-menu-item>
            <!-- 竞赛（对外） -->
            <el-menu-item index="/contest" id="contest">
              <i class="el-icon-s-flag"></i>
              <span slot="title" style="font-family: PingFang SC">竞赛</span>
            </el-menu-item>
            <!-- 提交状态（对外） -->
            <el-menu-item index="/statusList" id="submission">
              <i class="el-icon-s-order"></i>
              <span slot="title" style="font-family: PingFang SC"
                >提交状态</span
              >
            </el-menu-item>
            <!-- 观看直播（对外） -->
            <el-menu-item index="/liveCard">
              <i class="el-icon-s-platform"></i>
              <span slot="title" style="font-family: PingFang SC"
                >观看直播</span
              >
            </el-menu-item>
            <!-- 用户管理 -->
            <el-submenu
              index="1"
              v-if="userRole === 'sup' || userRole === 'admin'"
            >
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span style="font-family: PingFang SC">用户管理</span>
              </template>
              <el-menu-item index="/userList" style="font-family: PingFang SC"
                >用户列表</el-menu-item
              >
            </el-submenu>
            <!-- 题库管理-->
            <el-submenu
              index="2"
              v-if="userRole === 'sup' || userRole === 'admin'"
            >
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span style="font-family: PingFang SC">题目管理</span>
              </template>
              <el-menu-item
                index="/questionBank"
                style="font-family: PingFang SC"
                >题目列表</el-menu-item
              >
              <el-menu-item index="/problemSet" style="font-family: PingFang SC"
                >题集列表</el-menu-item
              >
              <el-menu-item
                index="/createProblem"
                style="font-family: PingFang SC"
                >创建题目</el-menu-item
              >
            </el-submenu>
            <!-- 竞赛管理 -->
            <el-submenu
              index="3"
              v-if="userRole === 'sup' || userRole === 'admin'"
            >
              <template slot="title">
                <i class="el-icon-s-data"></i>
                <span style="font-family: PingFang SC">竞赛管理</span>
              </template>
              <el-menu-item
                index="/contestBank"
                style="font-family: PingFang SC"
                >竞赛列表</el-menu-item
              >
              <el-menu-item
                index="/createContest"
                style="font-family: PingFang SC"
                >创建竞赛</el-menu-item
              >
            </el-submenu>
            <!-- 直播管理 -->
            <el-submenu
              index="4"
              v-if="userRole === 'sup' || userRole === 'admin'"
            >
              <template slot="title">
                <i class="el-icon-video-camera-solid"></i>
                <span style="font-family: PingFang SC">直播管理</span>
              </template>
              <el-menu-item index="/live" style="font-family: PingFang SC"
                >创建直播</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
      <!-- 个人信息对话框 -->
      <el-dialog title="个人信息" :visible.sync="userDialogVisible" width="20%">
        <!-- 内容主体区域 -->
        <el-form :model="userInfo">
          <el-row>
            <el-form-item>
              <span slot="label">
                <i class="el-icon-user"></i>
                <span class="lableWord">账号</span>
              </span>
              <el-input v-model="userInfo.account"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <span slot="label">
                <i class="el-icon-phone-outline"></i>
                <span class="lableWord">手机</span>
              </span>
              <el-input v-model="userInfo.mobile"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
        <el-button type="primary" plain size="medium" @click="updateRequest()"
          >更新</el-button
        >
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import {
  userCheckOnlineRequest,
  userInfoRequest,
  userLogoutRequest,
} from "../request/userRequest";
export default {
  data() {
    return {
      isLogin: false,
      isCollapse: false,
      // 控制展示个人信息对话框的显示与隐藏
      userDialogVisible: false,
      // 查询到的用户信息
      userInfo: {},
      // 查询到的用户ID
      userId: "",
      // 当前登陆用户的角色
      userRole: "",
    };
  },

  created() {
    var that = this;
    userCheckOnlineRequest()
      .then(function (response) {
        if (response) {
          that.isLogin = true;
          that.userId = response.id;
          that.userRole = response.role;
          window.localStorage.setItem("isLogin", true);
          window.localStorage.setItem("id", response.id);
          window.localStorage.setItem("role", response.role);
        }
      })
      .catch(function (error) {
        console.log(error);
        window.localStorage.clear();
      });
  },
  methods: {
    // 菜单栏的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 获取用户信息
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

    //退出登录
    handleCommand(command) {
      let that = this;
      if (command === "logout") {
        userLogoutRequest()
          .then(function () {
            window.localStorage.clear();
            that.$router.push("/home");
            window.location.reload();
            that.$message({
              message: "退出登陆成功！",
              type: "success",
            });
            that.isLogin = false;
          })
          .catch(function (error) {
            that.$message({
              message: "退出登录失败！",
              type: "warning",
            });
          });
      } else if (command === "login") {
        this.$router.push("/login");
      } else if (command === "user") {
        //that.userDialogVisible = true;
        //that.getUserInfo(that.userId);
        this.$router.push("/userCenter");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.homeWrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.home-container {
  height: 100%;
}
.el-header {
  background-color: #3c4a73;
  //background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.chooseList {
  padding-bottom: 0;
}

.user {
  width: 30px;
}

.el-aside {
  background-color: #ffffff;
}
.el-main {
  background-color: #f6f9fc;
}

.toggle-button {
  cursor: pointer;
}
.lableWord {
  font-family: PingFang SC;
  margin-left: 3px;
}
.icon:hover {
  color: #3370ff;
}
.icon {
  color: #86909c;
}

.logoImage {
  width: 300px;
}
</style>