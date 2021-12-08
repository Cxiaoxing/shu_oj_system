<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>提交详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-if="isNoPermission">
      <el-card
        style="height: 500px; justify-content: center"
        class="noContextBlock"
      >
        <div>
          <img class="noContextPic" src="@/assets/img/nocontext.svg" />
        </div>
        <div style="font-size: 14px">无权限查看此提交详情</div>
      </el-card>
    </div>

    <div v-else>
      <!-- 编译成功，提交通过提示 -->
      <el-alert
        v-if="subResult == 0"
        title="Accepted"
        type="success"
        :closable="false"
        description=""
        show-icon
      >
      </el-alert>
      <!-- 编译成功，但提交未通过提示 -->
      <el-alert
        v-if="subResult == 1"
        title="unAccepted"
        type="error"
        :closable="false"
        description=""
        show-icon
      >
      </el-alert>
      <!-- 编译不成功 -->
      <el-alert
        v-if="subResult == 2"
        :title="err"
        type="warning"
        :closable="false"
        description=""
        show-icon
      >
      </el-alert>
      <!-- 提交基本信息 -->
      <el-card style="margin-top: 25px; padding: 20px">
        <div
          style="
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div style="font-size: 28px; font-weight: 500">
            {{ problemTitle }}
          </div>
          <div>
            <!-- 状态显示 -->
            <div>
              <span style="font-size: 16px; font-weight: 500">State </span>
              <!-- 根据不同状态显示不同颜色的标签: Finished:绿色，Pending：蓝色，Waiting：灰色 -->
              <el-tag
                effect="dark"
                :type="
                  state == 'Finished'
                    ? 'success'
                    : state == 'Pending'
                    ? ''
                    : state == 'Waiting'
                    ? 'info'
                    : ''
                "
                size="small"
              >
                {{ state }}</el-tag
              >
            </div>
            <!-- 提交时间 -->
            <div>
              <span style="font-size: 16px; font-weight: 500">When </span>
              <span style="font-size: 14px; color: #606a78">{{
                formatTime(subTime)
              }}</span>
            </div>
          </div>
        </div>
        <el-divider></el-divider>

        <!-- 暂未完成判题 -->
        <div class="noContextBlock" v-if="state !== 'Finished'">
          <div>
            <img class="noContextPic" src="@/assets/img/nocontext.svg" />
          </div>
          <div style="font-size: 14px">暂未完成判题，请稍后查看</div>
        </div>
        <!-- 编译错误 -->
        <div v-else-if="err !== null">
          <div style="color: #f54a45">编译错误原因：</div>
          <div style="font-size: 14px; margin-top: 5px">{{ error_reason }}</div>
        </div>
        <!-- 已完成判题且编译正确，展示测试点信息 -->
        <div v-else>
          <div style="font-size: 20px; font-weight: 450">测试点详情</div>
          <div class="someTip">
            <div
              class="flex_row"
              v-for="(item, index) in resultColor"
              :key="index"
            >
              <div
                class="tipColor"
                :style="`background-color: ${item.color}`"
              />
              <div>{{ item.result }}</div>
            </div>
          </div>
          <div class="testCaseWrap scrollbar">
            <div
              v-for="(item, index) in testCase"
              :index="index + ''"
              :key="index"
            >
              <div
                class="testCase"
                :style="showTestCaseBackgroundColor(item.result)"
              >
                <div class="testCaseTitle"># Case {{ index + 1 }}</div>
                <div class="testCaseContent">
                  <span class="testCaseContentTitle"> CPU Time:</span>
                  <span> {{ item.cpu_time }} ms</span>
                </div>
                <div class="testCaseContent">
                  <span class="testCaseContentTitle">Memory:</span>
                  <span> {{ submissionMemoryFormat(item.memory) }}</span>
                </div>
                <div
                  class="testCaseDownload"
                  v-if="item.result !== 'SUCCESS' && canShowTestCase"
                >
                  <el-popover title="标准输入数据" trigger="click">
                    <div style="max-width: 500px">
                      {{ standardTestCaseData }}
                    </div>
                    <el-link
                      icon="el-icon-download"
                      type="primary"
                      :underline="false"
                      target="_blank"
                      download
                      style="margin-top: 8px"
                      :href="`${BASE_URL}/regions/${region}/${problem_id}/test_case/${item.test_case}?input=true`"
                      >下载到本地</el-link
                    >
                    <el-link
                      slot="reference"
                      @click="downloadTestCase(item.test_case, 'true')"
                      >标准输入</el-link
                    ></el-popover
                  >
                  <el-popover
                    placement="bottom"
                    title="标准输出数据"
                    trigger="click"
                  >
                    <div style="max-width: 500px">
                      {{ standardTestCaseData }}
                    </div>
                    <el-link
                      icon="el-icon-download"
                      type="primary"
                      :underline="false"
                      target="_blank"
                      download
                      style="margin-top: 8px"
                      :href="`${BASE_URL}/regions/${region}/${problem_id}/test_case/${item.test_case}?input=false`"
                      >下载到本地</el-link
                    >
                    <el-link
                      slot="reference"
                      style="margin-left: 10px"
                      @click="downloadTestCase(item.test_case, 'false')"
                      >标准输出</el-link
                    ></el-popover
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <!-- 代码展示区域 -->
      <el-card style="margin-top: 20px; padding: 20px">
        <div style="display: flex; justify-content: space-between">
          <span style="font-size: 20px; font-weight: 500">源代码</span>
          <span>语言: {{ languageToLabel[language] }}</span>
        </div>
        <el-divider></el-divider>
        <codemirror v-model="code" :options="options"></codemirror>
      </el-card>
    </div>
  </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
