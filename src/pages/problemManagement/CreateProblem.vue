<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库管理</el-breadcrumb-item>
      <el-breadcrumb-item>新建题目</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="create-form-title">批量新建题目</div>
      <el-divider></el-divider>
      <el-upload
        :action="`${BASE_URL}/problems/batch_create`"
        :with-credentials="true"
        accept=".zip"
        :show-file-list="true"
        :file-list="fileList"
        :auto-upload="true"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <el-button type="primary">上传题目文件压缩包</el-button>
      </el-upload>
      <el-link
        class="someTip"
        target="_blank"
        href="https://www.feishu.cn/docs/doccnw7qEdpKQ3N46ERmzSbaS5f#"
        >如何批量新建题目？</el-link
      >
    </el-card>

    <el-card class="margin_top_20">
      <div class="create-form-title">新建题目</div>
      <el-divider></el-divider>

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
            <el-link
              type="primary"
              :underline="false"
              class="manageTags"
              @click="editTagsDialogVisible = true"
              >管理标签</el-link
            >
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

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">题目说明</span>
        </div>
        <div class="create-form-value-wrap">
          <mavon-editor v-model="description"></mavon-editor>
        </div>
      </div>

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">样例</span>
        </div>
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
              style="margin-left: 30px"
            >
              <el-input
                type="textarea"
                class="inputWord"
                v-model="item.output"
                placeholder="请输入输出样例"
              ></el-input>
            </el-form-item>
            <el-form-item style="margin-left: 30px">
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

        <div class="create-form-row-wrap">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">测试数据</span>
          </div>
          <div
            class="someTip"
            v-html="
              `请将所有测试用例打包在一个.zip文件中上传，所有输入、输出文件要在压缩包的根目录，
                且文件名为从1开始的连续数字。<br>
                例如: &nbsp;普通判题方式: 1.in, 1.out, 2.in, 2.out, 3.in, 3.out
                <br>&emsp;&emsp;&emsp;特殊判题方式: 1.in, 2.in, 3.in`
            "
          />
          <el-upload
            ref="uploadTestCase"
            :action="`${BASE_URL}/problems/${problem_id}/test_case`"
            :with-credentials="true"
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
        <el-button type="primary" @click="submitProblem()">新建题目</el-button>
      </div>
    </el-card>

    <!-- 编辑标签弹窗 -->
    <el-dialog
      title="管理题目标签"
      :visible.sync="editTagsDialogVisible"
      width="38%"
      @close="editTagsDialogClosed"
    >
      <el-button type="primary" plain size="medium" @click="createTag()"
        >新建标签</el-button
      >
      <el-table :data="tagOptions">
        <el-table-column prop="id" label="ID" width="80"> </el-table-column>
        <el-table-column prop="name" label="标签名"> </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="showEditTagMessageBox(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteTag(scope.row.id, scope.row.name)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { problemCreateRequest } from "@/request/problemRequest";
import {
  tagCreateRequest,
  tagListRequest,
  tagEditRequest,
  tagDeleteRequest,
  tagApplyRequest,
} from "@/request/tagRequest";
import { BASE_URL } from "@/assets/config";

export default {
  data() {
    return {
      BASE_URL,
      fileList: [], // 批量上传的题目文件列表
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
      editTagsDialogVisible: false,
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
      problem_id: null, // 新建题目成功后返回id
    };
  },

  created() {
    this.getTagList();
  },

  methods: {
    getTagList() {
      tagListRequest()
        .then((response) => {
          this.tagOptions = response.list;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 新建标签
    createTag() {
      this.$prompt("", "请输入标签名", {
        confirmButtonText: "新建",
        cancelButtonText: "取消",
      })
        .then(({ value: tagName }) => {
          const data = { name: tagName };
          tagCreateRequest(data)
            .then(() => {
              this.getTagList();
              this.$message({
                type: "success",
                message: "新建标签成功",
              });
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "新建标签失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消新建",
          });
        });
    },
    // 修改标签弹框
    showEditTagMessageBox(id) {
      this.$prompt("", "请输入新标签名", {
        confirmButtonText: "更新",
        cancelButtonText: "取消",
      })
        .then(({ value: tagName }) => {
          const data = { new_name: tagName };
          tagEditRequest(id, data)
            .then(() => {
              this.getTagList();
              this.$message({
                type: "success",
                message: "修改标签信息成功",
              });
            })
            .catch(() => {
              this.$message({
                type: "warning",
                message: "修改标签信息失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
    // 删除标签
    deleteTag(id, tagName) {
      this.$confirm(
        "此操作将永久删除标签 【" +
          tagName +
          "】 , 已和题目进行关联的标签不能进行删除, 是否继续?",
        "提示",
        {
          confirmButtonText: "删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          tagDeleteRequest(id)
            .then(() => {
              this.getTagList();
              this.$message({
                message: "标签删除成功",
                type: "success",
              });
            })
            .catch(() => {
              this.$message({
                message: "标签删除失败",
                type: "warning",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 关闭弹窗
    editTagsDialogClosed() {
      tagApplyRequest()
        .then(() => {
          this.$message({
            message: "标签应用生效",
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: "标签应用未生效，请再次打开、关闭管理标签弹窗重试",
            type: "warning",
          });
        });
    },
    // 测试点文件上传
    handleChange() {
      this.needUploadTestCase = true;
    },
    handleRemove() {
      this.needUploadTestCase = false;
    },
    // 两个文件上传
    handleSuccess() {
      this.$message.success("文件上传成功");
    },
    handleError() {
      this.$message.error("文件上传失败");
    },
    handleExceed() {
      this.$message.warning("最多只能上传一个文件");
    },
    // 删除 sample 函数
    deleteSampleItem(item, index) {
      this.createSampleForm.dynamicItem.splice(index, 1);
    },
    // 增加 sample 函数
    addSampleItem() {
      this.createSampleForm.dynamicItem.push({
        input: "",
        output: "",
      });
    },
    // 新建题目函数
    submitProblem() {
      const data = {
        title: this.title,
        tags: this.tags,
        difficulty: this.difficulty,
        contents: {
          description: this.description,
          example_count: this.createSampleForm.dynamicItem.length,
          examples: this.createSampleForm.dynamicItem,
        },
        settings: {
          is_spj: this.judgeValue,
          high_performance_max_cpu_time: this.high_performance_max_cpu_time,
          high_performance_max_memory: this.high_performance_max_memory,
          other_max_cpu_time: this.other_max_cpu_time,
          other_max_memory: this.other_max_memory,
          opaque_output: this.opaque_output,
          test_case_count: 0,
        },
      };
      problemCreateRequest(data)
        .then((response) => {
          this.problem_id = response;
          if (this.needUploadTestCase) {
            this.$message.success("添加题目成功，正在上传测试数据...");
            setTimeout(() => {
              this.$refs.uploadTestCase.submit();
            }, 1000);
          } else {
            this.editProblemDialogVisible = false;
            this.getProblemList(this.currentPage);
            this.$message.success("添加题目成功");
          }
        })
        .catch((error) => {
          this.$message({
            message: "添加题目失败",
            type: "warning",
          });
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.inputWord {
  width: 400px;
  font-size: 14px;
}

.manageTags {
  margin-left: 10px;
  font-weight: normal;
}
</style>