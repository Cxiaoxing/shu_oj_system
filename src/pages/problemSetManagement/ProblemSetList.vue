<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题集管理</el-breadcrumb-item>
      <el-breadcrumb-item>题集列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input
        class="singleSearchBar"
        placeholder="请输入你想要搜索的题集名称"
        v-model="searchInput"
        @keyup.enter.native="getProblemSetList()"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getProblemSetList()"
        ></el-button>
      </el-input>

      <el-table
        :data="problemSetList"
        style="margin-top: 20px"
        @row-click="jumpToProblemSetDetail"
      >
        <el-table-column
          prop="region"
          label="域"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="title"
          label="题集名称"
          min-width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="introduction"
          label="简介"
          min-width="500"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="is_released" label="发布状态" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_released"
              @click="changeReleaseStatus(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click.stop="deleteProblemSet(scope.row.region, scope.row.title)"
              v-if="scope.row.region !== 'set_main'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        hide-on-single-page
        @current-change="getProblemSetList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        class="table_pagination"
      >
      </el-pagination>
    </el-card>

    <!-- 修改题集弹窗 -->
    <el-dialog
      title="修改题集"
      :visible.sync="editProblemSetDialogVisible"
      width="50%"
    >
      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="12">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">题集域名</span>
          </div>
          <el-input
            class="create-form-value-wrap"
            v-model="editProblemSetForm.region"
            disabled
          >
          </el-input>
        </el-col>
        <el-col :span="12">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">题集名称</span>
          </div>
          <el-input
            v-model="editProblemSetForm.title"
            placeholder="请输入题集名称"
            class="create-form-value-wrap"
          ></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="12">
          <div class="create-form-switch-item">
            <!-- todo -->
            <el-switch v-model="editProblemSetForm.is_released" disabled>
            </el-switch>
            <span class="text">是否公开(该功能未完成)</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="create-form-switch-item">
            <el-switch v-model="editProblemSetForm.can_view_testcases">
            </el-switch>
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
          v-model="editProblemSetForm.introduction"
          placeholder="请输入题集简介"
          class="create-form-value-wrap"
        ></el-input>
      </div>

      <div class="create-form-button-wrap">
        <el-button type="primary" @click="modifyProblemSet()">更新</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  problemSetListRequest,
  problemSetEditRequest,
  problemSetDeleteRequest,
} from "@/request/problemSetRequest";
export default {
  data() {
    return {
      problemSetList: [],
      searchInput: "",
      currentPage: 1,
      pageSize: 8,
      total: null,
      multipleSelection: [],
      editProblemSetDialogVisible: false,
      editProblemSetForm: {
        region: "",
        title: "",
        // is_released: true,
        can_view_testcases: false,
        introduction: "",
      },
    };
  },
  created() {
    this.getProblemSetList();
  },
  methods: {
    // 获取题集列表
    getProblemSetList: function (currentPage = 1) {
      const that = this;
      const params = {
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemSetListRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.problemSetList = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 展示修改题集弹窗
    showEditDialog(row) {
      this.editProblemSetForm = {
        region: row.region,
        title: row.title,
        // is_released: row.is_released,
        can_view_testcases: row.can_view_testcases,
        introduction: row.introduction,
      };
      this.editProblemSetDialogVisible = true;
    },

    // 发起修改题集请求
    modifyProblemSet() {
      const data = {
        new_title: this.editProblemSetForm.title,
        // new_is_released: this.editProblemSetForm.is_released,
        new_can_view_testcases: this.editProblemSetForm.can_view_testcases,
        new_introduction: this.editProblemSetForm.introduction,
      };
      const that = this;
      problemSetEditRequest(this.editProblemSetForm.region, data)
        .then(function (response) {
          that.editProblemSetDialogVisible = false;
          that.getProblemSetList(that.currentPage);
          that.$message({
            message: "修改题集成功",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "修改题集失败",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 删除题集
    deleteProblemSet(problemSetId, title) {
      this.$confirm(
        "此操作将永久删除题集 【" + title + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          const that = this;
          problemSetDeleteRequest(problemSetId)
            .then(function (response) {
              that.getProblemSetList();
              that.$message({
                message: "删除成功",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "删除失败",
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

    // 改变发布状态
    changeReleaseStatus(row) {
      console.log(row);
      // const data = { target_state: probleminfo.is_released };
      // const that = this;
      // problemStatusChangeRequest(probleminfo.id, data)
      //   .then(function (response) {
      //     that.$message({
      //       message: "修改成功",
      //       type: "success",
      //     });
      //   })
      //   .catch(function (error) {
      //     that.$message({
      //       message: "修改失败",
      //       type: "warning",
      //     });
      //   });
    },

    // 查看题集详情
    jumpToProblemSetDetail(row) {
      this.$router.push({
        name: "problemSetDetailList",
        params: { region: row.region },
      });
    },
  },
};
</script>
