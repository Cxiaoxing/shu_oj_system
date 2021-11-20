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
      <!-- 搜索与添加区域 -->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input
            size="medium"
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
        <el-col :span="1" :offset="1">
          <el-button type="primary" @click="addProblemSetDialogVisible = true"
            >新建题集</el-button
          >
        </el-col>
        <el-col :span="2" :offset="10">
          <el-button
            v-if="multipleSelection.length != 0"
            type="primary"
            plain
            @click="addContestDialogVisible = true"
            >创建竞赛</el-button
          >
        </el-col>
      </el-row>

      <!-- 列表区域 -->
      <el-table
        :data="problemSetList"
        style="margin-top: 20px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="region" label="域" width="200"></el-table-column>
        <el-table-column prop="title" label="题集名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="introduction" label="简介" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 查看按钮 -->
            <el-button
              size="small"
              @click="handleClickProblem(scope.row.region)"
              >查看</el-button
            >
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="small"
              @click="
                showEditDialog(
                  scope.row.region,
                  scope.row.title,
                  scope.row.introduction
                )
              "
              >修改</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="small"
              @click="deleteProblemSet(scope.row.region, scope.row.title)"
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
        style="margin-top: 30px; text-align: center"
      >
      </el-pagination>
    </el-card>

    <!-- 新建题集弹窗 -->
    <el-dialog
      title="创建题集"
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
            v-model="addProblemSetForm.introduction"
            placeholder="请输题集简介"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button type="primary" @click="addProblemSet()">创建</el-button>
      </div>
    </el-dialog>

    <!-- 修改题集弹窗 -->
    <el-dialog
      title="修改题集"
      :visible.sync="modifyProblemSetDialogVisible"
      width="50%"
      @close="modifyProblemSetDialogClosed"
    >
      <!-- 内容主体区域 -->
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
            v-model="addProblemSetForm.introduction"
            placeholder="请输题集简介"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button type="primary" @click="modifyProblemSet()">修改</el-button>
      </div>
    </el-dialog>

    <!-- 创建竞赛弹窗 -->
    <el-dialog
      title="创建竞赛"
      :visible.sync="addContestDialogVisible"
      width="50%"
      @close="addContestDialogClosed"
    >
      <!-- 内容主体区域 -->
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
        <el-button type="primary" @click="createContest()">创建</el-button>
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
      // 获取到的题集列表
      problemSetList: [],
      // 搜索输入内容
      searchInput: "",
      // 当前页
      currentPage: 1,
      // 每页记录数
      pageSize: 10,
      // 总记录数
      total: null,
      // 多选
      multipleSelection: [],
      // 控制创建题集弹窗
      addProblemSetDialogVisible: false,
      // 控制创建竞赛弹窗
      addContestDialogVisible: false,
      // 控制修改题集弹窗
      modifyProblemSetDialogVisible: false,
      // 创建题集表单
      addProblemSetForm: {
        region: "",
        title: "",
        introduction: "",
      },
      // 创建竞赛表单
      addContestForm: {
        region: "",
        title: "",
        introduction: "",
        startTime: "",
        endTime: "",
        password: "",
      },
      // 创建题集时的表单验证规则对象
      addProblemSetFormRules: {
        region: [{ required: true, message: "请输入域名", trigger: "blur" }],
        title: [{ required: true, message: "请输入题集名称", trigger: "blur" }],
        introduction: [
          { required: false, message: "请输入题集相关介绍", trigger: "blur" },
        ],
      },
      // 创建竞赛时的表单验证规则对象
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
    // 预验证创建题集表单
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

    // 发起创建题集请求
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

    // 创建竞赛函数
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
    showEditDialog(region, title, introduction) {
      this.addProblemSetForm = {
        region: region,
        title: title,
        introduction: introduction,
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

    // 监听创建竞赛对话框的关闭事件
    addContestDialogClosed() {
      this.$refs.addContestFormRef.resetFields();
    },

    // 监听创建题集对话框的关闭事件
    addProblemSetDialogClosed() {
      this.$refs.addProblemSetFormRef.resetFields();
    },

    // 修改创建题集对话框的关闭事件
    modifyProblemSetDialogClosed() {
      this.addProblemSetForm = {
        region: "",
        title: "",
        introduction: "",
      };
    },

    //  根据困难度筛选
    filterDifficulty(value, row) {
      return row.info.difficulty === value;
    },
    // 根绝发布状态筛选
    filterReleaseStatus(value, row) {
      return row.is_released === value;
    },
    // 查看题集详情
    handleClickProblem: function (re) {
      let region = re;
      const that = this;
      that.$router.push({
        name: "problemSetDetailList",
        params: { region: region },
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.editpic {
  width: 25px;
}
.tagsLayout {
  margin-right: 5px;
}
</style>

