<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建公告</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="create-form-title">新建公告</div>
      <el-divider></el-divider>
      <!-- 标题 & 发布时间 -->
      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="12">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">公告名称</span>
          </div>
          <el-input
            placeholder="请输入公告的名称"
            v-model="input_title"
            clearable
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">发布时间</span>
          </div>
          <el-date-picker
            v-model="input_release_time"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择发布时间"
            style="width: 100%"
            class="create-form-value-wrap"
          >
          </el-date-picker>
        </el-col>
      </el-row>

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">公告详情</span>
        </div>
        <mavon-editor
          v-model="input_contents"
          class="create-form-value-wrap"
        ></mavon-editor>
      </div>

      <div class="create-form-button-wrap">
        <el-button type="primary" @click="submitForm()">新建公告</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import { announceCreateRequest } from "@/request/announceRequest";
export default {
  data() {
    return {
      input_title: "",
      input_contents: "",
      input_release_time: "",
    };
  },

  methods: {
    submitForm() {
      const data = {
        title: this.input_title,
        author: window.localStorage.getItem("username"),
        contents: this.input_contents,
        release_time: this.input_release_time,
      };
      announceCreateRequest(data)
        .then(() => {
          this.$message.success("新建公告成功");
        })
        .catch(() => {
          this.$message.warning("新建公告失败");
        });
    },
  },
};
</script>
