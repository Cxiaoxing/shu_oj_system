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
        {{ countdown.hours }}小时 {{ countdown.minutes }}分
        {{ countdown.seconds }}秒</span
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
      <el-tab-pane label="概览" name="first">
        <div class="cardLayout">
          <!-- 竞赛信息 -->
          <el-card class="leftCard">
            <div class="leftCardTop">
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
                  v-if="contest.is_registered === false && canRegister === true"
                  type="primary"
                  @click="goRegister"
                  >报名</el-button
                >
                <el-button
                  v-if="
                    contest.is_registered === false && canRegister === false
                  "
                  type="primary"
                  disabled
                  @click="goRegister"
                  >报名</el-button
                >
              </div>
            </div>
            <!-- 竞赛时间 -->
            <div class="item">
              <div class="itemRec"></div>
              <div>
                <div class="itemTitle">时间</div>
                <div>
                  <div class="rankItem margin-top-10">
                    <div class="flex-row" v-if="contest.start_time !== null">
                      <img class="itemIcon" src="../img/time.svg" />
                      <div class="itemContentTimeTitle">开始:</div>
                      <div class="itemContentTime">
                        {{ formatTime(contest.start_time) }}
                      </div>
                    </div>
                    <div
                      v-if="contest.end_time !== null"
                      class="flex-row margin-left-30"
                    >
                      <img class="itemIcon" src="../img/time.svg" />
                      <div class="itemContentTimeTitle">结束:</div>
                      <div class="itemContentTime">
                        {{ formatTime(contest.end_time) }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="contest.seal_time !== null"
                    class="flex-row margin-top-5"
                  >
                    <img class="itemIcon" src="../img/time.svg" />
                    <div class="itemContentTimeTitle">封榜:</div>
                    <div class="itemContentTime">
                      {{ formatTime(contest.seal_time) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 竞赛描述 -->
            <div class="item">
              <div class="itemRec"></div>
              <div>
                <div class="itemTitle">描述</div>
                <div
                  v-if="contest.introduction !== ''"
                  class="itemContent margin-top-10"
                  style="white-space: normal; word-break: break-all"
                >
                  <span style="word-wrap: break-word">{{
                    contest.introduction
                  }}</span>
                </div>
                <div v-if="contest.introduction === ''" class="itemContent">
                  暂无描述
                </div>
              </div>
            </div>
          </el-card>
          <!-- 排行榜 -->
          <el-card class="rightCard">
            <div class="rightCardTop">
              <div class="rightCardTop">
                <img class="rankIcon" src="../img/trophy.svg" />
                <span class="contestTitle" style="margin-left: 10px"
                  >排行榜</span
                >
              </div>
              <div class="flex-row">
                <img class="itemIcon" src="../img/time.svg" />
                <span class="itemContentTimeTitle">更新: </span>
                <span class="itemContentTime">{{
                  formatTime(contest.start_time)
                }}</span>
              </div>
            </div>
            <div
              v-if="ranklist.length === 1 && ACLPermissions === true"
              class="rightCardBody flex-col"
            >
              <img class="noContextPic" src="../img/nocontext.svg" />
              <span class="itemContent margin-top-10">暂无排名</span>
            </div>
            <div v-if="ACLPermissions === false" class="rightCardBody flex-col">
              <img class="noContextPic" src="../img/noPermissions.svg" />
              <span class="itemContent margin-top-10"
                >未报名，暂无查看权限</span
              >
            </div>
            <div
              v-if="ranklist.length !== 1 && ACLPermissions === true"
              class="rightCardBody"
            >
              <div v-for="(rank, index) in ranklist" :key="index">
                <div class="rankItem" v-if="rank.is_unrated == false">
                  <div class="rankOrder">第 {{ rank.rank }} 名</div>
                  <div class="rankUser">{{ rank.account }}</div>
                  <div class="rankTime">{{ secondFormat(rank.time_cost) }}</div>
                </div>
              </div>
            </div>
            <div
              v-if="ranklist.length !== 1 && ACLPermissions === true"
              class="rankDetailLink"
            >
              <a class="rankDetail" @click.stop="goRankDetail()">详情</a>
            </div>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="题目列表" name="second">
        <el-card>
          <el-table :data="contestSubmissionList">
            <template slot="empty">
              <div
                v-if="ACLPermissions === true"
                class="rightCardBody flex-col"
              >
                <img class="noContextPic" src="../img/nocontext.svg" />
                <span class="itemContent margin-top-10">暂无数据</span>
              </div>
              <div
                v-if="ACLPermissions === false"
                class="rightCardBody flex-col"
              >
                <img class="noContextPic" src="../img/noPermissions.svg" />
                <span class="itemContent margin-top-10"
                  >未报名，暂无查看权限</span
                >
              </div>
            </template>
            <el-table-column prop="inner_id" width="80" label="ID">
            </el-table-column>
            <el-table-column prop="out_problem.info.title" label="名称">
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <!-- 答题按钮 -->
                <el-button
                  size="small"
                  type="primary"
                  @click="
                    goProblemDetail(
                      scope.row.region,
                      scope.row.out_problem.id,
                      scope.row.inner_id
                    )
                  "
                  >答题</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            hide-on-single-page
            @current-change="getContestProblemList"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="prev, pager, next, jumper"
            :total="problemTotal"
            style="margin-top: 30px; text-align: center"
          >
          </el-pagination>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="排行榜" name="third">
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
                class="rightCardBody flex-col"
              >
                <img class="noContextPic" src="../img/noPermissions.svg" />
                <span class="itemContent margin-top-10"
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
            <el-table-column prop="account" label="用户" fixed>
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

      <el-tab-pane label="提交状态" name="fourth">
        <el-card>
          <div class="tableBar">
            <el-button size="small" @click="getStateList()">刷新列表</el-button>
          </div>
          <!-- 列表区域 -->
          <el-table :data="statelist" @row-click="handleClickSubmission">
            <template slot="empty">
              <div v-if="submissionTotal === 0" class="rightCardBody flex-col">
                <img class="noContextPic" src="../img/nocontext.svg" />
                <span class="itemContent margin-top-10">暂无数据</span>
              </div>
            </template>
            <el-table-column label="提交时间" width="200">
              <template slot-scope="scope">
                {{ formatTime(scope.row.submit_time) }}
              </template>
            </el-table-column>
            <el-table-column prop="problem_id" label="题目ID" width="100">
            </el-table-column>
            <el-table-column label="判题状态">
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.state == 'Finished'
                      ? 'success'
                      : scope.row.state == 'Pending'
                      ? ''
                      : scope.row.state == 'Wainting'
                      ? 'info'
                      : ''
                  "
                  size="small"
                >
                  {{ scope.row.state }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="判题结果">
              <template slot-scope="scope">
                <el-tag
                  v-if="scope.row.state === 'Finished'"
                  effect="dark"
                  :type="
                    scope.row.err !== null
                      ? 'warning'
                      : scope.row.err === null && scope.row.is_accepted == true
                      ? 'success'
                      : scope.row.err === null && scope.row.is_accepted == false
                      ? 'danger'
                      : 'success'
                  "
                  size="small"
                >
                  {{
                    resultFormtype(scope.row.err, scope.row.is_accepted)
                  }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="用时">
              <template slot-scope="scope">
                {{ submissionTimeFormat(scope.row.max_time) }}
              </template>
            </el-table-column>
            <el-table-column label="内存"
              ><template slot-scope="scope">
                {{ submissionMemoryFormat(scope.row.max_memory) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="language"
              label="语言"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="user_id"
              label="用户"
              width="50"
            ></el-table-column>
          </el-table>
          <el-pagination
            background
            hide-on-single-page
            @current-change="getStateList"
            :page-size="pageSize"
            :current-page="currentPage"
            layout="prev, pager, next, jumper"
            :total="submissionTotal"
            style="margin-top: 30px; text-align: center"
          >
          </el-pagination>
        </el-card>
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
  contestListRequest,
  contestRankRequest,
  contestRegisterRequest,
  contestProblemListRequest
} from "../request/contestRequest";
import { submissionListRequest } from "../request/submissonRequest";
export default {
  data() {
    return {
      ctitle: "", // 接受上一个页面的参数
      contest: [], // 所获取到的竞赛信息
      region: "",
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
      activeName: "first",
      problem_block: [],
      countdown: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    };
  },
  async created() {
    this.ctitle = this.$route.params.title;
    this.region = this.$route.params.region;
    this.getContest();
    this.getRankList();
  },
  methods: {
    // 获取竞赛信息
    getContest() {
      var that = this;
      const params = {
        title_filter: this.ctitle,
        limit: 1,
        offset: 0,
      };
      contestListRequest(params)
        .then(function (response) {
          that.contest = response.list[0];
          let contest = response.list[0];
          that.judgeCanRegister();
          if (
            contest.state === "Running" ||
            contest.state === "SealedRunning"
          ) {
            that.calculateCountdown(contest.end_time);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 获取排名
    getRankList() {
      var that = this;
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
        var that = this;
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
      var that = this;
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
            message: "密码错误！",
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
      } else {
        return false;
      }
    },
    // 开始比赛，跳转至比赛提交页
    startTheContest() {
      let region = this.region;
      let that = this;
      that.$router.push({
        name: "contestProblemList",
        params: { region: region },
      });
    },
    // 查看排行榜详情
    goRankDetail() {
      this.activeName = "third";
    },
    // 获取提交状态列表
    getStateList(currentPage = 1) {
      var that = this;
      const params = {
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
        region_filter: this.region,
      };
      submissionListRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.statelist = response.list;
          that.submissionTotal = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 判断判题结果，返回对应文字
    resultFormtype(err, is_accepted) {
      if (err != null) {
        return "Compile Error";
      } else {
        if (is_accepted == true) {
          return "Accepted";
        } else {
          return "Unaccepted";
        }
      }
    },

    handleClick(tab, event) {
      if (tab.name == "fourth") {
        this.getStateList();
      } else if (tab.name == "second") {
        this.getContestProblemList(this.region);
      } else if (tab.name == "third") {
        this.getRankList();
      }
    },

    // 获取该竞赛的题目列表
    getContestProblemList(re, currentPage = 1) {
      var that = this;
      const params = {
          inner_id_order: true,
          limit: this.pageSize,
          offset: this.pageSize * (currentPage - 1),
        }
      contestProblemListRequest(re, params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.contestSubmissionList = response.list;
          that.problemTotal = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 点击题目跳转至题目详情
    goProblemDetail(re, pid, inner_id) {
      let region = re;
      let id = pid;
      let that = this;
      this.$router.push({
        name: "contestProblemDetail",
        params: {
          region: region,
          id: id,
          inner_id: inner_id,
          total: that.problemTotal,
        },
      });
    },

    // 跳转至提交结果详情
    handleClickSubmission(row) {
      let uuid = row.id;
      let that = this;
      that.$router.push({ name: "submissionDetail", params: { uuid: uuid } });
    },

    // 友好展示比赛总耗时
    secondFormat(seconds) {
      let m = moment.duration(seconds, "seconds");
      return Math.floor(m.asHours()) + ":" + m.minutes() + ":" + m.seconds();
    },
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

    // 判断当前是否允许报名
    judgeCanRegister() {
      if (this.contest.state === "Preparing") {
        return (this.canRegister = true);
      } else if (
        this.contest.state === "Running" ||
        this.contest.state === "SealedRunning"
      ) {
        if (this.contest.settings.register_after_start === true) {
          return (this.canRegister = true);
        } else {
          return (this.canRegister = false);
        }
      } else if (this.contest.state === "Ended") {
        if (this.contest.settings.public_after_end === true) {
          return (this.canRegister = true);
        } else {
          return (this.canRegister = false);
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
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
  font-family: PingFang SC;
  font-size: 18px;
  color: #505050;
}

.contestCountdown {
  font-family: PingFang SC;
  font-size: 18px;
  font-weight: 600;
  color: #3370ff;
}
.cardLayout {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.leftCard {
  width: 64%;
}
.leftCardTop {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.contestTitle {
  font-family: PingFang SC;
  font-size: 28px;
  font-style: normal;
  font-weight: 600;
  line-height: 45px;
  letter-spacing: 0em;
  text-align: left;
  color: #494747;
}
.item {
  display: flex;
  flex-direction: row;
  margin-top: 24px;
}

.itemRec {
  width: 5px;
  height: 20px;
  background: #3370ff;
  border-radius: 5px;
}

.itemTitle {
  font-family: PingFang SC;
  font-style: normal;
  font-weight: 450;
  font-size: 16px;
  margin-left: 6px;
  color: #494747;
}

.itemContent {
  font-family: PingFang SC;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  // line-height: 17px;
  color: #505050;
  margin-left: 6px;
  //margin-top: 5px;
}

.itemContentTimeTitle {
  font-family: PingFang SC;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  color: #bebdbd;
  margin-left: 4px;
}

.itemContentTime {
  font-family: PingFang SC;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #505050;
  margin-left: 10px;
}

.rightCard {
  width: 34%;
}

.rightCardTop {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.rankIcon {
  width: 30px;
}

.rightCardBody {
  margin-top: 24px;
}

.rankItem {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.rankDetail {
  font-family: PingFang SC;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: 0em;
  text-align: left;
  color: #3370ff;
  &:hover {
    color: #2d8cf0;
    border-bottom: 1px solid #2d8cf0;
  }
}

.rankDetailLink {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 30px;
}

.rankUser {
  font-family: PingFang SC;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: 0em;
  text-align: left;
  color: #505050;
}

.rankTime {
  font-family: PingFang SC;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: 0em;
  text-align: left;
  color: #606060;
}

.rankOrder {
  font-family: PingFang SC;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: 0em;
  text-align: left;
  color: #505050;
}

.itemIcon {
  width: 18px;
}
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.flex-row-sb {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.margin-left-30 {
  margin-left: 30px;
}

.margin-top-10 {
  margin-top: 10px;
}

.margin-top-5 {
  margin-top: 5px;
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
</style>