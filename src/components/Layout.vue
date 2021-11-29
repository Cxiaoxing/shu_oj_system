<template>
  <div class="homeWrap">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div class="system_name">上海大学程序设计网上训练系统</div>
        <div id="userCenter">
          <el-dropdown @command="handleCommand">
            <i class="el-icon-user user_icon"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="user" v-if="isLogin"
                >个人中心</el-dropdown-item
              >
              <el-dropdown-item command="login" v-if="!isLogin"
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
          <div id="collapse" class="collapse_icon" @click="toggleCollapse">
            <i v-if="!isCollapse" class="el-icon-s-fold"></i>
            <i v-if="isCollapse" class="el-icon-s-unfold"></i>
          </div>
          <el-menu
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
          >
            <!-- 首页 -->
            <el-menu-item index="/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- 题库（对外） -->
            <el-menu-item index="/practice" id="practice">
              <i class="el-icon-menu"></i>
              <span slot="title">题库</span>
            </el-menu-item>
            <!-- 题集（对外） -->
            <el-menu-item index="/problemSet" id="problemSet">
              <i class="el-icon-s-grid"></i>
              <span slot="title">题集</span>
            </el-menu-item>
            <!-- 竞赛（对外） -->
            <el-menu-item index="/contest" id="contest">
              <i class="el-icon-s-flag"></i>
              <span slot="title">竞赛</span>
            </el-menu-item>
            <!-- 提交状态（对外） -->
            <el-menu-item index="/submissionStatus" id="submission">
              <i class="el-icon-s-order"></i>
              <span slot="title">提交状态</span>
            </el-menu-item>
            <!-- todo: 观看直播（对外） -->
            <!-- <el-menu-item index="/liveCard">
              <i class="el-icon-s-platform"></i>
              <span slot="title"
                >观看直播</span
              >
            </el-menu-item> -->

            <!-- 用户管理 -->
            <el-submenu index="1" v-if="isAdminRole">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/userManage/list">用户列表</el-menu-item>
              <el-menu-item index="/userManage/create">添加用户</el-menu-item>
              <el-menu-item index="/userManage/groupList"
                >小组列表</el-menu-item
              >
            </el-submenu>
            <!-- 题库管理-->
            <el-submenu index="2" v-if="isAdminRole">
              <template slot="title">
                <i class="el-icon-s-help"></i>
                <span>题目管理</span>
              </template>
              <el-menu-item index="/problemManage/list">题目列表</el-menu-item>
              <el-menu-item index="/problemManage/create"
                >新建题目</el-menu-item
              >
              <el-menu-item index="/problemManage/setList"
                >题集列表</el-menu-item
              >
            </el-submenu>
            <!-- 竞赛管理 -->
            <el-submenu index="3" v-if="isAdminRole">
              <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>竞赛管理</span>
              </template>
              <el-menu-item index="/contestManage/list">竞赛列表</el-menu-item>
              <el-menu-item index="/contestManage/create"
                >新建竞赛</el-menu-item
              >
            </el-submenu>
            <!-- todo: 直播管理 -->
            <!-- <el-submenu
              index="4"
              v-if="isAdminRole"
            >
              <template slot="title">
                <i class="el-icon-video-camera-solid"></i>
                <span>直播管理</span>
              </template>
              <el-menu-item index="/liveManage/live"
                >新建直播</el-menu-item
              >
            </el-submenu> -->
            <!-- 公告管理 -->
            <el-submenu index="5" v-if="isAdminRole">
              <template slot="title">
                <i class="el-icon-message-solid"></i>
                <span>公告管理</span>
              </template>
              <el-menu-item index="/announceManage/list">公告列表</el-menu-item>
              <el-menu-item index="/announceManage/create"
                >新建公告</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main style="background-color: #fcfcfc">
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {
  userCheckOnlineRequest,
  userInfoRequest,
  userLogoutRequest,
} from "@/request/userRequest";
export default {
  data() {
    return {
      isLogin: false,
      isCollapse: false,
      isAdminRole: false,
    };
  },

  created() {
    this.checkIsLogin();
  },
  updated() {
    this.checkIsLogin();
  },
  methods: {
    // 用户是否登陆
    checkIsLogin() {
      const that = this;
      userCheckOnlineRequest()
        .then(function (response) {
          if (response) {
            that.isLogin = true;
            that.isAdminRole =
              response.role === "sup" || response.role === "admin";
            window.localStorage.setItem("isLogin", true);
            window.localStorage.setItem("id", response.id);
            window.localStorage.setItem("role", response.role);
            that.getUserInfo(response.id);
          }
        })
        .catch(function () {
          that.isLogin = false;
          that.isAdminRole = false;
          window.localStorage.clear();
        });
    },

    // 菜单栏的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    // 获取用户信息
    getUserInfo(id) {
      userInfoRequest(id)
        .then(function (response) {
          window.localStorage.setItem("username", response.username);
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //退出登录
    handleCommand(command) {
      switch (command) {
        case "user":
          this.$router.push("/userCenter");
          break;
        case "login":
          this.$router.push("/login");
          break;
        case "logout":
          userLogoutRequest()
            .then(() => {
              this.$router.push("/home");
              window.location.reload();
              this.$message({
                message: "退出登陆成功",
                type: "success",
              });
            })
            .catch(() => {
              this.$message({
                message: "退出登录失败",
                type: "warning",
              });
            });
          break;
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.homeWrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.home-container {
  height: 100%;
  .el-header {
    background-color: $key_title_color;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.system_name {
  color: white;
  font-size: 20px;
}

.user_icon {
  color: white;
  font-size: 30px;
}

.collapse_icon {
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  i:hover {
    color: $key_color;
  }
  i {
    color: $unimportant_font_color;
  }
}
</style>