<template>
  <div>
    <div class="userCenter">
      <div class="userCenterTop">
        <!-- 个人信息展示卡片 -->
        <el-card class="userInfoCard userCenterTopLeft">
          <!-- 头像区域 -->
          <div class="userImageBlock">
            <div class="userImageBackground">
              <img
                class="userImage"
                src="https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/Oval.svg"
              />
            </div>
          </div>
          <!-- 编辑个人信息 -->
          <div class="editInfoButton" @click="userDialogVisible = true">
            <span class="editInfoButtonWord">编辑个人信息</span>
          </div>
          <!-- 个人信息展示区域 -->
          <div class="userInfoBlock">
            <div class="infoDetail">
              <img class="infoIcon" src="../img/account.svg" />
              <span class="infoWordRight">账号</span>
              <span class="infoWord"> {{ userInfo.account }}</span>
            </div>
            <div class="infoDetail">
              <img class="infoIcon" src="../img/account.svg" />
              <span class="infoWordRight">手机</span>
              <span class="infoWord"> {{ userInfo.mobile }}</span>
            </div>
            <div class="infoDetail">
              <img class="infoIcon" src="../img/account.svg" />
              <span class="infoWordRight">角色</span>
              <span v-if="userInfo.role === 'sup'" class="infoWord"
                >超级管理员</span
              >
              <span v-if="!userInfo.role" class="infoWord">普通用户</span>
              <span v-if="userInfo.role === 'admin'" class="infoWord"
                >管理员</span
              >
            </div>
          </div>
        </el-card>
        <el-card class="userCenterTopRight">
          <!-- 数据总览 -->
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              padding: 10px;
            "
          >
            <div>
              <div class="TopRightSmallWord">提交次数</div>
              <div class="TopRightContext">
                <img src="../img/Subtract2.svg" />
                <span class="TopRightBigWord">
                  {{ submitCounts.total_submit_times }}</span
                >
              </div>
            </div>
            <div>
              <div class="TopRightSmallWord">通过次数</div>
              <div class="TopRightContext">
                <img src="../img/Subtract.svg" />
                <span class="TopRightBigWord">
                  {{ submitCounts.total_accept_times }}</span
                >
              </div>
            </div>
            <div>
              <div class="TopRightSmallWord">通过率</div>
              <div class="TopRightContext">
                <img src="../img/Subtract3.svg" />
                <span class="TopRightBigWord">
                  {{
                    (
                      (submitCounts.total_accept_times /
                        submitCounts.total_submit_times) *
                      100
                    ).toFixed(2)
                  }}%</span
                >
              </div>
            </div>
          </div>
          <!-- 热力图展示区域 -->
          <div class="heetmap">
            <calendar-heatmap :end-date="myDate" :values="submissionsTime" />
          </div>
        </el-card>
      </div>
      <div class="userCenterButtom">
        <el-tabs>
          <el-tab-pane>
            <span slot="label" class="tabWord">提交记录</span>
            <div
              class="submissionItem"
              v-for="(submissions, index) in submissionslist"
              :key="index"
            >
              <div
                class="submission"
                @click="goSubmissionDetail(submissions.id)"
              >
                <div>
                  <span class="submissionWordLight">我在题目</span>
                  <span class="submissionWordHeavy">
                    {{ submissions.problem_id }}
                  </span>
                  <span class="submissionWordLight">中使用</span>
                  <span class="submissionWordHeavy">
                    {{ submissions.language }}
                  </span>
                  <span class="submissionWordLight">进行了提交</span>
                </div>
                <div>
                  <el-tag
                    effect="dark"
                    size="medium"
                    style="margin-right: 20px"
                    type="warning"
                    v-if="submissions.err !== null"
                    >Compile Error</el-tag
                  >
                  <el-tag
                    effect="dark"
                    size="medium"
                    style="margin-right: 20px"
                    type="success"
                    v-if="
                      submissions.err === null &&
                      submissions.is_accepted === true
                    "
                    >Accepted</el-tag
                  >
                  <el-tag
                    effect="dark"
                    size="medium"
                    style="margin-right: 20px"
                    type="danger"
                    v-if="
                      submissions.err === null &&
                      submissions.is_accepted === false
                    "
                    >Unaccepted</el-tag
                  >
                  <span class="submissionWordLight">{{
                    formatTime(submissions.submit_time)
                  }}</span>
                </div>
              </div>
            </div>
            <el-pagination
              small
              hide-on-single-page
              @current-change="getSubmissionsList"
              :page-size="pageSize"
              :current-page="currentPage"
              layout="prev, pager, next"
              :total="total"
              style="margin-top: 30px; text-align: end"
            >
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label" class="tabWord">数据统计</span>
            <el-row :gutter="30" style="margin-top: 40px">
              <!-- 题目提交难度分布饼图 -->
              <el-col :span="12">
                <div
                  id="difficulty_pie_chart"
                  style="width: 450px; height: 400px"
                ></div>
              </el-col>
              <el-col :span="12">
                <!-- 题目提交难度通过、未通过分布柱状图 -->
                <div
                  id="difficulty_column_chart"
                  style="width: 500px; height: 400px"
                ></div>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 个人信息对话框 -->
    <el-dialog title="个人信息" :visible.sync="userDialogVisible" width="40%">
      <!-- 内容主体区域 -->
      <el-form :model="userInfo">
        <el-row>
          <el-form-item>
            <span slot="label">
              <span class="lableWord">账号</span>
            </span>
            <el-input v-model="userInfo.account"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <span slot="label">
              <span class="lableWord">手机</span>
            </span>
            <el-input v-model="userInfo.mobile"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <span slot="label">
              <span class="lableWord">新密码</span>
            </span>
            <el-input v-model="userInfo.password"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <span slot="label">
              <span class="lableWord">确认密码</span>
            </span>
            <el-input v-model="userInfo.passwordConfirm"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <el-button
        type="primary"
        plain
        size="medium"
        @click="updateRequest(userId)"
        >更新</el-button
      >
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import echarts from "../utils/initEcharts";
import {
  userCheckOnlineRequest,
  userEditRequest,
  userInfoRequest,
  userSubmitDiffcultyInfoRequest,
  userSubmitNumberInfoRequest,
  userSubmitListRequest,
} from "../request/userRequest";
require("echarts/theme/macarons"); //引入饼图主题
export default {
  data() {
    return {
      userDialogVisible: false,
      userInfo: {},
      userId: "",
      submissionslist: [],
      submitCounts: {},
      submissionsTime: [],
      myDate: "",
      currentPage: 1,
      pageSize: 10,
      total: null,
    };
  },
  mounted() {},
  created() {
    this.myDate = new Date();
    var that = this;
    userCheckOnlineRequest()
      .then(function (response) {
        if (response) {
          that.userId = response.id;
          that.getUserInfo();
          that.getDifficultyInfo();
          that.getSubmissionsList();
          that.getSubmissionsTime();
        }
      })
      .catch(function (error) {
        window.localStorage.clear();
        console.log(error);
      });
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      var that = this;
      userInfoRequest(this.userId)
        .then(function (response) {
          that.userInfo = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 获取题目难度信息
    getDifficultyInfo() {
      var that = this;
      userSubmitDiffcultyInfoRequest(that.userId)
        .then(function (response) {
          that.submitCounts = response;
          that.$nextTick(function () {
            that.getDifficultyPie();
            that.getDifficultyColumn();
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 获取题目提交次数统计
    getSubmissionsTime() {
      var that = this;
      userSubmitNumberInfoRequest(this.userId)
        .then(function (response) {
          that.submissionsTime = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 发起修改用户请求
    updateRequest: function (userInfo) {
      const data = {
        new_account: this.userInfo.account,
        new_mobile: this.userInfo.mobile,
        new_password: this.userInfo.password,
      };
      let that = this;
      userEditRequest(this.userInfo.id, data)
        .then(function (response) {
          //关闭对话框
          that.userDialogVisible = false;
          // 重新获取用户信息
          // 提示用户修改成功
          that.$message({
            message: "更新用户信息成功！",
            type: "success",
          });
        })
        .catch(function (error) {
          that.$message({
            message: "更新用户信息失败!",
            type: "warning",
          });
          console.log(error);
        });
    },
    // 个人提交记录
    getSubmissionsList(currentPage = 1) {
      var that = this;
      const params = {
        user_id_filter: this.userId,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      userSubmitListRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.total = response.total;
          that.submissionslist = response.list;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    // 格式化展示时间
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },

    // 查看提交详情（外部）
    goSubmissionDetail(uid) {
      let uuid = uid;
      let that = this;
      that.$router.push({ name: "submissionDetail", params: { uuid: uuid } });
    },

    // 绘制提交题目困难度分布饼图
    getDifficultyPie() {
      // 绘制图表
      var myChart = echarts.init(
        document.getElementById("difficulty_pie_chart"),
        "macarons"
      );
      // 指定图表的配置项和数据
      var option = {
        // 标题
        title: {
          text: "题目提交困难度分布饼图", // 标题
          // subtext: "", // 副标题
          x: "center", // 标题位置 left center right
          textStyle: {
            marginButttom: 10,
          },
        },
        // 鼠标划过时饼状图上显示的数据
        tooltip: {
          trigger: "item",
          // formatter: "{a} <br/>{b} : {c} ({d}%)", // 显示的数据格式
        },
        // 图例  标注各种颜色代表的模块
        legend: {
          // orient: 'vertical', // 图例的显示方式  默认横向horizontal显示
          bottom: 10, // 控制图例出现的距离  默认左上角
          left: "center", // 控制图例的位置
          data: ["入门", "简单", "中等", "困难"], // 图例上显示的饼图各模块上的名字
        },
        // 饼图数据
        series: {
          // name: "提交题目困难度分布",
          type: "pie", // echarts图的类型   pie代表饼图
          radius: ["40%", "70%"], // 饼图中饼状部分的大小所占整个父元素的百分比
          center: ["50%", "50%"], // 整个饼图在整个父元素中的位置
          itemStyle: {
            // 圆角
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 1,
          },
          data: [
            //每个模块的名字和值
            { name: "入门", value: this.submitCounts.navie_submit_times },
            { name: "简单", value: this.submitCounts.easy_submit_times },
            { name: "中等", value: this.submitCounts.middle_submit_times },
            { name: "困难", value: this.submitCounts.hard_submit_times },
          ],
        },
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    // 绘制提交题目各难度通过、未通过柱状
    getDifficultyColumn() {
      var myChart = echarts.init(
        document.getElementById("difficulty_column_chart")
      );
      var option = {
        title: {
          text: "题目提交通过、未通过柱状图",
          x: "center", // 标题位置 left center right
          textStyle: {
            marginButttom: 10,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["提交通过", "提交未通过"],
          bottom: 10, // 控制图例出现的距离  默认左上角
          left: "center", // 控制图例的位置
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: ["入门", "简单", "中等", "困难"],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "提交通过",
            type: "bar",
            data: [
              this.submitCounts.navie_accept_times,
              this.submitCounts.easy_accept_times,
              this.submitCounts.middle_accept_times,
              this.submitCounts.hard_accept_times,
            ],
          },
          {
            name: "提交未通过",
            type: "bar",
            data: [
              this.submitCounts.navie_submit_times -
                this.submitCounts.navie_accept_times,
              this.submitCounts.easy_submit_times -
                this.submitCounts.easy_accept_times,
              this.submitCounts.middle_submit_times -
                this.submitCounts.middle_accept_times,
              this.submitCounts.hard_submit_times -
                this.submitCounts.hard_accept_times,
            ],
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-tag--mini {
  height: 25px !important;
  padding: 0 15px;
  line-height: 20px;
}
/deep/ .el-tag {
  font-size: 14px;
}
.userCenter {
  display: flex;
  flex-direction: column;
}
.userCenterTop {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.userCenterButtom {
  margin-top: 20px;
}
.userCenterTopLeft {
  width: 30%;
}
.userCenterTopRight {
  width: 68%;
  display: flex;
  flex-direction: column;
  align-content: space-between;
}
.userInfoCard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userImageBlock {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.userImageBackground {
  width: 125px;
  height: 125px;
  background: #ffffff;
  border: 1px solid #e9eaed;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.userImage {
  width: 120px;
}

.userInfoBlock {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
}

.editInfoButton {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  height: 30px;
  background-color: #f2f2f2;
  border-radius: 5px;
  cursor: pointer;
}

.editInfoButtonWord {
  font-family: PingFang SC;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #4e5969;
}

.infoDetail {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
}

.infoIcon {
  width: 25px;
}
.infoWordRight {
  margin-left: 5px;
  font-family: PingFang SC;
  font-size: 14px;
  color: #606a78;
}

.infoWord {
  margin-left: 15px;
  font-family: PingFang SC;
  font-size: 14px;
  color: #505050;
  font-weight: 500;
}

.tabWord {
  color: #606060;
}

.submission {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px 10px 20px;
  background-color: #ffffff;
  border-radius: 5px;
}

.submissionWordLight {
  color: #606a78;
  font-family: PingFang SC;
  font-size: 14px;
}

.submissionWordHeavy {
  color: #505050;
  font-family: PingFang SC;
  font-weight: 500;
  font-size: 14px;
}

.TopRightSmallWord {
  font-family: PingFang SC;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: #4e5969;
}

.TopRightContext {
  margin-top: 8px;
  display: flex;
  flex-direction: row;
}

.TopRightBigWord {
  margin-left: 8.8px;
  font-family: Nunito Sans;
  font-size: 26px;
  font-style: normal;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: 0px;
  text-align: left;
  font-family: PingFang SC;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
}

.submissionItem {
  margin-top: 10px;
}

.heetmap {
  margin-top: 30px;
}
</style>
