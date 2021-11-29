<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建竞赛</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 新建竞赛 -->
    <el-card>
      <div class="create-form-title">新建竞赛</div>
      <el-divider></el-divider>

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">竞赛域名</span>
        </div>
        <el-input
          placeholder="请输入竞赛域名"
          v-model="region"
          class="create-form-value-wrap"
        >
          <template slot="prepend">contest_</template>
        </el-input>
      </div>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">竞赛名称</span>
          </div>
          <el-input
            placeholder="请输入竞赛名称"
            v-model="title"
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <span class="text">竞赛密码</span>
          </div>
          <el-input
            placeholder="请输入竞赛密码(可选填)"
            v-model="password"
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">竞赛类型</span>
          </div>
          <el-select
            placeholder="请选择竞赛类型"
            v-model="contestType"
            class="create-form-value-wrap"
          >
            <el-option
              v-for="item in contestTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">开始时间</span>
          </div>
          <el-date-picker
            placeholder="请选择竞赛开始时间"
            v-model="startTime"
            class="create-form-value-wrap"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">结束时间</span>
          </div>
          <el-date-picker
            placeholder="请选择竞赛结束时间"
            v-model="endTime"
            class="create-form-value-wrap"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">封榜时间</span>
          </div>
          <el-date-picker
            placeholder="请选择竞赛封榜时间"
            v-model="sealTime"
            class="create-form-value-wrap"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          >
          </el-date-picker>
        </el-col>
      </el-row>

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <span class="text">竞赛说明</span>
        </div>
        <div class="create-form-value-wrap">
          <mavon-editor v-model="introduction"></mavon-editor>
        </div>
      </div>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="view_before_start"> </el-switch>
            <span class="text">比赛开始前能查看题目</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="register_after_start"> </el-switch>
            <span class="text">比赛开始后能报名参加比赛</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="unrate_after_start"> </el-switch>
            <span class="text">比赛开始后报名能参与排名</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="view_after_end"> </el-switch>
            <span class="text">比赛结束后能查看题目</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="submit_after_end"> </el-switch>
            <span class="text">比赛结束后能提交</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="public_after_end"> </el-switch>
            <span class="text">比赛结束后题目公开</span>
          </div>
        </el-col>
      </el-row>

      <div class="create-form-button-wrap">
        <el-button type="primary" @click="submitContest()">新建竞赛</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { contestCreateRequest } from "@/request/contestRequest";
export default {
  data() {
    return {
      region: "",
      title: "",
      password: "",
      contestType: "",
      introduction: "",
      startTime: "",
      endTime: "",
      sealTime: "",
      register_after_start: true,
      unrate_after_start: true,
      view_before_start: false,
      view_after_end: true,
      public_after_end: false,
      submit_after_end: true,

      contestTypeOptions: [
        {
          label: "公开赛",
          value: "open_contest",
        },
        {
          label: "小组赛",
          value: "group_contest",
        },
      ],
    };
  },

  methods: {
    // 新建题目函数
    submitContest() {
      const data = {
        region: "contest_" + this.region,
        title: this.title,
        introduction: this.introduction,
        self_type: this.contestType,
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
      if (this.password === "" || this.password === null) {
        delete data["password"];
      }
      contestCreateRequest(data)
        .then((response) => {
          // 提示用户新建成功
          this.$message({
            message: "新建竞赛成功",
            type: "success",
          });
          const region = "contest_" + this.region;
          this.$router.push({
            name: "contestDetailList",
            params: { region },
          });
        })
        .catch(() => {
          this.$message({
            message: "新建竞赛失败",
            type: "warning",
          });
        });
    },
  },
};
</script>