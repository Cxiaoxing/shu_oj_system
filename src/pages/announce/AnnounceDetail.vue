<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ announceInfo.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div class="flex_row">
        <div class="title">
          <span>{{ announceInfo.title }}</span>
        </div>
        <el-button
          v-if="userRole === 'sup' || userRole === 'admin'"
          class="edit_button"
          type="primary"
          @click="openEditDialog()"
          >编辑</el-button
        >
      </div>
      <div class="inscribe">
        <span>
          发布时间:
          {{ formatTime(announceInfo.release_time) }}</span
        >
        <span>
          更新时间:
          {{ formatTime(announceInfo.last_update_time) }}</span
        >
        <span>发布人: {{ announceInfo.author }}</span>
      </div>
      <div>
        <mavon-editor
          class="margin_top_20"
          :value="announceInfo.contents"
          :subfield="false"
          :defaultOpen="'preview'"
          :toolbarsFlag="false"
          :boxShadow="false"
        />
      </div>
    </el-card>
    <!-- 编辑弹窗 -->
    <el-dialog title="编辑公告" :visible.sync="editDialogVisible" width="80%">
      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="12">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">公告名称</span>
          </div>
          <el-input
            placeholder="请输入公告的名称"
            v-model="new_announceInfo.title"
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
            v-model="new_announceInfo.release_time"
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
          v-model="new_announceInfo.contents"
          class="create-form-value-wrap"
        ></mavon-editor>
      </div>

      <div class="create-form-button-wrap">
        <el-button type="primary" @click="submitForm()">更新公告</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  announceInfoRequest,
  announceEditRequest,
} from "@/request/announceRequest";
import { formatTime } from "@/assets/config";

export default {
  data() {
    return {
      userRole: "",
      id: 0, //接受前一个页面传来的id值
      announceInfo: {}, //展示信息
      new_announceInfo: {}, //更新信息
      editDialogVisible: false, //控制编辑弹窗
    };
  },
  created() {
    this.userRole = window.localStorage.getItem("role");
    this.id = this.$route.params.id;
    this.getAnnounceInfo(this.id);
  },
  methods: {
    formatTime,

    getAnnounceInfo(id) {
      const that = this;
      announceInfoRequest(id)
        .then(function (response) {
          console.log(response);
          that.announceInfo = response;
        })
        .catch(function (error) {
          console.log(error);
          that.$message({
            message: "查看公告详情失败",
            type: "error",
          });
        });
    },
    openEditDialog() {
      this.new_announceInfo = this.announceInfo;
      this.editDialogVisible = true;
    },
    submitForm() {
      const that = this;
      const data = {
        new_title: this.new_announceInfo.title,
        new_contents: this.new_announceInfo.contents,
        new_release_time: this.new_announceInfo.release_time,
      };
      announceEditRequest(this.id, data)
        .then(function (response) {
          that.$message({
            message: "更新公告成功",
            type: "success",
          });
          that.editDialogVisible = false;
          that.getAnnounceInfo(that.id);
        })
        .catch(() => {
          that.$message({
            message: "更新公告失败",
            type: "warning",
          });
        });
    },
  },
};
</script>

<style lang="scss" >
.title {
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-weight: 400;
  color: $title_font_color;
}

.edit_button {
  float: right;
}

.inscribe {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  color: $unimportant_font_color;
  width: 100%;
  span {
    margin: 0px 12px;
  }
}
</style>