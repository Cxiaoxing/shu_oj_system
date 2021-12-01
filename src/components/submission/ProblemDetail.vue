<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题目列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ problem_info.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 题目展示区域 -->
        <el-card>
          <!-- 题目区域 -->
          <div>
            <div class="problemHead">
              <span class="problemTitle">{{ problem_info.title }}</span>
              <el-button size="medium" @click="jumpToMySubmission()"
                >我的提交</el-button
              >
            </div>
            <!-- 题目详情 -->
            <div class="scrollbar" style="height: 560px">
              <div>
                <mavon-editor
                  :value="problem_contents.description"
                  :subfield="false"
                  :defaultOpen="'preview'"
                  :toolbarsFlag="false"
                  :boxShadow="false"
                />
              </div>
              <!--样例 -->
              <div v-if="problem_contents.example_count !== 0" class="sample">
                <div
                  v-for="(example, index) in problem_contents.examples"
                  v-bind:key="index"
                  class="sampleDetail"
                >
                  <div class="sampleTitle"># 样例 {{ index + 1 }}</div>
                  <div class="sampleDisplay">
                    <div class="sampleDetailWord">
                      输入：{{ example.input }}
                    </div>
                    <div class="sampleDetailWord">
                      输出：{{ example.output }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 编程区域 -->
        <el-card>
          <!-- 编程语言选择区 -->
          <div>
            <span>语言: </span>
            <el-select v-model="language" placeholder="请选择编程语言">
              <el-option
                v-for="item in languages"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <codemirror
            class="margin_top_20"
            v-model="code"
            :options="options"
          ></codemirror>
          <div class="buttonWrap">
            <el-button type="primary" @click="submitCode()">提交</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 提交结束后引导查看提交详情弹窗 -->
    <el-dialog title="" :visible.sync="dialogVisible" width="30%">
      <span>提交成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">知道了</el-button>
        <el-button type="primary" @click="jumpToSubmissionDetail()"
          >查看详情</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
// 代码高亮
import "codemirror/mode/python/python.js"; // python
// import "codemirror/mode/clike/clike.js"; //java

import { problemInfoFromRegionRequest } from "@/request/problemRequest";
import { submissionCreateRequest } from "@/request/submissionRequest";

export default {
  data() {
    return {
      region: "",
      problem_id: null,
      inner_id: null,

      uuid: "",
      problem_info: {}, //题目基础信息
      problem_contents: {}, //题目描述
      dialogVisible: false, //控制查看题目详情弹窗
      code: "", // 代码编辑器绑定的值
      options: {
        tabSize: 2, // 缩进格式
        theme: "idea", // 主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        lineWrapping: true, //代码折叠
        styleActiveLine: true, // 高亮选中行
        showCursorWhenSelecting: true,
        autofocus: true,
        hintOptions: {
          completeSingle: true, // 当匹配只有一项的时候是否自动补全
        },
      },
      // 语言选项
      languages: [
        {
          value: "c",
          label: "C 语言",
        },
        {
          value: "py2",
          label: "python2",
        },
        {
          value: "py3",
          label: "python3",
        },
        {
          value: "java",
          label: "Java",
        },
        {
          value: "cpp",
          label: "C++",
        },
      ],
      language: "cpp",
    };
  },
  created() {
    this.region = this.$route.params.region;
    this.problem_id = this.$route.params.problem_id;
    this.inner_id = this.$route.params.inner_id;
    this.getProblem(this.$route.params.inner_id);
  },
  methods: {
    // 获取题目详情
    getProblem(inner_id) {
      problemInfoFromRegionRequest(this.region, inner_id)
        .then((response) => {
          this.problem_info = response.info;
          this.problem_contents = response.contents;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 选择编程语言
    changeLanguage: function (language) {
      this.language = language;
    },
    // 提交代码
    submitCode: function () {
      const data = {
        src: this.code,
        language: this.language,
      };
      submissionCreateRequest(this.region, this.inner_id, data)
        .then((response) => {
          this.dialogVisible = true;
          this.uuid = response;
        })
        .catch(() => {
          this.$message({
            message: "提交失败",
            type: "warning",
          });
        });
    },

    // 跳转至题目结果详情
    jumpToSubmissionDetail() {
      const routeData = this.$router.resolve({
        name: "submissionDetail",
        params: { uuid: this.uuid },
      });
      window.open(routeData.href, '"_blank"')
    },

    // 跳转到我的提交
    jumpToMySubmission() {
      this.$router.push({
        name: "problemSubmissionList",
        params: {
          region: this.region,
          problem_id: this.problem_id,
          inner_id: this.inner_id,
        },
      });
    },
  },
  components: {
    codemirror,
  },
};
</script>

<style lang="scss" >
.problemHead {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.problemTitle {
  font-size: 30px;
  font-weight: 400;
  color: $title_font_color;
}

.sample {
  margin-top: 20px;
  padding: 8px 25px 15px 25px;
  background-color: $background_color;
  border-radius: 4px;
}
.sampleDisplay {
  margin-top: 16px;
  margin-bottom: 24px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
}

.sampleDetail {
  display: flex;
  flex-direction: column;
  margin-top: 24px;
}

.sampleTitle {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.sampleDetailWord {
  font-size: 16px;
  margin-top: 0px;
  margin-bottom: 5px;
  line-height: 1.5;
}

.CodeMirror {
  border: 1px solid $codeMirror_border_color;
  height: 500px;
}

.CodeMirror-scroll {
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>