// 核心样式
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css"; // 白色
import "codemirror/mode/python/python.js"; // python
import {
  problemTitleRequest,
  problemCanTestCase,
  problemSingleTestCaseInfoRequest,
} from "@/request/problemRequest";
import { submissionInfoRequest } from "@/request/submissionRequest";
import { BASE_URL, formatTime } from "@/assets/config";

export default {
  data() {
    return {
      isNoPermission: false,
      BASE_URL,
      // 代码编辑器默认配置
      options: {
        tabSize: 2, // 缩进格式
        theme: "idea", // 主题，对应主题库 JS 需要提前引入
        lineNumbers: true, // 显示行号
        line: true,
        lineWrapping: true, //代码折叠
        styleActiveLine: true, // 高亮选中行
        readOnly: true,
        hintOptions: {
          completeSingle: true, // 当匹配只有一项的时候是否自动补全
        },
      },
      code: "", // 所提交的代码值
      uuid: "",
      region: "",
      problem_id: "",
      problemTitle: "",
      subResult: "3", //提交结果：0-成功；1-失败；2-编译错误
      err: null,
      error_reason: "",
      result_err_reason: "",
      subTime: "",
      state: "",
      language: "",
      languageToLabel: {
        c: "C语言",
        py2: "python2",
        py3: "python3",
        java: "Java",
        cpp: "C++",
      },
      resultColor: [
        {
          result: "SUCCESS",
          color: "#5fc931",
        },
        {
          result: "CPU_TIME_LIMIT_EXCEEDED",
          color: "darkblue",
        },
        {
          result: "REAL_TIME_LIMIT_EXCEEDED",
          color: "darkgoldenrod",
        },
        {
          result: "MEMORY_LIMIT_EXCEEDED",
          color: "darkslategrey",
        },
        {
          result: "RUNTIME_ERROR",
          color: "darkmagenta",
        },
        {
          result: "WRONG_ANSWER",
          color: "#f05459",
        },
      ],
      testCase: [],
      canShowTestCase: false,
      standardTestCaseData: "",
    };
  },
  created() {
    this.uuid = this.$route.params.uuid;
    if (this.uuid != "") {
      this.getResult(this.uuid);
    }
  },
  methods: {
    // 获取结果
    getResult: function (uuid) {
      const that = this;
      submissionInfoRequest(uuid)
        .then(function (response) {
          that.getProblemTitle(response.problem_id);
          that.getCanShowTestCase(response.region);
          that.region = response.region;
          that.problem_id = response.problem_id;
          that.subTime = response.submit_time;
          that.code = response.settings.src;
          that.state = response.state;
          that.language = response.language;
          if (response.state === "Finished") {
            that.testCase = response.result.details;
            if (response.err !== null) {
              // 编译失败
              that.subResult = 2;
              that.err = response.err;
              that.error_reason = response.result.err_reason;
            } else {
              // 编译成功
              that.err = response.err;
              if (response.is_accepted === true) {
                // 提交通过
                that.subResult = 0;
              } else {
                // 提交未通过
                that.subResult = 1;
              }
            }
          }
        })
        .catch(() => {
          this.isNoPermission = true;
        });
    },

    // 获取题目标题
    getProblemTitle(problem_id) {
      problemTitleRequest(problem_id)
        .then((response) => {
          this.problemTitle = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 获取能否展示测试点
    getCanShowTestCase(region) {
      problemCanTestCase(region)
        .then((response) => {
          this.canShowTestCase = response.can_view_testcases;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 格式化展示时间
    formatTime,

    // 测试点背景颜色
    showTestCaseBackgroundColor(result) {
      const color = this.resultColor.filter((item) => {
        return item.result === result;
      })[0].color;
      return `background-color:${color}`;
    },

    // 友好展示提交内存
    submissionMemoryFormat(memory) {
      if (memory === null) {
        return "--";
      } else {
        // 1048576 = 1024 * 1024
        let t = parseInt(memory) / 1048576;
        return String(t.toFixed(0)) + " MB";
      }
    },

    downloadTestCase(test_case_id, isInput) {
      problemSingleTestCaseInfoRequest(
        this.region,
        this.problem_id,
        test_case_id,
        isInput
      ).then((response) => {
        this.standardTestCaseData = response;
      });
    },
  },
  components: {
    codemirror,
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-alert__title {
  font-size: 20px !important;
  font-weight: 500;
}
/deep/ .el-alert__icon {
  width: 35px !important;
}
/deep/ .el-alert__icon.is-big {
  width: 35px !important;
}
/deep/.el-card__body {
  padding: 10px !important;
}
.noContextBlock {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.noContextPic {
  width: 150px;
}

.tipColor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
.testCaseWrap {
  max-height: 300px;
  display: flex;
  flex-wrap: wrap;
}
.testCase {
  margin: 8px;
  width: 120px;
  height: 130px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  padding-left: 23px;
  color: white;
}
.testCaseTitle {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 8px;
}
.testCaseContent {
  font-size: 12px;
  letter-spacing: 0px;
}
.testCaseContentTitle {
  font-weight: 450;
  margin-right: 6px;
}
.testCaseDownload .el-link.el-link--default {
  font-size: 5px;
  color: #00fdfd;
}
.testCaseDownload .el-link.el-link--default:hover {
  color: #275ac0;
}
</style>