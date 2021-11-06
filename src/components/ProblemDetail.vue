<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 题目展示区域 -->
        <el-card>
          <!-- 题目区域 -->
          <div>
            <div style="display: flex; justify-content: space-between">
              <span class="problemTitle">{{ problem_info.title }}</span>
            </div>
            <!-- 题目详情 -->
            <div class="scrollbar" style="height: 480px">
              <div>
                <mavon-editor
                  class="margin_top_20"
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
                  <div class="sampleTitle">示例 {{ index + 1 }}</div>
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
          <div
            style="
              width: 100%;
              margin-top: 20px;
              display: flex;
              justify-content: flex-end;
            "
          >
            <el-button
              class="margin_top_20"
              type="primary"
              @click="submitCode(id)"
              >提交</el-button
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css";
// 代码高亮
import "codemirror/mode/python/python.js"; // python
// import "codemirror/mode/clike/clike.js"; //java

import { problemPublicInfoRequest } from "@/request/problemRequest";
import { sampleRequest } from "@/request/sampleRequest";
import { submissionRequest } from "@/request/submissonRequest";
export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    codemirror,
  },
  data() {
    return {
      problem_info: {}, //题目基础信息
      problem_contents: {}, //题目描述
      uuid: "",
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
      // 默认语言
      language: "cpp",
    };
  },
  created() {
    this.getProblem(this.id);
  },
  methods: {
    // 获取题目详情
    getProblem: function (region) {
      var that = this;
      problemPublicInfoRequest(region)
        .then(function (response) {
          console.log(response);
          that.problem_info = response.info;
          that.problem_contents = response.contents;
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
    submitCode: function (pid) {
        const that = this;
        if (this.isSample) {
          const data = {
            problem_id: pid,
            src: this.code,
            language: this.language,
          };
          sampleRequest(data)
            .then(function (response) {
              that
                .$confirm("提交成功", {
                  confirmButtonText: "查看详情",
                  cancelButtonText: "知道了",
                  type: "success",
                })
                .then(() => {
                  that.$router.push({
                    name: "sampleResultDetail",
                    params: { uuid: response },
                  });
                });
            })
            .catch(function (error) {
              console.log(error);
              that.$message({
                message: "提交失败！",
                type: "warning",
              });
            });
        } else {
          const data = {
            src: this.code,
            language: this.language,
          };
          const region = "set_main"; //todo
          submissionRequest(region, pid, data)
            .then(function (response) {
              that
                .$confirm("提交成功", {
                  confirmButtonText: "查看详情",
                  cancelButtonText: "知道了",
                  type: "success",
                })
                .then(() => {
                  that.$router.push({
                    name: "submissionDetail",
                    params: { uuid: response },
                  });
                });
            })
            .catch(function (error) {
              console.log(error);
              that.$message({
                message: "提交失败！",
                type: "warning",
              });
            });
        }
    },
  },
};
</script>
