<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/contest' }">竞赛</el-breadcrumb-item>
      <el-breadcrumb-item>{{ problem_info.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 题目切换按钮 -->
    <div class="problem_turning">
      <el-button
        class="previous_problem"
        type="primary"
        icon="el-icon-arrow-left"
        @click="previous_problem()"
        v-if="inner_id != 1"
        >上一题</el-button
      >
      <el-button
        class="after_problem"
        type="primary"
        @click="after_problem()"
        v-if="inner_id != total"
        >下一题<i class="el-icon-arrow-right el-icon--right"></i
      ></el-button>
    </div>
    <!-- 卡片 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card style="height: 100%">
          <!-- 题目区域 -->
          <div>
            <div style="display: flex; justify-content: space-between">
              <span class="problemTitle">{{ problem_info.title }}</span>
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
    <!-- 提交结束后引导查看提交详情弹窗 -->

    <el-dialog title="" :visible.sync="dialogVisible" width="30%">
      <span>提交成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">知道了</el-button>
      </span>
    </el-dialog>
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
// import "codemirror/mode/clike/clike.js"; //java
import { problemPrivateInfoRequest } from "../request/problemRequest";
import { submissionRequest } from "../request/submissonRequest";
export default {
  name: "problemDetail",
  data() {
    return {
      id: 0, //接受前一个页面传来的id值
      total: 0, //题目总数
      region: "",
      inner_id: "",
      uuid: "",
      problem_info: {}, //题目基础信息
      problem_contents: {}, //题目描述
      dialogVisible: false, //控制查看题目详情弹窗
      code: "", // 代码编辑器绑定的值
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
    this.region = this.$route.params.region;
    this.id = this.$route.params.id;
    this.inner_id = this.$route.params.inner_id;
    this.total = this.$route.params.total;
    this.getProblem();
  },
  methods: {
    // 获取题目详情
    getProblem: function () {
      var that = this;
      problemPrivateInfoRequest(this.region, this.inner_id)
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
    submitCode: function () {
      var that = this;
      const data = {
        src: this.code,
        language: this.language,
      };
      submissionRequest(this.region, this.inner_id, data)
        .then(function (response) {
          that.dialogVisible = true;
          that.uuid = response;
        })
        .catch(function (error) {
          console.log(error);
          that.$message({
            message: "提交失败！",
            type: "warning",
          });
        });
    },

    // 跳转至题目结果详情
    goProblemResult() {
      let that = this;
      let uuid = that.uuid;
      that.$router.push({ name: "sampleResultDetail", params: { uuid: uuid } });
    },

    // 上一题
    previous_problem() {
      var that = this;
      var previous = new Promise(function (resolve, reject) {
        var inner_id =
          parseInt(that.inner_id) > 1 ? parseInt(that.inner_id) - 1 : 1;
        that.inner_id = inner_id;
        resolve(inner_id);
      });
      previous.then(function (inner_id) {
        that.getProblem(that.region, inner_id);
      });
    },

    // 下一题
    after_problem() {
      var that = this;
      var after = new Promise(function (resolve, reject) {
        let inner_id =
          parseInt(that.inner_id) < parseInt(that.total)
            ? parseInt(that.inner_id) + 1
            : parseInt(that.total);
        that.inner_id = inner_id;
        resolve(inner_id);
      });
      after.then(function (inner_id) {
        that.getProblem(that.region, inner_id);
      });
    },

    closeDialog() {
      this.dialogVisible = false;
    },
  },
  components: {
    codemirror,
  },
};
</script>

<style lang="less" >
.problem_turning {
  margin-bottom: 10px;
  background-color: rgb(255, 255, 255);
  width: 100%;
  height: 35px;
}

.previous_problem {
  float: left;
}

.after_problem {
  float: right;
}

.problemTitle {
  font-family: PingFang SC;
  font-size: 30px;
  font-weight: 400;
  color: #404040;
}

.problemContent {
  margin-top: 20px;
  font-family: PingFang SC;
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
  font-family: PingFang SC;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}
.sampleDetailWord {
  font-family: PingFang SC;
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