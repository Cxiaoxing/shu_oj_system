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
      <!-- 搜索区域 -->
      <ProblemSearchBar :searchProblemList="searchProblemList" />
      <!-- 列表区域 -->
      <el-table
        :data="problemlist"
        style="margin-top: 20px"
        @row-click="jumpToProblemDetail"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column
          prop="info.title"
          label="题目名称"
          show-overflow-tooltip
        />
        <el-table-column prop="info.tags" label="标签">
          <template slot-scope="scope">
            <el-tag
              style="margin-right: 5px"
              v-for="(item, index) in scope.row.info.tags"
              :key="index"
              >{{ item }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="info.difficulty" label="难度" width="150">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              type="info"
              v-if="scope.row.info.difficulty < 2.5"
              >Navie
            </el-tag>
            <el-tag
              effect="dark"
              type="success"
              v-else-if="scope.row.info.difficulty < 5.0"
              >Easy
            </el-tag>
            <el-tag
              effect="dark"
              type="warning"
              v-else-if="scope.row.info.difficulty < 7.5"
              >Middle
            </el-tag>
            <el-tag effect="dark" type="danger" v-else>Hard </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_released" label="发布状态" width="150">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.is_released" disabled> </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="showEditDialog(scope.row.id)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click.stop="deleteProblem(scope.row.id, scope.row.info.title)"
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
        class="table_pagination"
      >
      </el-pagination>
    </el-card>

    <!-- 修改题目弹窗 -->
    <el-dialog
      title="修改题目"
      :visible.sync="editProblemDialogVisible"
      width="75%"
      @close="closeEditProblemDialog"
    >
      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">题目名称</span>
        </div>
        <el-input
          placeholder="请输入题目名称"
          v-model="title"
          class="create-form-value-wrap"
        >
        </el-input>
      </div>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="9">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">标签</span>
          </div>
          <el-select
            v-model="tags"
            multiple
            filterable
            placeholder="请选择标签"
            class="create-form-value-wrap"
          >
            <el-option
              v-for="item in tagOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">难度</span>
          </div>
          <el-select
            v-model="difficulty"
            placeholder="请选择难度"
            class="create-form-value-wrap"
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
        <el-col :span="5">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">判题方式</span>
          </div>
          <el-select
            v-model="judgeValue"
            placeholder="请选择判题方式"
            class="create-form-value-wrap"
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
        <el-col :span="5">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">输出展示</span>
          </div>
          <el-select
            v-model="opaque_output"
            placeholder="请选择是否展示输出"
            class="create-form-value-wrap"
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

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">题目说明</span>
        </div>
        <div class="create-form-value-wrap">
          <mavon-editor v-model="description"></mavon-editor>
        </div>
      </div>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="6">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">高性能时间限制(ms)</span>
          </div>
          <el-input
            placeholder="请输入高性能时间限制值(单位: ms)"
            v-model.number="high_performance_max_cpu_time"
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">其他时间限制(ms)</span>
          </div>
          <el-input
            placeholder="请输入其他时间限制值(单位: ms)"
            v-model.number="other_max_cpu_time"
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">高性能内存限制(B)</span>
          </div>
          <el-input
            placeholder="请输入高性能内存限制值(单位: B)"
            v-model.number="high_performance_max_memory"
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">其他内存限制(B)</span>
          </div>
          <el-input
            placeholder="请输入其他内存限制值(单位: B)"
            v-model.number="other_max_memory"
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
      </el-row>

      <!-- 样例 -->
      <div class="create-form-row-wrap">
        <!-- title -->
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">样例</span>
        </div>
        <!-- 动态表单 -->
        <el-form
          ref="createSampleFormRef"
          :hide-required-asterisk="true"
          :inline="true"
          :model="createSampleForm"
          label-position="left"
          class="create-form-value-wrap"
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

        <!-- 测试数据上传 -->
        <div class="create-form-row-wrap">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">测试数据</span>
            <el-link
              type="primary"
              :underline="false"
              target="_black"
              style="margin-left: 12px; font-size: 8px"
              :href="`${BASE_URL}/problems/${problem_id}/test_case`"
              >下载到本地
              <i class="el-icon-download" />
            </el-link>
          </div>
          <div
            class="someTip"
            v-html="
              `上传文件后，点击修改题目则会覆盖原测试数据。<br>
                请将所有测试用例打包在一个.zip文件中上传，所有输入、输出文件要在压缩包的根目录，
                且文件名为从1开始的连续数字。<br>
                例如: &nbsp;普通判题方式: 1.in, 1.out, 2.in, 2.out, 3.in, 3.out
                <br>&emsp;&emsp;&emsp;特殊判题方式: 1.in, 2.in, 3.in`
            "
          />
          <el-upload
            ref="uploadTestCase"
            :action="`${BASE_URL}/problems/${problem_id}/test_case`"
            accept=".zip"
            :limit="1"
            :auto-upload="false"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-exceed="handleExceed"
          >
            <el-button type="primary" plain>上传测试数据压缩包</el-button>
          </el-upload>
        </div>
      </div>

      <div class="create-form-button-wrap">
        <el-button type="primary" @click="editProblem()">修改题目</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  problemInfoPrivateRequest,
  problemListPrivateRequest,
  problemEditRequest,
  problemDeleteRequest,
} from "@/request/problemRequest";
import ProblemSearchBar from "@/components/ProblemSearchBar.vue";
import { tagListRequest } from "@/request/tagRequest";
import { BASE_URL } from "@/assets/config";

