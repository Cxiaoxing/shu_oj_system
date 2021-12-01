<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{ name: 'problemDetail', params: { id: problem_id } }"
        >{{ problemtitle }}</el-breadcrumb-item
      >
      <el-breadcrumb-item
        :to="{ name: 'sampleList', params: { id: problem_id } }"
        >管理标程</el-breadcrumb-item
      >
      <el-breadcrumb-item>提交详情</el-breadcrumb-item>
    </el-breadcrumb>
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
        <div style="font-size: 20px; font-weight: 500">
          {{ problemtitle }}
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
                  : state == 'Wainting'
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
            <span style="font-size: 16px; font-weight: 500; color: #303133"
              >When
            </span>
            <span style="font-size: 14px; color: #606a78">{{
              formatTime(subTime)
            }}</span>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <!-- 暂未完成判题 -->
      <div class="noContextBlock" v-if="state != 'Finished'">
        <div>
          <img class="noContextPic" src="@/assets/img/nocontext.svg" />
        </div>
        <div style="font-size: 14px">暂未完成判题，请稍后查看</div>
      </div>
      <!-- 编译错误，展示编译错误信息 -->
      <div v-else-if="err !== null">
        <div style="color: #f54a45">错误原因：</div>
        <div style="font-size: 14px; margin-top: 5px">{{ error_reason }}</div>
      </div>

      <!-- 已完成判题且编译正确，展示测试点信息 -->
      <div v-else>
        <div style="font-size: 20px; font-weight: 450">
          <span>测试点详情</span>
          <el-link
            type="primary"
            :underline="false"
            target="_blank"
            download
            style="margin-left: 12px; font-size: 14px"
            :href="`${BASE_URL}/problems/${problem_id}/test_case`"
            >下载到本地
            <i class="el-icon-download" />
          </el-link>
        </div>
        <div
          class="someTip"
          v-html="'绿色: SUCCESS&emsp;&ensp;红色: WRONG_ANSWER'"
        />
        <div class="testCaseWrap scrollbar">
          <div
            v-for="(item, index) in testCase"
            :index="index + ''"
            :key="index"
          >
            <div
              class="testCase"
              :style="
                item.result === 'SUCCESS'
                  ? { 'background-color': '#5fc931' }
                  : { 'background-color': '#f05459' }
              "
            >
              <div class="testCaseTitle"># Case {{ index + 1 }}</div>
              <div class="testCaseContent">
                <span class="testCaseContentTitle"> CPU Time:</span>
                <span class="testCaseContentDetail">
                  {{ item.cpu_time }} ms</span
                >
              </div>
              <div class="testCaseContent">
                <span class="testCaseContentTitle">Memory:</span>
                <span class="testCaseContentDetail">
                  {{ submissionMemoryFormat(item.memory) }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 代码站址展示区域 -->
    <el-card style="margin-top: 20px; padding: 20px">
      <div style="font-size: 16px; font-weight: 500">语言: {{ language }}</div>
      <el-divider></el-divider>
      <codemirror v-model="code" :options="options"></codemirror>
    </el-card>
  </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
import moment from "moment";
// 核心样式
import "codemirror/lib/codemirror.css";
import "codemirror/theme/idea.css"; // 白色
import "codemirror/mode/python/python.js"; // python

import { sampleInfoRequest } from "@/request/sampleRequest";
import { problemInfoPrivateRequest } from "@/request/problemRequest";
import { BASE_URL, formatTime } from "@/assets/config";

export default {
  data() {
    return {
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
      problem_id: null,
      problemtitle: "",
      subResult: "3", //提交结果：0-成功；1-失败；2-编译错误
      err: null,
      error_reason: "",
      result_err_reason: "",
      subTime: "",
      state: "",
      language: "",
      testCase: [],
      standardTestCaseData: "",
      submission: [], // 题目提交结果
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
      sampleInfoRequest(uuid)
        .then(function (response) {
          console.log(response);
          that.getProblem(response.submission.problem_id);
          that.problem_id = response.submission.problem_id;
          that.subTime = response.submission.submit_time;
          that.code = response.submission.settings.src;
          that.state = response.submission.state;
          that.language = response.submission.language;
          if (response.submission.state === "Finished") {
            that.testCase = response.submission.result.details;
            if (response.submission.err !== null) {
              // 编译失败
              that.subResult = 2;
              that.err = response.submission.err;
              that.error_reason = response.submission.result.err_reason;
            } else {
              // 编译成功
              that.err = response.submission.err;
              if (response.submission.is_accepted === true) {
                // 提交通过
                that.subResult = 0;
              } else {
                // 提交未通过
                that.subResult = 1;
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 获取题目信息
    getProblem(problem_id) {
      problemInfoPrivateRequest(problem_id)
        .then((response) => {
          this.problemtitle = response.info.title;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 格式化展示时间
    formatTime,

    // 友好展示提交耗时
    submissionTimeFormat(time) {
      if (time === null) {
        return "--";
      } else {
        return time + " ms";
      }
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