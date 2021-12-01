<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题集管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建题集</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="create-form-title">新建题集</div>
      <el-divider></el-divider>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="12">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">题集域名</span>
          </div>
          <el-input
            placeholder="请输入题集域名"
            v-model="region"
            class="create-form-value-wrap"
          >
            <template slot="prepend">set_</template>
          </el-input>
        </el-col>
        <el-col :span="12">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">题集名称</span>
          </div>
          <el-input
            v-model="title"
            placeholder="请输入题集名称"
            class="create-form-value-wrap"
          ></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="12">
          <div class="create-form-switch-item">
              <!-- todo -->
            <el-switch v-model="is_released" disabled> </el-switch>
            <span class="text">是否公开(该功能未完成)</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="create-form-switch-item">
            <el-switch v-model="can_view_testcases"> </el-switch>
            <span class="text">能否查看测试数据</span>
          </div>
        </el-col>
      </el-row>

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <span class="text">题集简介</span>
        </div>
        <el-input
          type="textarea"
          :rows="7"
          v-model="introduction"
          placeholder="请输入题集简介"
          class="create-form-value-wrap"
        ></el-input>
      </div>

      <div class="create-form-button-wrap">
        <el-button type="primary" @click="submitForm()">新建题集</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { problemSetCreateRequest } from "@/request/problemSetRequest";
export default {
  data() {
    return {
      region: "",
      title: "",
      is_released: true,
      can_view_testcases: false,
      introduction: "",
    };
  },
  methods: {
    // 发起新建题集请求
    submitForm() {
      const data = {
        region: "set_" + this.region,
        title: this.title,
        introduction: this.introduction,
        // is_released: this.is_released,
        can_view_testcases: this.can_view_testcases,
      };
      const that = this;
      problemSetCreateRequest(data)
        .then(function (response) {
          that.$message({
            message: "新建题集成功",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "新建题集失败",
            type: "warning",
          });
          console.log(error);
        });
    },
  },
};
</script>

<style>
</style>