export default {
  components: {
    ProblemSearchBar,
  },
  data() {
    return {
      title_filter: "",
      tag_filter: [],
      difficulty_filter: "",
      currentPage: 1,
      pageSize: 8,
      total: null,
      problemlist: [],

      // 修改题目
      BASE_URL,
      editProblemDialogVisible: false,
      problem_id: "",
      title: "",
      tags: [],
      description: "",
      difficulty: "",
      judgeValue: "",
      high_performance_max_cpu_time: "",
      high_performance_max_memory: "",
      other_max_cpu_time: "",
      other_max_memory: "",
      opaque_output: "",
      createSampleForm: {
        dynamicItem: [
          {
            input: "",
            output: "",
          },
        ],
      },
      needUploadTestCase: false,
      tagNameToId: {}, // name到id的映射
      tagOptions: [],
      difficultyOptions: [
        {
          value: 0,
          label: "Navie",
        },
        {
          value: 3,
          label: "Easy",
        },
        {
          value: 5,
          label: "Middle",
        },
        {
          value: 8,
          label: "Hard",
        },
      ],
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
    this.getTagList();
  },
  methods: {
    // 获取题目列表
    getProblemList: function (currentPage = 1) {
      const that = this;
      const params = {
        inner_id_order: true,
        title_filter: this.title_filter,
        tag_filter: this.tag_filter,
        difficulty_filter: this.difficulty_filter,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      problemListPrivateRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.problemlist = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getTagList() {
      tagListRequest()
        .then((response) => {
          this.tagOptions = response.list;
          response.list.forEach((item) => {
            this.tagNameToId[item.name] = item.id;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 搜索题目列表
    searchProblemList(title_filter, tag_filter, difficulty_filter) {
      this.title_filter = title_filter;
      this.tag_filter = tag_filter;
      this.difficulty_filter = difficulty_filter;
      this.getProblemList();
    },

    // 点击题目跳转至题目详情
    jumpToProblemDetail(row) {
      this.$router.push({ name: "problemDetail", params: { id: row.id } });
    },

    // 展示修改题目弹窗
    showEditDialog(problemid) {
      const that = this;
      problemInfoPrivateRequest(problemid)
        .then(function (response) {
          var setProblemInfo = new Promise(function (resolve, reject) {
            that.problem_id = problemid;
            that.title = response.info.title;
            that.tags = response.info.tags.map(
              (item) => that.tagNameToId[item]
            );
            that.difficulty = response.info.difficulty;
            that.description = response.contents.description;
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
            that.editProblemDialogVisible = true;
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
    // 文件上传提示函数
    handleChange() {
      this.needUploadTestCase = true;
    },
    handleRemove() {
      this.needUploadTestCase = false;
    },
    handleSuccess() {
      this.editProblemDialogVisible = false;
      this.getProblemList(this.currentPage);
      this.$message.success("修改题目成功");
    },
    handleError() {
      this.$message.error("测试数据上传失败");
    },
    handleExceed() {
      this.$message.warning("最多只能上传一个文件");
    },
    closeEditProblemDialog() {
      this.needUploadTestCase = false;
      this.$refs.uploadTestCase.clearFiles();
    },
    // 修改题目函数
    editProblem() {
      const data = {
        new_title: this.title,
        new_tags: this.tags,
        new_difficulty: this.difficulty,
        new_contents: {
          description: this.description,
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
      problemEditRequest(this.problem_id, data)
        .then(() => {
          if (this.needUploadTestCase) {
            this.$message.success("正在上传测试数据...");
            this.$refs.uploadTestCase.submit();
          } else {
            this.editProblemDialogVisible = false;
            this.getProblemList(this.currentPage);
            this.$message.success("修改题目成功");
          }
        })
        .catch((error) => {
          this.$message.warning("修改题目失败");
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
          const that = this;
          problemDeleteRequest(problemid)
            .then(function (response) {
              that.getProblemList(that.currentPage);
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

    // 根绝发布状态筛选
    filterReleaseStatus(value, row) {
      return row.is_released === value;
    },
  },
};
</script>

<style lang='scss' scoped>
.inputWord {
  width: 400px;
  font-size: 14px;
}
.marginLeft30 {
  margin-left: 30px;
}
</style>

