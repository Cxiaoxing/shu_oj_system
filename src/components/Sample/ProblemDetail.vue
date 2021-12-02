<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题目管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/problemManage/list' }"
        >题目列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ problem_info.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <!-- 题目区域 -->
          <div>
            <div class="problemHead">
              <span class="problemTitle">{{ problem_info.title }}</span>
              <el-button
                size="medium"
                @click="
                  () => {
                    $router.push({ name: 'sampleList', params: { id } });
                  }
                "
                >管理标程</el-button
              >
            </div>
            <!-- 题目详情 -->
            <div class="scrollbar problemDetail" style="height: 560px">
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
              <div
                v-if="problem_contents.example_count != 0"
                class="sampleWrap"
              >
                <div class="sampleTitle">Sample</div>
                <div
                  v-for="(example, index) in problem_contents.examples"
                  :key="index"
                >
                  <div style="margin-top: 24px">
                    <div style="margin-top: 16px">
                      <div class="row_space">
                        <span class="sampleWordTitle"
                          >Input #{{ index + 1 }}</span
                        >
                        <el-button
                          type="primary"
                          plain
                          size="mini"
                          :data-clipboard-text="example.input"
                          class="copy"
                          >复制</el-button
                        >
                      </div>
                      <div
                        v-html="`${SampleDataEncode(example.input)}`"
                        class="sampleData"
                      ></div>
                    </div>
                    <div style="margin-top: 16px">
                      <div class="row_space">
                        <span class="sampleWordTitle">
                          Output #{{ index + 1 }}
                        </span>
                        <el-button
                          type="primary"
                          plain
                          size="mini"
                          :data-clipboard-text="example.output"
                          class="copy"
                          >复制</el-button
                        >
                      </div>
                      <div
                        v-html="`${SampleDataEncode(example.output)}`"
                        class="sampleData"
                      ></div>
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
              <el-button type="primary" @click="submitCode(id)">提交</el-button>
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
// import "codemirror/mode/clike/clike.js";
import { sampleCreateRequest } from "@/request/sampleRequest";
import { problemInfoPrivateRequest } from "@/request/problemRequest";
import { SampleDataEncode } from "@/assets/config.js";

// 复制文本
import Clipboard from "clipboard";
import { message } from "element-ui";
const clipboard = new Clipboard(".copy");
clipboard.on("success", () => {
  message.success({
    message: "复制成功",
    type: "success",
  });
});
clipboard.on("error", () => {
  message.success({
    message: "复制失败",
    type: "warning",
  });
});

export default {
  components: {
    codemirror,
  },
  data() {
    return {
      id: 0, //接受前一个页面传来的id值
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
    // 样例数据编码
    SampleDataEncode,
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
      sampleCreateRequest(data)
        .then(function (response) {
          that
            .$confirm("提交成功", {
              confirmButtonText: "查看详情",
              cancelButtonText: "知道了",
              type: "success",
            })
            .then(() => {
              that.$router.push({
                name: "sampleDetail",
                params: { uuid: response },
              });
            });
        })
        .catch(function (error) {
          console.log(error);
          that.$message({
            message: "提交失败",
            type: "warning",
          });
        });
    },
  },
};
</script>

<style lang="scss" >
@import "../../assets/styles/problemDetail.scss";

.CodeMirror {
  height: 500px;
}
</style>