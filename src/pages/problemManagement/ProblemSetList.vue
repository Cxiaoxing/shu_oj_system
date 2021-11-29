<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库管理</el-breadcrumb-item>
      <el-breadcrumb-item>题集列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input
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
        </el-col>
        <!-- todo: 此功能后端暂时不能提供 
        <el-col :span="2.5" :offset="9">
          <el-button type="primary" @click="openAddContestDialog()" plain
            >新建竞赛</el-button
          >
        </el-col>
        -->
        <el-col :span="2" :offset="12">
          <el-button
            type="primary"
            @click="addProblemSetDialogVisible = true"
            plain
            >新建题集</el-button
          >
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table
        :data="problemSetList"
        style="margin-top: 20px"
        @selection-change="handleSelectionChange"
        @row-click="jumpToProblemSetDetail"
      >
        <!-- <el-table-column type="selection" width="55"> -->
        </el-table-column>
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
            <el-switch v-model="scope.row.is_released" @click="changeReleaseStatus(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="showEditDialog(scope.row)"
              >修改</el-button
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
      <!-- 分页 -->
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

    <!-- 新建题集弹窗 -->
    <el-dialog
      title="新建题集"
      :visible.sync="addProblemSetDialogVisible"
      width="50%"
      @close="addProblemSetDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addProblemSetForm"
        :rules="addProblemSetFormRules"
        ref="addProblemSetFormRef"
        label-width="auto"
        label-position="top"
        size="medium"
      >
        <el-form-item label="域" prop="region">
          <el-input
            placeholder="请输入题集域名"
            v-model="addProblemSetForm.region"
          >
            <template slot="prepend">set_</template>
          </el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input
            v-model="addProblemSetForm.title"
            placeholder="请输入题集名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            type="textarea"
            :rows="5"
            v-model="addProblemSetForm.introduction"
            placeholder="请输入题集简介"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="buttonWrap">
        <el-button type="primary" @click="addProblemSet()">新建</el-button>
      </div>
    </el-dialog>

    <!-- 修改题集弹窗 -->
    <el-dialog
      title="修改题集"
      :visible.sync="modifyProblemSetDialogVisible"
      width="50%"
      @close="modifyProblemSetDialogClosed"
    >
      <el-form
        :model="addProblemSetForm"
        :rules="addProblemSetFormRules"
        ref="modifyProblemSetFormRef"
        label-width="auto"
        label-position="top"
        size="medium"
      >
        <el-form-item label="域" prop="region">
          <div style="padding-left: 16px">{{ addProblemSetForm.region }}</div>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input
            v-model="addProblemSetForm.title"
            placeholder="请输入题集名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            type="textarea"
            :rows="5"
            v-model="addProblemSetForm.introduction"
            placeholder="请输入题集简介"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button type="primary" @click="modifyProblemSet()">修改</el-button>
      </div>
    </el-dialog>

    <!-- 新建竞赛弹窗 -->
    <el-dialog
      title="新建竞赛"
      :visible.sync="addContestDialogVisible"
      width="50%"
      @close="addContestDialogClosed"
    >
      <el-form
        :model="addContestForm"
        :rules="addContestFormRules"
        ref="addContestFormRef"
        label-width="auto"
        label-position="top"
        size="medium"
      >
        <el-form-item label="域" prop="region">
          <el-input
            placeholder="请输入题集域名"
            v-model="addContestForm.region"
          >
            <template slot="prepend">contest_</template>
          </el-input>
        </el-form-item>
        <el-form-item label="竞赛名称" prop="title">
          <el-input v-model="addContestForm.title"></el-input>
        </el-form-item>
        <el-form-item label="相关介绍" prop="introduction">
          <el-input
            type="textarea"
            v-model="addContestForm.introduction"
          ></el-input>
        </el-form-item>
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-form-item label="开始时间" prop="startTime">
              <div class="block">
                <el-date-picker
                  v-model="addContestForm.startTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结束时间" prop="endTime">
              <div class="block">
                <el-date-picker
                  v-model="addContestForm.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="选择开始时间"
                >
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="密码" prop="password">
              <div class="block">
                <el-input
                  v-model="addContestForm.password"
                  placeholder="请输入竞赛密码"
                >
                </el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button type="primary" @click="createContest()">新建</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { contestCreateRequest } from "@/request/contestRequest";
