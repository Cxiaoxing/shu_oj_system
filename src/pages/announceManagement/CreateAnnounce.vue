<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建公告</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 创建公告 -->
    <el-card class="secondCard">
      <div
        style="
          
          font-size: 20px;
          font-weight: 400;
          color: #303133;
        "
      >
        创建公告
      </div>
      <el-divider></el-divider>
      <!-- 标题 & 发布时间 -->
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">公告名称</span>
          </div>
          <el-input
            placeholder="请输入公告的名称"
            v-model="input_title"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">发布时间</span>
          </div>
          <el-date-picker
            v-model="input_release_time"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择发布时间"
            style="width: 100%"
            class="margin"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <!-- 公告描述 -->
      <div class="announceDetail">
        <div class="titleLayout">
          <img class="mustPic" src="@/assets/img/required_field.svg" />
          <span class="itemTitle">公告详情</span>
        </div>
        <!-- 富文本编辑器 -->
        <div style="margin-top: 10px">
          <mavon-editor v-model="input_contents" class="margin"></mavon-editor>
        </div>
      </div>
      <div
        style="
          margin-top: 30px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        "
      >
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

  created() {},

  methods: {
    submitForm() {
      const that = this;
      const data = {
        title: this.input_title,
        author: window.localStorage.getItem("account"),
        contents: this.input_contents,
        release_time: this.input_release_time,
      };
      announceCreateRequest(data)
        .then(function (response) {
          that
            .$confirm("新建公告成功！", {
              confirmButtonText: "查看公告",
              cancelButtonText: "知道了",
              type: "success",
            })
            .then(() => {
              that.$router.push({
                name: "announceDetail",
                params: { id: id },
              });
            });
        })
        .catch(() => {
          that.$message({
            message: "创建公告失败！",
            type: "warning",
          });
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
.announceDetail {
  margin-top: 40px;
}

.timeDetail {
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