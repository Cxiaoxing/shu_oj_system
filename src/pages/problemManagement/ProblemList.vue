<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题目管理</el-breadcrumb-item>
      <el-breadcrumb-item>题目列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示题目列表 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input
            placeholder="请输入想要搜索的题目名称"
            v-model="searchInput"
            @keyup.enter.native="getProblemList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getProblemList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2" :offset="10">
          <el-button
            v-if="multipleSelection.length != 0"
            type="primary"
            plain
            @click="addProblemSetDialogVisible = true"
            >创建题集</el-button
          >
        </el-col>
        <el-col :span="2">
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
      <el-table :data="problemlist" style="margin-top: 20px">
        <el-table-column prop="id" width="80" label="ID"> </el-table-column>
        <el-table-column prop="info.title" label="题目"> </el-table-column>
        <el-table-column prop="info.tags" label="标签">
          <template slot-scope="scope">
            <el-tag
              class="tagsLayout"
              v-for="(item, index) in scope.row.info.tags"
              :key="index"
              >{{ item }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="info.difficulty"
          width="150"
          label="难度"
          :filters="[
            { text: '入门', value: 0.0 },
            { text: '简单', value: 2.5 },
            { text: '中等', value: 5.0 },
            { text: '困难', value: 7.5 },
          ]"
          :filter-method="filterDifficulty"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              type="info"
              v-if="
                scope.row.info.difficulty >= 0 &&
                scope.row.info.difficulty < 2.5
              "
              >入门
            </el-tag>
            <el-tag
              effect="dark"
              type="success"
              v-if="
                scope.row.info.difficulty >= 2.5 &&
                scope.row.info.difficulty < 5.0
              "
              >简单
            </el-tag>
            <el-tag
              effect="dark"
              type="warning"
              v-if="
                scope.row.info.difficulty >= 5.0 &&
                scope.row.info.difficulty < 7.5
              "
              >中等
            </el-tag>
            <el-tag
              effect="dark"
              type="danger"
              v-if="
                scope.row.info.difficulty >= 7.5 &&
                scope.row.info.difficulty < 10.0
              "
              >困难
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_released"
          label="发布状态"
          width="150"
          :filters="[
            { text: '已发布', value: true },
            { text: '未发布', value: false },
          ]"
          :filter-method="filterReleaseStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_released"
              @change="problrmStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 查看题目按钮 -->
            <el-button size="small" @click="handleClickProblem(scope.row.id)"
              >查看</el-button
            >
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="small"
              @click="showEditDialog(scope.row.id)"
              >修改</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="small"
              @click="deleteProblem(scope.row.id, scope.row.info.title)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        hide-on-single-page
        @current-change="getProblemList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        style="margin-top: 30px; text-align: center"
      >
      </el-pagination>
    </el-card>
    <!-- 创建题集弹窗 -->
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
        <el-form-item label="题集名称" prop="name">
          <el-input v-model="addProblemSetForm.name"></el-input>
        </el-form-item>
        <el-form-item label="相关介绍" prop="introduction">
          <el-input
            type="textarea"
            v-model="addProblemSetForm.introduction"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button type="primary" @click="createProblemSet()">创建</el-button>
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
        <el-form-item label="竞赛名称" prop="name">
          <el-input v-model="addContestForm.name"></el-input>
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

    <!-- 修改题目弹窗 -->
    <el-dialog
      title="修改题目"
      :visible.sync="modifyProblemDialogVisible"
      width="75%"
    >
      <!-- 题目标题&标签 -->
      <el-row :gutter="30" style="margin-top: 20px">
        <!-- 标题 -->
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px">标题</span>
          </div>
          <el-input
            placeholder="请输入标题"
            v-model="input_title"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 标签 -->
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px">标签</span>
          </div>
          <el-select
            v-model="input_tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择标签"
            style="
              margin-top: 10px;
              
              font-size: 14px;
              width: 100%;
            "
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- 难度、判题方式、公开输出 -->
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 难度 -->
        <el-col :span="8">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px">难度</span>
          </div>
          <el-select
            v-model="difficultyValue"
            placeholder="请选择难度"
            style="
              margin-top: 10px;
              
              font-size: 14px;
              width: 100%;
            "
          >
            <el-option
              v-for="item in difficultyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <!-- 判题方式 -->
        <el-col :span="8">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px"
              >判题方式</span
            >
          </div>
          <el-select
            v-model="judgeValue"
            placeholder="请选择判题方式"
            style="
              margin-top: 10px;
              
              font-size: 14px;
              width: 100%;
            "
          >
            <el-option
              v-for="item in judgeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <!-- 是否展示输出 -->
        <el-col :span="8">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px"
              >输出展示</span
            >
          </div>
          <el-select
            v-model="opaque_output"
            placeholder="请选择是否展示输出内容"
            style="
              margin-top: 10px;
              
              font-size: 14px;
              width: 100%;
            "
          >
            <el-option
              v-for="item in outputOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <!-- 高性能时间限制 & 高性能内存限制 & 其他时间限制 & 其他内存限制 -->
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 高性能时间限制 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px"
              >高性能时间限制(ms)</span
            >
          </div>
          <el-input
            placeholder="请输入高性能时间限制值，单位 ms"
            v-model.number="high_performance_max_cpu_time"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 高性能内存限制 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px"
              >高性能内存限制(B)</span
            >
          </div>
          <el-input
            placeholder="请输入高性能内存限制值，单位 B"
            v-model.number="high_performance_max_memory"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 其他时间限制 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px"
              >其他时间限制(ms)</span
            >
          </div>
          <el-input
            placeholder="请输入其他时间限制值，单位 ms"
            v-model.number="other_max_cpu_time"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 其他内存限制 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span style=" font-size: 16px"
              >其他内存限制(B)</span
            >
          </div>
          <el-input
            placeholder="请输入其他内存限制值，单位 B"
            v-model.number="other_max_memory"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
      </el-row>
      <!-- 难度、判题方式、公开输出 -->
      <!-- 题目描述 -->
      <div class="problemDetail">
        <div class="titleLayout">
          <img class="mustPic" src="@/assets/img/required_field.svg" />
          <span>描述</span>
        </div>
        <!-- 富文本编辑器 -->
        <div style="margin-top: 10px">
          <mavon-editor v-model="input_description"></mavon-editor>
        </div>
      </div>
      <!-- 样例 -->
      <div class="sampleDetail">
        <!-- title -->
        <div class="titleLayout">
          <img class="mustPic" src="@/assets/img/required_field.svg" />
          <span>样例</span>
        </div>
        <!-- 动态表单 -->
        <el-form
          ref="createSampleFormRef"
          :hide-required-asterisk="true"
          :inline="true"
          :model="createSampleForm"
          label-position="left"
          style="margin-left: 10px; margin-top: 10px"
        >
          <div
            v-for="(item, index) in createSampleForm.dynamicItem"
            :key="index"
          >
            <el-form-item
              label="输入"
              :prop="'dynamicItem.' + index + '.input'"
              :rules="{
                required: true,
                message: '输入不能为空',
                trigger: 'blur',
              }"
            >
              <el-input
                class="inputWord"
                type="textarea"
                v-model="item.input"
                placeholder="请输入输入样例"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="输出"
              :prop="'dynamicItem.' + index + '.output'"
              :rules="{
                required: true,
                message: '输出不能为空',
                trigger: 'blur',
              }"
              class="marginLeft30"
            >
              <el-input
                type="textarea"
                class="inputWord"
                v-model="item.output"
                placeholder="请输入输出样例"
              ></el-input>
            </el-form-item>
            <el-form-item class="marginLeft30">
              <el-button
                plain
                v-if="index + 1 == createSampleForm.dynamicItem.length"
                @click="addSampleItem()"
                type="primary"
                >增加</el-button
              >
              <el-button
                plain
                v-if="index !== 0"
                @click="deleteSampleItem(item, index)"
                type="danger"
                >删除</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button type="primary" @click="modifyProblem()">修改题目</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  problemPublicInfoRequest,
  problemPublicListRequest,
  problemStatusChangeRequest,
  problemEditRequest,
  problemPublicDeleteRequest,
} from "@/request/problemRequest";
export default {
  data() {
    return {
      searchInput: "",
      currentPage: 1,
      pageSize: 10,
      total: null,
      problemlist: [],
      // 多选
      multipleSelection: [],
      // 控制创建题集天窗
      addProblemSetDialogVisible: false,
      // 控制创建竞赛弹窗
      addContestDialogVisible: false,
      // 控制修改题目弹窗
      modifyProblemDialogVisible: false,
      // 创建题集表单
      addProblemSetForm: {
        name: "",
        introduction: "",
      },
      // 创建竞赛表单
      addContestForm: {
        name: "",
        introduction: "",
        startTime: "",
        endTime: "",
        password: "",
      },
      // 创建题集时的表单验证规则对象
      addProblemSetFormRules: {
        name: [{ required: true, message: "请输入题集名称", trigger: "blur" }],
        introduction: [
          { required: false, message: "请输入题集相关介绍", trigger: "blur" },
        ],
      },
      // 创建竞赛时的表单验证规则对象
      addContestFormRules: {
        name: [{ required: true, message: "请输入竞赛名称", trigger: "blur" }],
        introduction: [
          { required: false, message: "请输入竞赛相关介绍", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择竞赛开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请选择竞赛开始时间", trigger: "blur" },
        ],
      },
      // 修改题目时的内容
      modify_id: "",
      input_title: "",
      // 新建题目时的标签
      input_tags: [],
      input_description: "",
      // 新建题目时的难度
      difficultyValue: "",
      judgeValue: "",
      high_performance_max_cpu_time: "",
      high_performance_max_memory: "",
      other_max_cpu_time: "",
      other_max_memory: "",
      opaque_output: "",
      // 新建题目时的样例表单
      createSampleForm: {
        dynamicItem: [
          {
            input: "",
            output: "",
          },
        ],
      },
      // 新建题目时的标签选择器
      tagOptions: [
        {
          value: "栈",
          label: "栈",
        },
        {
          value: "堆",
          label: "堆",
        },
        {
          value: "贪心算法",
          label: "贪心算法",
        },
      ],
      // 新建题目时的困难度选择
      difficultyOptions: [
        {
          value: 0,
          label: "入门",
        },
        {
          value: 3,
          label: "简单",
        },
        {
          value: 5,
          label: "中等",
        },
        {
          value: 8,
          label: "困难",
        },
      ],
      // 新建题目时的判题方式选择
      judgeOptions: [
        {
          value: false,
          label: "普通",
        },
        {
          value: true,
          label: "特殊",
        },
      ],
      // 新建题目时的是否展示输出内容选择
      outputOptions: [
        {
          value: false,
          label: "不展示",
        },
        {
          value: true,
          label: "展示",
        },
      ],
    };
  },
  created() {
    this.getProblemList();
  },
  methods: {
    // 获取题目列表
    getProblemList: function (currentPage = 1) {
      var that = this;
      const params = {
        id_order: true,
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemPublicListRequest(params)
        .then(function (response) {
          console.log(response);
          that.currentPage = currentPage;
          that.problemlist = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 改变题目发布状态
    problrmStatusChange(probleminfo) {
      console.log(probleminfo);
      const data = { target_state: probleminfo.is_released };
      var that = this;
      problemStatusChangeRequest(probleminfo.id, data)
        .then(function (response) {
          that.$message({
            message: "修改成功！",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "修改失败！",
            type: "warning",
          });
        });
    },

    // 点击题目跳转至题目详情
    handleClickProblem: function (pid) {
      let id = pid;
      let that = this;
      that.$router.push({ name: "problemDetail", params: { id: id } });
    },

    // 选项改变时处理函数
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // 创建题集
    createProblemSet() {},

    // 创建竞赛函数
    createContest() {
      console.log(this.addContestForm.startTime);
    },

    // 展示修改题目弹窗
    showEditDialog(problemid) {
      var that = this;
      problemPublicInfoRequest(problemid)
        .then(function (response) {
          console.log(response);
          var setProblemInfo = new Promise(function (resolve, reject) {
            that.modify_id = problemid;
            that.input_title = response.info.title;
            that.input_tags = response.info.tags;
            that.difficultyValue = response.info.difficulty;
            that.input_description = response.contents.description;
            if (response.contents.example_count != 0) {
              that.createSampleForm.dynamicItem = response.contents.examples;
            }
            that.judgeValue = response.settings.is_spj;
            that.high_performance_max_cpu_time =
              response.settings.high_performance_max_cpu_time;
            that.high_performance_max_memory =
              response.settings.high_performance_max_memory;
            that.other_max_cpu_time = response.settings.other_max_cpu_time;
            that.other_max_memory = response.settings.other_max_memory;
            that.opaque_output = response.settings.opaque_output;
            resolve();
          });
          setProblemInfo.then(function () {
            that.modifyProblemDialogVisible = true;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 删除 example 函数
    deleteSampleItem(item, index) {
      this.createSampleForm.dynamicItem.splice(index, 1);
    },
    // 增加 example 函数
    addSampleItem() {
      this.createSampleForm.dynamicItem.push({
        input: "",
        output: "",
      });
    },
    // 修改题目函数
    modifyProblem() {
      const data = {
        new_info: {
          title: this.input_title,
          tags: this.input_tags,
          difficulty: this.difficultyValue,
        },
        new_contents: {
          description: this.input_description,
          example_count: this.createSampleForm.dynamicItem.length,
          examples: this.createSampleForm.dynamicItem,
        },
        new_settings: {
          is_spj: this.judgeValue,
          high_performance_max_cpu_time: this.high_performance_max_cpu_time,
          high_performance_max_memory: this.high_performance_max_memory,
          other_max_cpu_time: this.other_max_cpu_time,
          other_max_memory: this.other_max_memory,
          opaque_output: this.opaque_output,
          test_case_count: 0,
        },
      };
      let that = this;
      problemEditRequest(that.modify_id, data)
        .then(function (response) {
          that.modifyProblemDialogVisible = false;
          that.getProblemList();
          // 提示用户创建成功
          that.$message({
            message: "修改题目成功！",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "修改题目失败！",
            type: "warning",
          });
          console.log(error);
        });
    },

    // 删除题目
    deleteProblem(problemid, title) {
      this.$confirm(
        "此操作将永久删除题目 【" + title + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let that = this;
          problemPublicDeleteRequest(problemid)
            .then(function (response) {
              //重新获取题目列表
              that.getProblemList();
              // 提示用户删除成功
              that.$message({
                message: "删除成功！",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "删除失败！",
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

    //  根据困难度筛选
    filterDifficulty(value, row) {
      // return row.info.difficulty === value;
      return row.info.difficulty >= value && row.info.difficulty < value + 2.5;
    },
    // 根绝发布状态筛选
    filterReleaseStatus(value, row) {
      return row.is_released === value;
    },
  },
};
</script>

<style lang='less' scoped>
.editpic {
  width: 25px;
}
.tagsLayout {
  margin-right: 5px;
}
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
.problemDetail {
  margin-top: 40px;
}

.sampleDetail {
  margin-top: 40px;
}
.inputWord {
  width: 400px;
  
  font-size: 14px;
}
.marginLeft30 {
  margin-left: 30px;
}
</style>

