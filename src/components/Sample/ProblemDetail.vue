<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/problemManage/list' }"
        >题目列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ problem_info.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card style="height: 100%">
          <!-- 题目区域 -->
          <div>
            <div style="display: flex; justify-content: space-between">
              <span class="problemTitle">{{ problem_info.title }}</span>
              <el-button size="medium" @click="goSampleList()"
                >管理标程</el-button
              >
            </div>
            <!-- 题目详情 -->
            <div>
              <mavon-editor
                class="problemContent"
                :value="problem_contents.description"
                :subfield="false"
                :defaultOpen="'preview'"
                :toolbarsFlag="false"
                :boxShadow="false"
              />
            </div>
            <!--样例 -->
            <div v-if="problem_contents.example_count != 0" class="sample">
              <div
                v-for="(example, index) in problem_contents.examples"
                v-bind:key="index"
                class="sampleDetail"
              >
                <div class="sampleTitle">示例 {{ index + 1 }}</div>
                <div class="sampleDisplay">
                  <div class="sampleDetailWord">输入：{{ example.input }}</div>
                  <div class="sampleDetailWord">输出：{{ example.output }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <!-- 编程区域 -->
        <el-card>
          <div>
            <!-- 编程语言选择区 -->
            <div>
              <span style="">语言：</span>
              <el-select
                class="codeLanSel"
                v-model="language"
                placeholder="请选择编程语言"
              >
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
              class="codeEditor"
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
                class="submitButton"
                type="primary"
                @click="submitCode(id)"
                >提交</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/rubyblue.css"; // 蓝绿色
import "codemirror/theme/darcula.css"; // 黑色
import "codemirror/theme/elegant.css"; // 白色
import "codemirror/theme/idea.css"; // 白色
// 代码高亮
import "codemirror/mode/python/python.js"; // python
import { sampleRequest } from "@/request/sampleRequest";
import { problemInfoPrivateRequest } from "@/request/problemRequest";
// import "codemirror/mode/clike/clike.js"; //java

export default {
  data() {
    return {
      id: 0, //接受前一个页面传来的id值
      problem_info: {}, //题目基础信息
      problem_contents: {}, //题目描述
      code: "\n\n\n\n\n\n", // 代码编辑器绑定的值
      // 代码编辑器默认配置
      options: {
        tabSize: 2, // 缩进格式
        theme: "idea", // 主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        lineWrapping: true, //代码折叠
        styleActiveLine: true, // 高亮选中行
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
      // 查看结果定时器
      timer: null,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getProblem(this.id);
  },
  methods: {
    // 获取题目详情
    getProblem: function (id) {
      const that = this;
      problemInfoPrivateRequest(id)
        .then(function (response) {
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
      const data = {
        problem_id: pid,
        src: this.code,
        language: this.language,
      };
      sampleRequest(data)
        .then(function (response) {
          that.$confirm("提交成功", {
            confirmButtonText: "查看详情",
            cancelButtonText: "知道了",
            type: "success",
          })
            .then(() => {
              that.$router.push({ name: "sampleResultDetail", params: { uuid: response } });
            })
        })
        .catch(function (error) {
          console.log(error);
          that.$message({
            message: "提交失败",
            type: "warning",
          });
        });
    },
    // 管理标程
    goSampleList() {
      const that = this;
      let id = this.id;
      that.$router.push({ name: "sampleList", params: { id: id } });
    },
  },
  components: {
    codemirror,
  },
};
</script>

<style lang="scss" >
.problemTitle {
  
  font-size: 30px;
  font-weight: 400;
  color: #404040;
}

.problemContent {
  margin-top: 20px;
  
  background-color: #ffffff;
}

.codeEditor {
  margin-top: 20px;
}

.sample {
  margin-top: 30px;
  padding: 8px 25px 15px 25px;
  background-color: rgb(251, 251, 251);
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

.codeLanSel {
  margin-top: 30px;
}

.submitButton {
  margin-top: 20px;
}

.CodeMirror {
  border: 1px solid #eee;
  height: auto;
}

.CodeMirror-scroll {
  height: auto;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>