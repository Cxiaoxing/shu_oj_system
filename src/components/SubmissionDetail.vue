<template>
  <div style="font-family: PingFang SC">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
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
        <div
          style="
            font-family: PingFang SC;
            font-size: 20px;
            font-weight: 500;
            color: #303133;
          "
        >
          {{ problemtitle }}
        </div>
        <div v-if=" hasPermission== true">
          <!-- 状态显示 -->
          <div >
            <span
              style="
                font-family: PingFang SC;
                font-size: 16px;
                font-weight: 500;
                color: #303133;
              "
              >State
            </span>
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
            <span
              style="
                font-family: PingFang SC;
                font-size: 16px;
                font-weight: 500;
                color: #303133;
              "
              >When
            </span>
            <span
              style="font-family: PingFang SC; font-size: 14px; color: #606A78"
              >{{ formatTime(subTime) }}</span
            >
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <!-- 无权查看完成判题 -->
      <div class="noContextBlock" v-if="hasPermission == false">
        <div>
          <img class="noContextPic" src="../img/nocontext.svg" />
        </div>
        <div style="font-size: 14px">无权查看</div>
      </div>
      <!-- 暂未完成判题 -->
      <div class="noContextBlock" v-if="state != 'Finished' && hasPermission == true">
        <div>
          <img class="noContextPic" src="../img/nocontext.svg" />
        </div>
        <div style="font-size: 14px">暂未完成判题，请稍后查看</div>
      </div>
      <!-- 已完成判题，编译错误，展示编译错误信息 -->
      <div v-if="state == 'Finished' && err !== null">
        <div style="color: #f54a45">错误原因：</div>
        <div style="font-size: 14px; margin-top: 5px">{{ error_reason }}</div>
      </div>

      <!-- 已完成判题&编译正确，展示测试点信息 -->
      <div v-if="state == 'Finished' && err === null">
        <div style="font-size: 16px; font-weight: 500">测试点详情</div>

        <div
          v-for="(testCase, index) in testCase"
          :index="index + ''"
          :key="index"
          class="timeLine"
        >
          <div class="timeLineLeft">
            <div class="timeLineCircle">
              <img v-if="testCase.result === 'SUCCESS'" class="timeLineImage" src="../img/right.svg" />
              <img v-if="testCase.result !== 'SUCCESS'" class="timeLineImage" src="../img/wrong.svg" />
            </div>
            <div class="timeLineLine"></div>
          </div>
          <div class="timeLineRight">
            <div class="timeLineTitle">Case {{ index+1 }}</div>
            <div class="timeLineContext">
              <span class="timeLineContextTitle">{{
                testCase.result
              }}</span>
              <el-row style="margin-top: 8px">
                <el-col class="timeLineContextWord" :span="8">CPU Time: {{ testCase.cpu_time }} ms</el-col>
                <el-col class="timeLineContextWord" :span="8">Memory: {{ submissionMemoryFormat(testCase.memory) }}</el-col>
                <el-col class="timeLineContextWord" :span="8">Output: {{ testCase.output }}</el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 代码展示区域 -->
    <el-card v-if="hasPermission=== true" style="margin-top: 20px; padding: 20px">
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

export default {
  name: "submissionDetail",
  data() {
    return {
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
      problemtitle: "",
      subResult: "3", //提交结果：0-成功；1-失败；2-编译错误
      err: null,
      error_reason: "",
      result_err_reason: "",
      subTime: "",
      state: "",
      language: "",
      testCase: [],
      timelinecolor: "",
      timelinecolor: {
        success: "#00b42a",
        unsuccess: "#f54a45",
      },
      // 题目提交结果
      submission: [],
      hasPermission:false,
    };
  },
  created() {
    this.uuid = this.$route.params.uuid;
    if (this.uuid != "") {
      this.getResult(this.uuid);
    }
  },
  methods: {
    // 获取题目信息
    getProblem: function (region) {
      var that = this;
      this.$axios({
        method: "get",
        url: "/problems/" + region,
      })
        .then(function (response) {
          that.problemtitle = response.data.info.title;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 格式化展示时间
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
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

    // 获取结果
    getResult: function (uuid) {
      var that = this;
      this.$axios({
        method: "get",
        url: "/submissions/" + uuid,
      })
        .then(function (response) {
          console.log(response.data);
          that.hasPermission = true;
          that.getProblem(response.data.problem_id);
          that.subTime = response.data.submit_time;
          that.code = response.data.settings.src;
          that.state = response.data.state;
          that.language = response.data.language;
          if (response.data.state === "Finished") {
            that.testCase = response.data.result.details;
            if (response.data.err !== null) {
              // 编译失败
              that.subResult = 2;
              that.err = response.data.err;
              that.error_reason = response.data.result.err_reason;
            } else {
              // 编译成功
              that.err = response.data.err;
              if (response.data.is_accepted === true) {
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
    colors(index) {
      if (index == "SUCCESS") {
        return "#00b42a";
      } else {
        return "#f54a45";
      }
    },
  },
  components: {
    codemirror,
  },
};
</script>
<style lang="less" scoped>
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
.testCase {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.testCaseItem {
  margin: 10px;
  padding-top: 5px;
  height: 180px;
  width: 180px;
  color: #ffffff;
}
.testCaseIndex {
  font-size: 18px;
  font-weight: 400;
}
.success {
  background-color: #00b42a;
}
.warning {
  background-color: #f54a45;
  border-radius: 10px;
}
.content {
  margin-top: 20px;
}
.timeLine {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
}
.timeLineLeft {
  display: flex;
  flex-direction: column;
}
.timeLineRight {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
}
.timeLineCircle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #f0f1f2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeLineImage {
  width: 25px;
}
.timeLineTitle {
  font-family: PingFang SC;
font-size: 16px;
font-style: normal;
font-weight: 600;
line-height: 24px;
letter-spacing: 0px;
text-align: left;
color: #081023;
}

.timeLineContext {
  background-color: #F5f6f7;
  margin-top: 12px;
  padding: 16px 24px 16px 24px;
  width: 954px;
  border-radius: 4px;
}

.timeLineContextTitle {
  font-family: PingFang SC;
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: 22px;
letter-spacing: 0px;
text-align: left;
color: #081023;


}

.timeLineContextWord {
  font-family: PingFang SC;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 14px;
letter-spacing: 0px;
text-align: left;
color: #606A78;
}



</style>