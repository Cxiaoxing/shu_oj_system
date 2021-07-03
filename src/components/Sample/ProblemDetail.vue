<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题库管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/questionBank' }"
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
              <el-button
                size="medium"
                @click="goSampleList()"
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
    <!-- 提交结束后引导查看提交详情弹窗 -->
    <el-dialog title="" :visible.sync="dialogVisible" width="30%">
      <span>提交成功！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="goProblemResult()"
          >查看详情</el-button
        >
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

export default {
  name: "problemDetail",
  data() {
    return {
      id: 0, //接受前一个页面传来的id值
      region:"",
      uuid: "",
      problem_info: {}, //题目基础信息
      problem_contents: {}, //题目描述
      dialogVisible: false, //控制查看题目详情弹窗
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
    this.region = this.$route.params.region;
    this.getProblem(this.id,this.region);
  },
  methods: {
    // 获取题目详情
    getProblem: function (id) {
      var that = this;
      this.$axios({
        method: "get",
        url: "/problems/" + id,
      })
        .then(function (response) {
          that.problem_info = response.data.info;
          that.problem_contents = response.data.contents;
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
      const myHeaders = {
        "Content-Type": "application/json",
        cache: "false",
      };
      var that = this;
      this.$axios({
        method: "post",
        url: "/samples",
        headers: myHeaders,
        data: JSON.stringify({
          problem_id: pid,
          src: this.code,
          language: this.language,
        }),
      })
        .then(function (response) {
          that.dialogVisible = true;
          that.uuid = response.data;
        })
        .catch(function (error) {
          console.log(error);
          that.$message({
            message: "提交失败！",
            type: "warning",
          });
        });
    },
    // 管理标程
    goSampleList() {
      let that = this;
      let id = this.id;
      that.$router.push({ name: "sampleList", params: { id: id } });
    },

    // 跳转至题目结果详情
    goProblemResult() {
      let that = this;
      let uuid = that.uuid;
      that.$router.push({ name: "sampleResultDetail", params: { uuid: uuid } });
    },

    getResult: function (uuid) {
      var that = this;
      this.$axios({
        method: "get",
        url: "/samples/" + uuid,
      })
        .then(function (response) {
          console.log(response.data);
          if (response.data.submission.state !== "Finished") {
            that.$message({
              message: "判题未完成！",
            });
          } else {
            // 判题完成
            clearInterval(that.timer);
            that.timer = null;
            if (response.data.submission.result.err) {
              that.$message({
                message: response.data.submission.result.err,
                type: "warning",
              });
            } else {
              that.$message({
                message: "编译成功，跳转到判题结果页面！",
              });
              var setTestCases = new Promise(function (resolve, reject) {
                sessionStorage.setItem(
                  "test_cases",
                  JSON.stringify(response.data.submission.result.details)
                );
                resolve("problemResult");
              });
              setTestCases.then(function (path) {
                let id = that.id;
                let title = that.problem_info.title;
                that.$router.push({
                  name: path,
                  params: { id: id, title: title },
                });
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  components: {
    codemirror,
  },
};
</script>

<style lang="less" >
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