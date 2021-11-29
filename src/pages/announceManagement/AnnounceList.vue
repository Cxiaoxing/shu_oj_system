<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input
        class="singleSearchBar"
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

      <el-table
        :data="announceList"
        @row-click="jumpToAnnounceDetail"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="450" />
        <el-table-column
          prop="release_time"
          :formatter="formatTime"
          label="发布时间"
          width="250"
        />
        <el-table-column prop="author" label="发布人" min-width="150" />
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="openEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click.stop="deleteAnnounce(scope.row.id, scope.row.title)"
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
        class="table_pagination"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑公告弹窗 -->
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
        <el-button type="primary" @click="updateAnnounce()">更新公告</el-button>
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
      pageSize: 10,
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
    formatTime: function (row) {
      return moment(row.release_time).format("YYYY-MM-DD HH:mm:ss");
    },

    getAnnounceList(currentPage = 1) {
      const that = this;
      const params = {
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
        is_released: false,
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

    jumpToAnnounceDetail(row) {
      this.$router.push({
        name: "announceDetail",
        params: { id: row.id },
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
            message: "更新公告成功",
            type: "success",
          });
          that.editDialogVisible = false;
          that.getAnnounceList();
        })
        .catch(() => {
          that.$message({
            message: "更新公告失败",
            type: "warning",
          });
        });
    },

    deleteAnnounce(id, title) {
      this.$confirm(
        "此操作将永久删除公告 【" + title + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          announceDeleteRequest(id)
            .then(() => {
              this.getAnnounceList(this.currentPage);
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.$message.warning("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
  },
};
</script>
