<template>
  <div>
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
        <!-- 但比赛期间不能查看提交详情 -->
        <div class="noContextBlock" v-else>
          <div>
            <img class="noContextPic" src="@/assets/img/nocontext.svg" />
          </div>
          <div style="font-size: 14px">比赛期间不能查看提交详情</div>
        </div>
      </el-card>

      <!-- 代码展示区域 -->
      <el-card style="margin-top: 20px; padding: 20px">
        <div class="row_space">
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
import { problemTitleRequest } from "@/request/problemRequest";
import { submissionInfoRequest } from "@/request/submissionRequest";
import { formatTime } from "@/assets/config";

export default {
  data() {
    return {
      isNoPermission: true,
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
      submissionInfoRequest(uuid)
        .then((response) => {
          this.isNoPermission = false;
          this.getProblemTitle(response.problem_id);
          this.subTime = response.submit_time;
          this.code = response.settings.src;
          this.state = response.state;
          this.language = response.language;
          if (response.state === "Finished") {
            if (response.err !== null) {
              // 编译失败
              this.subResult = 2;
              this.err = response.err;
              this.error_reason = response.result.err_reason;
            } else {
              // 编译成功
              this.err = response.err;
              if (response.is_accepted === true) {
                // 提交通过
                this.subResult = 0;
              } else {
                // 提交未通过
                this.subResult = 1;
              }
            }
          }
        })
        .catch(() => {
          this.isNoPermission = true;
        });
    },

    // 获取题目信息
    getProblemTitle(problem_id) {
      problemTitleRequest(problem_id)
        .then((response) => {
          this.problemTitle = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 格式化展示时间
    formatTime,
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
</style>