<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/contest' }">竞赛</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ name: 'contestDetail', params: { region } }">{{
        contestTitle
      }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ problem_info.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 题目切换按钮 -->
    <div class="problem_turning row_space">
      <el-button
        type="primary"
        plain
        icon="el-icon-caret-left"
        @click="changeProblem(-1)"
        :disabled="inner_id <= 1"
        >上一题</el-button
      >
      <el-button
        type="primary"
        plain
        @click="changeProblem(1)"
        :disabled="inner_id >= total"
        >下一题<i class="el-icon-caret-right"></i
      ></el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <!-- 题目区域 -->
          <div>
            <div class="problemHead">
              <span class="problemTitle">{{ problem_info.title }}</span>
            </div>
            <!-- 题目详情 -->
            <div class="scrollbar" style="height: 500px">
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
              <div v-if="problem_contents.example_count != 0" class="sample">
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
          <div>
            <!-- 编程语言选择区 -->
            <div>
              <span style="">语言：</span>
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
import "codemirror/mode/python/python.js"; // 代码高亮
import { problemInfoFromRegionRequest } from "@/request/problemRequest";
import { submissionCreateRequest } from "@/request/submissionRequest";
import { contestInfoRequest } from "@/request/contestRequest";
export default {
  data() {
    return {
      inner_id: null,
      total: null, //题目总数
      region: "",
      contestTitle: "",
      isContestRunning: false,

      problem_info: {}, //题目基础信息
      problem_contents: {}, //题目描述
      code: "", // 代码编辑器绑定的值
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
      language: "cpp",
    };
  },
  created() {
    this.region = this.$route.params.region;
    this.inner_id = this.$route.params.inner_id;
    this.total = this.$route.params.total;
    this.getContest();
    this.getProblem();
  },
  methods: {
    // 获取比赛信息
    getContest() {
      contestInfoRequest(this.region)
        .then((response) => {
          this.contestTitle = response.title;
          if (
            response.state === "Running" ||
            response.state === "SealedRunning"
          ) {
            this.isContestRunning = true;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 获取题目详情
    getProblem: function () {
      const that = this;
      problemInfoFromRegionRequest(this.region, this.inner_id)
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
      const data = {
        src: this.code,
        language: this.language,
      };
      submissionCreateRequest(this.region, this.inner_id, data)
        .then((response) => {
          this.$confirm("提交成功", {
            confirmButtonText: "查看结果",
            cancelButtonText: "知道了",
            type: "success",
          }).then(() => {
            if (this.isContestRunning) {
              const routeData = this.$router.resolve({
                name: "contestSubmissionDetail",
                params: { uuid: response },
              });
              window.open(routeData.href, "_blank");
            } else {
              const routeData = this.$router.resolve({
                name: "submissionDetail",
                params: { uuid: response },
              });
              window.open(routeData.href, "_blank");
            }
          });
        })
        .catch(() => {
          this.$message.warning("提交失败");
        });
    },

    changeProblem(number) {
      this.$router.push({
        params: {
          ...this.$route.params,
          inner_id: parseInt(this.inner_id) + number,
        },
      });
      window.location.reload();
    },
  },
  components: {
    codemirror,
  },
};
</script>

<style lang="scss" >
.problem_turning {
  margin-bottom: 12px;
  padding: 6px 20px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  transition: 0.3s;
  box-shadow: 0 2px 12px 0 $codeMirror_border_color;
}

.problemHead {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.problemTitle {
  font-size: 30px;
  font-weight: 400;
  color: #404040;
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

.CodeMirror {
  border: 1px solid $codeMirror_border_color;
  height: 440px;
}

.CodeMirror-scroll {
  height: 100%;
  overflow-y: hidden;
  overflow-x: auto;
}
</style>