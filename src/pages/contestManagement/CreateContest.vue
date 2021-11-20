<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛管理</el-breadcrumb-item>
      <el-breadcrumb-item>创建竞赛</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 创建竞赛 -->
    <el-card class="secondCard">
      <div
        style="
          
          font-size: 20px;
          font-weight: 400;
          color: #303133;
        "
      >
        创建竞赛
      </div>
      <el-divider></el-divider>
      <!-- 域、标题-->
      <el-row :gutter="30" style="margin-top: 20px">
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">域</span>
          </div>
          <el-input
            placeholder="请输入竞赛域名"
            v-model="input_region"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
            <template slot="prepend">contest_</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">竞赛名称</span>
          </div>
          <el-input
            placeholder="请输入竞赛的名称"
            v-model="input_title"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
      </el-row>
      <!-- 竞赛描述 -->
      <div class="problemDetail">
        <div class="titleLayout">
          <span class="itemTitle">相关介绍</span>
        </div>
        <!-- 富文本编辑器 -->
        <div style="margin-top: 10px">
          <mavon-editor
            v-model="input_introduction"
            class="margin"
          ></mavon-editor>
        </div>
      </div>
      <!-- 时间、密码 -->
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 开始时间 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">开始时间</span>
          </div>
          <div class="block">
            <el-date-picker
              v-model="startTime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择开始时间"
              class="margin"
            >
            </el-date-picker>
          </div>
        </el-col>
        <!-- 结束时间 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">结束时间</span>
          </div>
          <el-date-picker
            v-model="endTime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择结束时间"
            class="margin"
          >
          </el-date-picker>
        </el-col>
        <!-- 封榜时间 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">封榜时间</span>
          </div>
          <el-date-picker
            v-model="sealTime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择封榜时间"
            class="margin"
          >
          </el-date-picker>
        </el-col>
        <!-- 竞赛密码 -->
        <el-col :span="6">
          <div class="titleLayout">
            <span class="itemTitle">竞赛密码</span>
          </div>
          <el-input
            v-model="password"
            placeholder="请输入竞赛密码"
            class="margin"
          >
          </el-input>
        </el-col>
      </el-row>
      <!-- settings选择-->
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 比赛开始后是否能注册参加比赛 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛开始后是否能注册参加比赛</span>
          </div>
          <el-switch v-model="register_after_start" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛开始后注册是否参与排名 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛开始后注册是否参与排名</span>
          </div>
          <el-switch v-model="unrate_after_start" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛开始前是否能查看题目 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛开始前是否能查看题目</span>
          </div>
          <el-switch v-model="view_before_start" class="margin"> </el-switch>
        </el-col>
      </el-row>
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 比赛结束后是否能查看题目 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛结束后是否能查看题目</span>
          </div>
          <el-switch v-model="view_after_end" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛结束后是否公开 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛结束后是否公开</span>
          </div>
          <el-switch v-model="public_after_end" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛结束后是否还能提交 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛结束后是否还能提交</span>
          </div>
          <el-switch v-model="submit_after_end" class="margin"> </el-switch>
        </el-col>
      </el-row>
      <div
        style="
          margin-top: 30px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        "
      >
        <el-button type="primary" @click="submitContest()">创建竞赛</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import {contestCreateRequest} from '@/request/contestRequest'
export default {
  data() {
    return {
      // 创建竞赛时的域
      input_region: "",
      // 新建竞赛时的标题
      input_title: "",
      // 新建竞赛时的介绍
      input_introduction: "",
      // 新建竞赛时的时间
      startTime: "",
      endTime: "",
      sealTime: "",
      // 新建竞赛时的密码
      password: "",
      // 创建竞赛时的settings
      register_after_start: true,
      unrate_after_start: true,
      view_before_start: false,
      view_after_end: true,
      public_after_end: false,
      submit_after_end: true,
    };
  },

  created() {},

  methods: {
    // 创建题目函数
    submitContest() {
      var data = {};
      if (this.password != "" && this.password != null) {
        data = {
          region: "contest_" + this.input_region,
          title: this.input_title,
          introduction: this.input_introduction,
          start_time: this.startTime,
          end_time: this.endTime,
          seal_time: this.sealTime,
          password: this.password,
          settings: {
            register_after_start: this.register_after_start,
            unrate_after_start: this.unrate_after_start,
            view_before_start: this.view_before_start,
            view_after_end: this.view_after_end,
            public_after_end: this.public_after_end,
            submit_after_end: this.submit_after_end,
          },
        };
      } else {
        data = {
          region: "contest_" + this.input_region,
          title: this.input_title,
          introduction: this.input_introduction,
          start_time: this.startTime,
          end_time: this.endTime,
          seal_time: this.sealTime,
          settings: {
            register_after_start: this.register_after_start,
            unrate_after_start: this.unrate_after_start,
            view_before_start: this.view_before_start,
            view_after_end: this.view_after_end,
            public_after_end: this.public_after_end,
            submit_after_end: this.submit_after_end,
          },
        };
      }
      const that = this;
      contestCreateRequest(data)
        .then(function (response) {
          // 提示用户创建成功
          that.$message({
            message: "创建竞赛成功",
            type: "success",
          });
          var region = "contest_"+that.input_region;
          that.$router.push({
            name: "contestDetailList",
            params: { region: region},
          });
        })
        .catch(function (error) {
          that.$message({
            message: "创建竞赛失败",
            type: "warning",
          });
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.secondCard {
  margin-top: 20px;
}

.mustPic {
  width: 25px;
}

.titleLayout {
  display: flex;
  flex-direction: row;
  align-items: center;
  //width: 100px;
}
.problemDetail {
  margin-top: 40px;
}

.sampleDetail {
  margin-top: 40px;
}

.itemTitle {
  
  font-size: 15px;
  color: #494747;
}

.margin {
  margin-top: 10px;
}
</style>