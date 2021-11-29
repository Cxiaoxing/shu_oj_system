<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/contest' }">竞赛</el-breadcrumb-item>
      <el-breadcrumb-item>{{ contest.title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 竞赛状态 -->
    <div
      v-if="contest.state === 'Running' || contest.state === 'SealedRunning'"
      class="contestState contestStateSuccess"
    >
      <span class="contestStateWord">本场竞赛已开始，还剩余 </span>
      <span class="contestCountdown">
        {{ countdown.hours }} hours {{ countdown.minutes }} minutes
        {{ countdown.seconds }} seconds</span
      >
      <span class="contestStateWord"> 结束</span>
    </div>
    <div
      v-if="contest.state === 'Ended'"
      class="contestState contestStateUnsuccess"
    >
      <span class="contestStateWord">本场竞赛已结束</span>
    </div>
    <div
      v-if="contest.state === 'Preparing'"
      class="contestState contestStateUnsuccess"
    >
      <span class="contestStateWord">本场竞赛未开始</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="竞赛说明" name="introduction">
        <el-row :gutter="20">
          <!-- 竞赛信息 -->
          <el-col :span="16">
            <el-card>
              <div class="row_space">
                <!-- 竞赛名称 -->
                <div class="contestTitle">{{ contest.title }}</div>
                <!-- 报名按钮 -->
                <div>
                  <el-button
                    v-if="this.contest.is_registered === true"
                    type="primary"
                    disabled
                    >已报名</el-button
                  >
                  <el-button
                    v-else-if="canRegister === true"
                    type="primary"
                    @click="goRegister"
                    >报名</el-button
                  >
                  <el-button v-else type="primary" disabled>报名</el-button>
                </div>
              </div>

              <!-- 竞赛描述 -->
              <mavon-editor
                v-if="contest.introduction !== ''"
                style="min-height: 400px; margin-top: 20px"
                :value="contest.introduction"
                :subfield="false"
                :defaultOpen="'preview'"
                :toolbarsFlag="false"
                :boxShadow="false"
              />
              <div v-else class="itemContent">暂无描述</div>
            </el-card>
          </el-col>

          <!-- 排行榜 -->
          <el-col :span="8">
            <el-card>
              <div>
                <span class="contestTitle">时间</span>
              </div>
              <!-- 竞赛时间 -->
              <div class="editorBackground margin_top_20">
                <div>
                  <div class="row_space">
                    <div>
                      <i class="el-icon-date" />
                      <span class="timeContentTitle">开始时间</span>
                    </div>
                    <div class="itemContent">
                      {{ formatTime(contest.start_time) }}
                    </div>
                  </div>
                  <div class="row_space margin_top_10">
                    <div>
                      <i class="el-icon-date" />
                      <span class="timeContentTitle">结束时间</span>
                    </div>
                    <div class="itemContent">
                      {{ formatTime(contest.end_time) }}
                    </div>
                  </div>
                </div>
                <div class="row_space margin_top_10">
                  <div>
                    <i class="el-icon-date" />
                    <span class="timeContentTitle">封榜时间</span>
                  </div>
                  <div class="itemContent">
                    {{ formatTime(contest.seal_time) }}
                  </div>
                </div>
                <div class="row_space margin_top_10">
                  <div>
                    <i class="el-icon-time" />
                    <span class="timeContentTitle">比赛时长</span>
                  </div>
                  <div class="itemContent">
                    {{ calculateTime(contest.start_time, contest.end_time) }}
                    hours
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="题目列表" name="problem_list">
        <el-card>
          <el-table
            :data="contestSubmissionList"
            @row-click="jumpToProblemDetail"
          >
            <template slot="empty">
              <div
                v-if="ACLPermissions === true"
                class="margin_top_20 flex_col"
              >
                <img class="noContextPic" src="@/assets/img/nocontext.svg" />
                <span class="itemContent margin_top_10">暂无数据</span>
              </div>
              <div
                v-if="ACLPermissions === false"
                class="margin_top_20 flex_col"
              >
                <img
                  class="noContextPic"
                  src="@/assets/img/noPermissions.svg"
                />
                <span class="itemContent margin_top_10"
                  >未报名，暂无查看权限</span
                >
              </div>
            </template>
            <el-table-column prop="inner_id" width="80" label="ID" />
            <el-table-column prop="is_accepted" width="30">
              <template slot-scope="scope">
                <i
                  class="el-icon-success mySubmission"
                  v-if="scope.row.is_accepted"
                />
              </template>
            </el-table-column>
            <el-table-column prop="out_problem.info.title" label="题目名称" />
            <el-table-column prop="submit_times" label="提交次数" width="150" />
            <el-table-column prop="accept_times" label="通过率" width="150">
              <template slot-scope="scope">
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="passingRateCalculate(scope.row)"
                  color="#1db7b5"
                ></el-progress>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            hide-on-single-page
            @current-change="getContestProblemList"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="prev, pager, next, jumper"
            :total="problemTotal"
            class="table_pagination"
          >
          </el-pagination>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="排行榜" name="rank">
        <el-card>
          <div class="tableBar">
            <el-button size="small" @click="getRankList()"
              >刷新排行榜</el-button
            >
          </div>
          <el-table :data="ranklist">
            <template slot="empty">
              <div
                v-if="ACLPermissions === false"
                class="margin_top_20 flex_col"
              >
                <img
                  class="noContextPic"
                  src="@/assets/img/noPermissions.svg"
                />
                <span class="itemContent margin_top_10"
                  >未报名，暂无查看权限</span
                >
              </div>
            </template>
            <el-table-column
              prop="rank"
              label="排名"
              width="100"
              fixed
            ></el-table-column>
            <el-table-column prop="username" label="用户" fixed>
            </el-table-column>
            <el-table-column label="通过(题)">
              <template slot-scope="scope">
                {{ scope.row.total_accepted }}/{{
                  scope.row.problem_block.length
                }}
              </template>
            </el-table-column>
            <el-table-column prop="time_cost" label="耗时(h:m:s)">
              <template slot-scope="scope">
                {{ secondFormat(scope.row.time_cost) }}
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in problem_block"
              :key="index"
              :label="'题 ' + item.inner_id"
            >
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.problem_block[index].is_accepted === true"
                  type="success"
                  effect="dark"
                  >Accepted</el-tag
                >
                <el-tag
                  v-if="scope.row.problem_block[index].is_accepted === false"
                  type="danger"
                  effect="dark"
                  >Unaccepted</el-tag
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="提交状态" name="submission_list">
        <SubmissionTable :region="region" />
      </el-tab-pane>
    </el-tabs>
    <!-- 输入密码弹窗 -->
    <el-dialog
      title="请输入比赛密码"
      :visible.sync="showPasswordDialog"
      width="30%"
    >
      <el-input v-model="password" autocomplete="off"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="registerRequest">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import {
  contestInfoRequest,
  contestRankRequest,
  contestRegisterRequest,
  contestProblemListRequest,
} from "@/request/contestRequest";
import SubmissionTable from "@/components/submission/SubmissionTable.vue";
import { passingRateCalculate } from "@/assets/config";

export default {
  components: { SubmissionTable },
  data() {
    return {
      region: "",
      contest: [], // 所获取到的竞赛信息
      showPasswordDialog: false, // 控制输入密码弹窗
      canRegister: "", // 是否允许报名
      password: "",
      ranklist: [], // 排行榜
      ACLPermissions: "",
      rankUpdatedTime: "",
      statelist: [],
      contestSubmissionList: [],
      currentPage: 1,
      pageSize: 10,
      problemTotal: null,
      acmTotal: null,
      submissionTotal: null,
      activeName: "introduction",
      problem_block: [],
      countdown: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    };
  },
  created() {
    this.region = this.$route.params.region;
    this.getContest();
    this.getContestProblemList();
  },
  methods: {
    // 获取竞赛信息
    getContest() {
      contestInfoRequest(this.region)
        .then((response) => {
          this.contest = response;
          this.judgeCanRegister();
          if (
            response.state === "Running" ||
            response.state === "SealedRunning"
          ) {
            this.calculateCountdown(response.end_time);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 获取排名
    getRankList() {
      const that = this;
      contestRankRequest(this.region)
        .then(function (response) {
          that.ranklist = response.columns;
          that.problem_block = response.columns[0].problem_block;
          that.rankUpdatedTime = response.last_updated_time;
          that.ACLPermissions = true;
        })
        .catch(function (error) {
          if (error.response.status === 401) {
            that.ACLPermissions = false;
          }
        });
    },

    // 格式化展示时间
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },

    calculateTime(start, end) {
      const start_time = moment(start);
      const end_time = moment(end);
      return end_time.diff(start_time, "hours", true).toFixed(1);
    },

    // 倒计时
    calculateCountdown(end_time) {
      clearInterval(this.go);
      let endDate = new Date(this.formatTime(end_time));
      let end = endDate.getTime(); // 结束秒数
      let timeFunction = () => {
        let date = new Date();
        let now = date.getTime();
        let leftTime = end - now;
        if (leftTime >= 0) {
          this.countdown = {
            hours: Math.floor((leftTime / 1000 / 60 / 60) % 24),
            minutes: Math.floor((leftTime / 1000 / 60) % 60),
            seconds: Math.floor((leftTime / 1000) % 60),
          };
        } else {
          // 比赛结束
          clearInterval(go);
        }
      };
      timeFunction();
      let go = setInterval(function () {
        timeFunction();
      }, 1000);
    },

    // 报名
    goRegister() {
      if (this.contest.need_pass === true) {
        this.showPasswordDialog = true;
      } else {
        const that = this;
        contestRegisterRequest(this.contest.region)
          .then(function (response) {
            that.contest.is_registered = true;
            that.getRankList();
            that.$message({
              message:
                that.judgeIsStart() === true &&
                that.contest.settings.unrate_after_start === true
                  ? "报名成功,本次比赛不参与排名"
                  : "报名成功",
              type: "success",
            });
          })
          .catch(function (error) {
            that.$message({
              message: error.response.data,
              type: "warning",
            });
          });
      }
    },

    registerRequest() {
      const that = this;
      const data = {
        password: that.password,
      };
      contestRegisterRequest(this.contest.region, data)
        .then(function (response) {
          that.showPasswordDialog = false;
          that.contest.is_registered = true;
          that.getRankList();
          that.$message({
            message:
              that.judgeIsStart() === true &&
              that.contest.settings.unrate_after_start === true
                ? "报名成功,本次比赛不参与排名"
                : "报名成功",
            type: "success",
          });
        })
        .catch(function (error) {
          console.log(error);
          that.$message({
            message: "密码错误",
            type: "warning",
          });
        });
    },

    // 计算当前比赛是否开始
    judgeIsStart() {
      let startDate = new Date(this.formatTime(this.contest.start_time));
      let start = startDate.getTime(); // 结束秒数
      let date = new Date();
      let now = date.getTime();
      let leftTime = now - start;
      if (leftTime <= 0) {
        return true;
      }
      return false;
    },

    handleClick(tab) {
      if (tab.name === "problem_list") {
        this.getContestProblemList(this.currentPage);
      } else if (tab.name === "rank") {
        this.getRankList();
      }
    },

    // 获取该竞赛的题目列表
    getContestProblemList(currentPage = 1) {
      const that = this;
      const params = {
        inner_id_order: true,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      contestProblemListRequest(this.region, params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.contestSubmissionList = response.list;
          that.problemTotal = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    passingRateCalculate,

    // 点击题目跳转至题目详情
    jumpToProblemDetail(row) {
      const routeUrl = this.$router.resolve({
        name: "contestProblemDetail",
        params: {
          region: row.region,
          inner_id: row.inner_id,
          total: this.problemTotal,
        },
      });
      window.open(routeUrl.href, "_blank");
    },

    // 跳转至提交结果详情
    handleClickSubmission(row) {
      const user_id = window.localStorage.getItem("id");
      if (
        (this.contest.state === "Running" ||
          this.contest.state === "SealedRunning") &&
        row.user_id !== user_id
      ) {
        // 比赛中且非本用户请求时不能跳转
        this.$message({
          message: "比赛过程中不能查看其他用户的提交详情",
          type: "waring",
        });
      } else {
        this.$router.push({
          name: "submissionDetail",
          params: { uuid: row.id },
        });
      }
    },

    // 友好展示比赛总耗时
    secondFormat(seconds) {
      let m = moment.duration(seconds, "seconds");
      return Math.floor(m.asHours()) + ":" + m.minutes() + ":" + m.seconds();
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

    // 判断当前是否允许报名
    judgeCanRegister() {
      if (this.contest.state === "Preparing") {
        this.canRegister = true;
      } else if (
        this.contest.state === "Running" ||
        this.contest.state === "SealedRunning"
      ) {
        if (this.contest.settings.register_after_start === true) {
          this.canRegister = true;
        } else {
          this.canRegister = false;
        }
      } else if (this.contest.state === "Ended") {
        if (this.contest.settings.public_after_end === true) {
          this.canRegister = true;
        } else {
          this.canRegister = false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/.el-tabs__item:focus.is-active.is-focus:not(:active) {
  box-shadow: none;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

/deep/ .el-alert__title {
  font-size: 20px !important;
  font-weight: 450;
}

.contestState {
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #eee;
  border-left-width: 5px;
  border-radius: 3px;
}

.contestStateSuccess {
  border-left-color: #5cb85c;
}

.contestStateUnsuccess {
  border-left-color: #777;
}

.contestStateWord {
  font-size: 18px;
  color: #505050;
}

.contestCountdown {
  font-size: 18px;
  font-weight: 600;
  color: #3370ff;
}

.contestTitle {
  font-size: 28px;
  font-weight: 500;
  line-height: 45px;
  letter-spacing: 0em;
  color: $title_font_color;
}

.timeContentTitle {
  font-weight: 450;
  margin: 0px 18px 0px 6px;
  color: $title_font_color;
}

.itemContent {
  font-weight: bold;
  color: $important_font_color;
}

.noContextPic {
  width: 100px;
}

.tableBar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}

.mySubmission {
  font-size: 20px;
  display: flex;
  color: #5fc931;
}
</style>