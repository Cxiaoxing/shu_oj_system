<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <!-- 搜索区域 -->
      <div>
        <el-row :gutter="40">
          <el-col :span="10">
            <el-input
              placeholder="请输入想要搜索的公告标题"
              v-model="searchInput"
              @keyup.enter.native="getAnnounceList()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getAnnounceList()"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="addAnnounceDialogVisible = true"
              >新建公告</el-button
            >
          </el-col>
        </el-row>
      </div>
      <!-- 列表区域 -->
      <el-table
        :data="announceList"
        style="margin-top: 20px"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="release_time" :formatter="formatTime" label="发布时间" />
        <el-table-column prop="author" label="发布人" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="checkAnnounce(scope.row.id)"
              >查看</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="openEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteAnnounce(scope.row.id, scope.row.title)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        hide-on-single-page
        @current-change="getAnnounceList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        style="margin-top: 30px; text-align: center"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑公告弹窗 -->
    <el-dialog title="编辑公告" :visible.sync="editDialogVisible" width="80%">
      <el-row :gutter="30">
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">公告名称</span>
          </div>
          <el-input
            placeholder="请输入公告的名称"
            v-model="new_announceInfo.title"
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
            v-model="new_announceInfo.release_time"
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
          <mavon-editor
            v-model="new_announceInfo.contents"
            class="margin"
          ></mavon-editor>
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
        <el-button type="primary" @click="submitForm()">更新公告</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  announceListRequest,
  announceInfoRequest,
  announceEditRequest,
  announceDeleteRequest,
} from "@/request/announceRequest";
import moment from "moment";

export default {
  data() {
    return {
      searchInput: "",
      currentPage: 1,
      pageSize: 20,
      total: null,
      announceList: [], //公告列表
      new_announceId: "", //需要更新的id
      new_announceInfo: {}, //更新信息
      editDialogVisible: false, //编辑弹窗
    };
  },
  created() {
    this.getAnnounceList();
  },
  methods: {
    formatTime: function(row) {
      return moment(row.release_time).format("YYYY-MM-DD HH:mm:ss");
    },

    getAnnounceList(currentPage = 1) {  
      const that = this;
      const params = {
        id_order: true,
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      announceListRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.announceList = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    checkAnnounce(id) {
      this.$router.push({
        name: "announceDetail",
        params: { id },
      });
    },

    openEditDialog(id) {
      const that = this;
      announceInfoRequest(id)
        .then(function (response) {
          that.new_announceInfo = response;
          that.new_announceId = id;
          that.editDialogVisible = true;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    updateAnnounce() {
      const that = this;
      const data = {
        new_title: this.new_announceInfo.title,
        new_contents: this.new_announceInfo.contents,
        new_release_time: this.new_announceInfo.release_time,
      };
      announceEditRequest(this.new_announceId, data)
        .then(function (response) {
          that.$message({
            message: "更新公告成功！",
            type: "success",
          });
          that.getAnnounceList();
        })
        .catch(() => {
          that.$message({
            message: "更新公告失败！",
            type: "warning",
          });
        });
    },

    deleteAnnounce(id) {
      const that = this;
      announceDeleteRequest(id)
        .then(function (response) {
          that.$message({
            message: "删除公告成功！",
            type: "success",
          });
          that.getAnnounceList();
        })
        .catch(() => {
          that.$message({
            message: "删除公告失败！",
            type: "warning",
          });
        });
    },
  },
};
</script>
