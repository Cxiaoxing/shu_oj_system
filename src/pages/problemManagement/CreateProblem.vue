<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库管理</el-breadcrumb-item>
      <el-breadcrumb-item>创建题目</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域，展示批量导入入口 -->
    <el-card class="firstCard">
      <div style="font-size: 20px; font-weight: 400; color: #303133">
        批量创建题目
      </div>
      <el-divider></el-divider>
      <el-upload
        ref="upload"
        :action="BASE_URL + '/problems'"
        accept=".zip"
        :show-file-list="true"
        :file-list="fileList"
        :auto-upload="true"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <el-button type="primary">上传文件压缩包</el-button>
      </el-upload>
      <el-link
        class="linkWord"
        target="_blank"
        href="https://www.feishu.cn/docs/doccnw7qEdpKQ3N46ERmzSbaS5f#"
        >如何批量创建题目？</el-link
      >
    </el-card>
    <!-- 添加题目 -->
    <el-card class="secondCard">
      <div style="font-size: 20px; font-weight: 400; color: #303133">
        创建题目
      </div>
      <el-divider></el-divider>
      <!-- 题目标题&标签 -->
      <el-row :gutter="30" style="margin-top: 20px">
        <!-- 标题 -->
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">标题</span>
          </div>
          <el-input
            placeholder="请输入标题"
            v-model="input_title"
            clearable
            style="margin-top: 10px; font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 标签 -->
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">标签</span>
            <el-link
              type="primary"
              :underline="false"
              class="manageTags"
              @click="editTagsDialogVisible = true"
              >管理标签</el-link
            >
          </div>
          <el-select
            v-model="input_tags"
            multiple
            filterable
            placeholder="请选择标签"
            style="margin-top: 10px; font-size: 14px; width: 100%"
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
      </el-row>
      <!-- 难度、判题方式、公开输出 -->
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 难度 -->
        <el-col :span="8">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">难度</span>
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
            <span class="itemTitle">判题方式</span>
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
            <span class="itemTitle">输出展示</span>
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
            <span class="itemTitle">高性能时间限制(ms)</span>
          </div>
          <el-input
            placeholder="请输入高性能时间限制值，单位 ms"
            v-model.number="high_performance_max_cpu_time"
            clearable
            style="margin-top: 10px; font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 高性能内存限制 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">高性能内存限制(B)</span>
          </div>
          <el-input
            placeholder="请输入高性能内存限制值，单位 B"
            v-model.number="high_performance_max_memory"
            clearable
            style="margin-top: 10px; font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 其他时间限制 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">其他时间限制(ms)</span>
          </div>
          <el-input
            placeholder="请输入其他时间限制值，单位 ms"
            v-model.number="other_max_cpu_time"
            clearable
            style="margin-top: 10px; font-size: 14px"
          >
          </el-input>
        </el-col>
        <!-- 其他内存限制 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">其他内存限制(B)</span>
          </div>
          <el-input
            placeholder="请输入其他内存限制值，单位 B"
            v-model.number="other_max_memory"
            clearable
            style="margin-top: 10px; font-size: 14px"
          >
          </el-input>
        </el-col>
      </el-row>
      <!-- 难度、判题方式、公开输出 -->
      <!-- 题目描述 -->
      <div class="problemDetail">
        <div class="titleLayout">
          <img class="mustPic" src="@/assets/img/required_field.svg" />
          <span class="itemTitle">描述</span>
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
          <span class="itemTitle">样例</span>
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
      </div>
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-button type="primary" @click="submitProblem()">创建题目</el-button>
      </div>
    </el-card>

    <!-- 编辑标签弹窗 -->
    <el-dialog
      title="管理题目标签"
      :visible.sync="editTagsDialogVisible"
      width="38%"
      @close="editTagsDialogClosed"
    >
      <el-button type="primary" size="medium" @click="createTag()"
        >新建</el-button
      >
      <el-table :data="tagOptions" class="margin_top_20">
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="name" label="标签名"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="small"
              @click="showEditTagMessageBox(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
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
      // 上传的文件列表
      fileList: [],
      problemList: [],
      // 新建题目时的标题
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
      // 新建题目时的标签选择
      editTagsDialogVisible: false,
      tagOptions: [],
      // 新建题目时的困难度选择
      difficultyOptions: [
        {
          value: 0,
          label: "入门",
        },
        {
          value: 1,
          label: "简单",
        },
        {
          value: 2,
          label: "中等",
        },
        {
          value: 3,
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
    // 文件上传成功提示函数
    handleSuccess(res, file, fileList) {
      this.$message.success("文件上传成功");
    },
    // 文件上传失败提示函数
    handleError(err, file, fileList) {
      this.$message.error("文件上传失败");
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
    // 创建题目函数
    submitProblem() {
      const data = {
        info: {
          title: this.input_title,
          tags: this.input_tags,
          difficulty: this.difficultyValue,
        },
        contents: {
          description: this.input_description,
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
      const that = this;
      problemCreateRequest(data)
        .then(function (response) {
          // 提示用户创建成功
          that.$message({
            message: "添加题目成功",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
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

.itemTitle {
  font-size: 15px;
  color: #494747;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.linkWord {
  font-size: 12px;
  color: #494747;
  font-weight: 400;
}

.inputWord {
  width: 400px;
  font-size: 14px;
}

.manageTags {
  margin-left: 10px;
  font-weight: normal;
}
</style>