import {
  problemSetCreateRequest,
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
      addProblemSetDialogVisible: false,
      addContestDialogVisible: false,
      modifyProblemSetDialogVisible: false,
      // 新建题集表单
      addProblemSetForm: {
        region: "",
        title: "",
        introduction: "",
      },
      // 新建竞赛表单
      addContestForm: {
        region: "",
        title: "",
        introduction: "",
        startTime: "",
        endTime: "",
        password: "",
      },
      // 新建题集时的表单验证规则对象
      addProblemSetFormRules: {
        region: [{ required: true, message: "请输入域名", trigger: "blur" }],
        title: [{ required: true, message: "请输入题集名称", trigger: "blur" }],
        introduction: [
          { required: false, message: "请输入题集相关介绍", trigger: "blur" },
        ],
      },
      // 新建竞赛时的表单验证规则对象
      addContestFormRules: {
        region: [{ required: true, message: "请输入域名", trigger: "blur" }],
        title: [{ required: true, message: "请输入竞赛名称", trigger: "blur" }],
        introduction: [
          { required: false, message: "请输入竞赛相关介绍", trigger: "blur" },
        ],
        startTime: [
          { required: false, message: "请选择竞赛开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: false, message: "请选择竞赛开始时间", trigger: "blur" },
        ],
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

    // 预验证新建题集表单
    addProblemSet() {
      this.$refs.addProblemSetFormRef.validate((valid) => {
        if (valid) {
          this.addProblemSetRequest(this.addProblemSetForm);
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },

    // 发起新建题集请求
    addProblemSetRequest: function () {
      const data = {
        region: "set_" + this.addProblemSetForm.region,
        title: this.addProblemSetForm.title,
        introduction: this.addProblemSetForm.introduction,
      };
      const that = this;
      problemSetCreateRequest(data)
        .then(function (response) {
          //关闭对话框
          that.addProblemSetDialogVisible = false;
          //重新获取题集列表
          that.getProblemSetList(that.currentPage);
          // 提示用户新建题集成功
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

    // 发起修改题集请求
    modifyProblemSet() {
      const data = {
        new_title: this.addProblemSetForm.title,
        new_introduction: this.addProblemSetForm.introduction,
      };
      const that = this;
      problemSetEditRequest(this.addProblemSetForm.region, data)
        .then(function (response) {
          //关闭对话框
          that.modifyProblemSetDialogVisible = false;
          //重新获取题集列表
          that.getProblemSetList(that.currentPage);
          // 提示用户新建题集成功
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

    // 选项改变时处理函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },

    openAddContestDialog() {
      if (this.multipleSelection.length) {
        this.addContestDialogVisible = true;
      } else {
        this.$message({
          message: "请至少选一个题集",
          type: "warning",
        });
      }
    },

    // 新建竞赛函数
    createContest() {
      console.log(this.addContestForm.startTime);
      const data = {
        region: "contest_" + this.addContestFormm.region,
        title: this.addContestForm.title,
        introduction: this.addContestForm.introduction,
      };
      const that = this;
      contestCreateRequest(data)
        .then(function (response) {
          //关闭对话框
          that.addContestDialogVisible = false;
          // 提示用户新建题集成功
          that.$message({
            message: "新建竞赛成功",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "新建竞赛失败",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 展示修改题集弹窗
    showEditDialog(row) {
      this.addProblemSetForm = {
        region: row.region,
        title: row.title,
        introduction: row.introduction,
      };
      this.modifyProblemSetDialogVisible = true;
    },

    // 删除题目
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
              //重新获取题集列表
              that.getProblemSetList();
              // 提示用户删除成功
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

    // 监听新建竞赛对话框的关闭事件
    addContestDialogClosed() {
      this.$refs.addContestFormRef.resetFields();
    },

    // 监听新建题集对话框的关闭事件
    addProblemSetDialogClosed() {
      this.$refs.addProblemSetFormRef.resetFields();
    },

    // 修改新建题集对话框的关闭事件
    modifyProblemSetDialogClosed() {
      this.addProblemSetForm = {
        region: "",
        title: "",
        introduction: "",
      };
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
