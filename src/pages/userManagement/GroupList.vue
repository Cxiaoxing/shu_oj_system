<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>小组列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input
              placeholder="请输入想要搜索的小组名称"
              v-model="searchInput"
              @keyup.enter.native="getGroupList()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getGroupList()"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="2.5" :offset="9">
            <el-button
              type="primary"
              @click="addGroupDialogVisible = true"
              plain
              >新建小组</el-button
            >
          </el-col>
          <el-col :span="2.5">
            <el-button type="primary" @click="handleExport()" plain
              >导出数据</el-button
            >
          </el-col>
        </el-row>
        <el-table
          :data="grouplist"
          style="margin-top: 20px"
          @selection-change="handleSelectionChange"
          @row-click="jumpToGroupDetail"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="id" label="ID" width="80"> </el-table-column>
          <el-table-column prop="title" label="小组标题"> </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click.stop="showEditDialog(scope.row.id)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click.stop="deleteGroup(scope.row.id, scope.row.title)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          hide-on-single-page
          @current-change="getGroupList"
          :page-size="pageSize"
          :current-page="currentPage"
          layout="prev, pager, next, jumper"
          :total="total"
          class="table_pagination"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 新建小组信息弹窗 -->
    <el-dialog
      title="新建小组"
      :visible.sync="addGroupDialogVisible"
      width="50%"
    >
      <el-form :model="addGroupForm" label-width="auto">
        <el-form-item label="小组标题" prop="title" :required="true">
          <el-input v-model="addGroupForm.title"></el-input>
        </el-form-item>
        <el-form-item label="小组介绍" prop="introduction">
          <el-input
            type="textarea"
            :rows="5"
            v-model="addGroupForm.introduction"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="buttonWrap">
        <el-button type="primary" @click="createGroup()">新建小组</el-button>
      </div>
    </el-dialog>

    <!-- 修改小组信息弹窗 -->
    <el-dialog
      title="修改小组信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form :model="groupInfo" label-width="auto">
        <el-form-item label="小组标题" prop="title" :required="true">
          <el-input v-model="groupInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="小组介绍" prop="introduction">
          <el-input
            type="textarea"
            :rows="5"
            v-model="groupInfo.introduction"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="buttonWrap">
        <el-button type="primary" @click="editGroup()">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  groupInfoRequest,
  groupListRequest,
  groupCreateRequest,
  groupEditRequest,
  groupDeleteRequest,
} from "@/request/groupRequest";

export default {
  data() {
    return {
      searchInput: "",
      currentPage: 1,
      pageSize: 8,
      total: null,
      grouplist: [],

      addGroupDialogVisible: false,
      editDialogVisible: false,
      multipleSelection: [],
      addGroupForm: {},
      groupInfo: {},
    };
  },
  created() {
    this.getGroupList();
  },
  methods: {
    // 选项改变时处理函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 导出数据
    handleExport() {
      if (this.multipleSelection.length) {
        this.downloadLoading = true;
        import("@/vendor/Export2Excel").then((excel) => {
          const tHeader = ["小组ID", "小组名"];
          const filterVal = ["id", "title"];
          const list = this.multipleSelection;
          const data = this.formatJson(filterVal, list);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.filename,
          });
          this.downloadLoading = false;
        });
      } else {
        this.$message({
          message: "请至少选一个小组",
          type: "warning",
        });
      }
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    // 获取小组列表
    getGroupList: function (currentPage = 1) {
      const params = {
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      groupListRequest(params)
        .then((response) => {
          this.currentPage = currentPage;
          this.grouplist = response.list;
          this.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    //展示修改小组信息弹窗
    showEditDialog(id) {
      this.getGroupInfo(id);
      this.editDialogVisible = true;
    },

    //获取某个小组的具体信息
    getGroupInfo(id) {
      groupInfoRequest(id)
        .then((response) => {
          this.groupInfo = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 新建小组表单
    createGroup() {
      groupCreateRequest(this.addGroupForm)
        .then(() => {
          this.addGroupDialogVisible = false;
          this.getGroupList(this.currentPage);
          this.$message({
            message: "新建小组成功",
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: "新建小组失败",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 修改小组表单
    editGroup() {
      const data = {
        new_title: this.groupInfo.title,
        new_introduction: this.groupInfo.introduction,
      };
      groupEditRequest(this.groupInfo.id, data)
        .then(() => {
          this.editDialogVisible = false;
          this.getGroupList(this.currentPage);
          this.$message({
            message: "修改小组信息成功",
            type: "success",
          });
        })
        .catch((error) => {
          this.$message({
            message: "修改小组信息失败",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 跳转到小组详情页面
    jumpToGroupDetail(row) {
      this.$router.push({ name: "groupDetailList", params: { id: row.id } });
    },
    // 删除小组
    deleteGroup(id, title) {
      this.$confirm(
        "此操作将永久删除小组 【" + title + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          groupDeleteRequest(id)
            .then(() => {
              this.getGroupList(this.currentPage);
              this.$message({
                message: "小组删除成功",
                type: "success",
              });
            })
            .catch((error) => {
              this.$message({
                message: "小组删除失败",
                type: "warning",
              });
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
