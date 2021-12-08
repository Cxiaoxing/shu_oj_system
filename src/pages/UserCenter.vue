<template>
  <div>
    <div class="userCenter">
      <div class="userCenterTop">
        <!-- 个人信息展示卡片 -->
        <el-card class="userCenterTopLeft">
          <!-- 头像区域 -->
          <el-upload
            class="userImageBackground"
            :action="`${BASE_URL}/users/${userId}/profile_picture`"
            :show-file-list="false"
            :before-upload="beforeUserImageUpload"
            :on-success="uploadUserImageSuccess"
            :on-error="uploadUserImageError"
          >
            <img
              v-if="
                userInfo.profile_picture_url &&
                userInfo.profile_picture_url !== ''
              "
              :src="userInfo.profile_picture_url"
              class="userImage"
            />
            <span v-else class="userImageEmpty">{{
              `点击此处${"\n"}上传头像`
            }}</span>
          </el-upload>
          <!-- 编辑个人信息 -->
          <div class="editInfoButton" @click="openEditUserDialog()">
            <span class="editInfoButtonWord">编辑个人信息</span>
          </div>
          <!-- 个人信息展示区域 -->
          <div class="userInfoBlock">
            <div class="infoDetail">
              <span class="infoWordRight">用户名</span>
              <span class="infoWord"> {{ userInfo.username }}</span>
            </div>
            <div class="infoDetail">
              <span class="infoWordRight" v-html="'邮&emsp;箱'" />
              <span class="infoWord"> {{ userInfo.email }}</span>
            </div>
            <div class="infoDetail">
              <span class="infoWordRight" v-html="'角&emsp;色'" />
              <span v-if="userInfo.role === 'sup'" class="infoWord"
                >超级管理员</span
              >
              <span v-else-if="userInfo.role === 'admin'" class="infoWord"
                >管理员</span
              >
              <span v-else class="infoWord">普通用户</span>
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
              <div class="TopRightSmallWord">
                提交次数
                <i class="el-icon-d-caret system_key_color" />
              </div>
              <div class="TopRightContext">
                {{ submitCounts.total_submit_times }}
              </div>
            </div>
            <div>
              <div class="TopRightSmallWord">
                通过次数
                <i class="el-icon-d-caret system_key_color" />
              </div>
              <div class="TopRightContext">
                {{ submitCounts.total_accept_times }}
              </div>
            </div>
            <div>
              <div class="TopRightSmallWord">
                通过率
                <i class="el-icon-d-caret system_key_color" />
              </div>
              <div class="TopRightContext">
                {{
                  submitCounts.total_submit_times
                    ? (
                        (submitCounts.total_accept_times /
                          submitCounts.total_submit_times) *
                        100
                      ).toFixed(2)
                    : 0
                }}%
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
        <el-card>
          <el-tabs>
            <el-tab-pane class="scrollbar" style="max-height: 500px">
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
        </el-card>
      </div>
    </div>
    <!-- 编辑个人信息对话框 -->
    <el-dialog
      title="编辑个人信息"
      :visible.sync="updateUserDialogVisible"
      width="32%"
      @close="
        () => {
          $refs.updateUserPasswordFormRef.resetFields();
        }
      "
    >
      <div v-show="isUpdateUserInfo">
        <el-form
          :model="updateUserInfoForm"
          :rules="updateUserInfoFormRules"
          ref="updateUserInfoFormRef"
          label-width="auto"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="updateUserInfoForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="updateUserInfoForm.email"></el-input>
          </el-form-item>
          <el-form-item label="学校">
            <el-input v-model="updateUserInfoForm.school"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="updateUserInfoForm.student_number"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="updateUserInfoForm.real_name"></el-input>
          </el-form-item>
        </el-form>
        <div class="buttonWrap">
          <el-button type="primary" plain @click="isUpdateUserInfo = false"
            >修改密码</el-button
          >
          <el-button type="primary" @click="updateUserInfo()"
            >更新基本信息</el-button
          >
        </div>
      </div>
      <div v-show="!isUpdateUserInfo">
        <el-form
          :model="updateUserPasswordForm"
          :rules="updateUserPasswordFormRules"
          ref="updateUserPasswordFormRef"
          label-width="auto"
        >
          <el-form-item label="原密码" prop="old_password">
            <el-input
              v-model="updateUserPasswordForm.old_password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_password">
            <el-input
              v-model="updateUserPasswordForm.new_password"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password_confirm">
            <el-input
              v-model="updateUserPasswordForm.password_confirm"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="buttonWrap">
          <el-button type="primary" plain @click="isUpdateUserInfo = true"
            >修改基本信息</el-button
          >
          <el-button type="primary" @click="updateUserPassword()"
            >更新密码</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CalendarHeatmap } from "vue-calendar-heatmap"; //热力图
import echarts from "../utils/initEcharts";
import {
  userCheckOnlineRequest,
  userEditRequest,
  userResetPasswordRequest,
  userInfoRequest,
  userSubmitDiffcultyInfoRequest,
  userSubmitNumberInfoRequest,
  userSubmitListRequest,
} from "../request/userRequest";
require("echarts/theme/macarons"); //引入饼图主题
import { BASE_URL, checkEmail, formatTime } from "@/assets/config";

export default {
  components: { CalendarHeatmap },
  data() {
    const confirmPassword = (rule, value, callback) => {
      if (value === this.updateUserPasswordForm.new_password) {
        return callback();
      }
      callback(new Error("请确保两次输入密码一致"));
    };
    return {
      BASE_URL,
      userInfo: {},
      userId: "",
      submissionslist: [],
      submitCounts: {},
      submissionsTime: [],
      myDate: "",
      currentPage: 1,
      pageSize: 10,
      total: null,
      // 修改用户信息
      updateUserDialogVisible: false,
      isUpdateUserInfo: true,
      // 修改基本信息
      updateUserInfoForm: {
        username: "",
        email: "",
        school: "",
        student_number: "",
        real_name: "",
      },
      updateUserInfoFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 修改密码
      updateUserPasswordForm: {
        old_password: "",
        new_password: "",
        password_confirm: "",
      },
      updateUserPasswordFormRules: {
        old_password: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        new_password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
        password_confirm: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: confirmPassword, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.myDate = new Date();
    const that = this;
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
      const that = this;
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
      const that = this;
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
      const that = this;
      userSubmitNumberInfoRequest(this.userId)
        .then(function (response) {
          that.submissionsTime = response;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 上传头像
    beforeUserImageUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB");
      }
      return isJPG && isLt2M;
    },
    uploadUserImageSuccess() {
      this.getUserInfo();
      this.$message.success("用户头像上传成功");
    },
    uploadUserImageError() {
      this.$message.warning("用户头像上传失败");
    },

    // 打开修改用户信息弹窗
    openEditUserDialog() {
      this.updateUserInfoForm = { ...this.userInfo };
      this.updateUserDialogVisible = true;
      this.isUpdateUserInfo = true;
    },
    // 发起修改用户基本信息请求
    updateUserInfo() {
      this.$refs["updateUserInfoFormRef"].validate((valid) => {
        if (valid) {
          const data = {
            new_username: this.updateUserInfoForm.username,
            new_email: this.updateUserInfoForm.email,
            new_real_name: this.updateUserInfoForm.real_name,
            new_school: this.updateUserInfoForm.school,
            new_student_number: this.updateUserInfoForm.student_number,
          };
          userEditRequest(this.userId, data)
            .then(() => {
              this.updateUserDialogVisible = false;
              this.getUserInfo();
              this.$message({
                message: "更新基本信息成功",
                type: "success",
              });
            })
            .catch((error) => {
              this.$message({
                message: "更新基本信息失败",
                type: "warning",
              });
              console.log(error);
            });
        }
      });
    },
    // 发起修改用户密码请求
    updateUserPassword() {
      this.$refs["updateUserPasswordFormRef"].validate((valid) => {
        if (valid) {
          const data = {
            by_old_password: true,
            by_email: false,
            by_old_password_body: {
              id: this.userId,
              old_password: this.updateUserPasswordForm.old_password,
              new_password: this.updateUserPasswordForm.new_password,
            },
          };
          console.log(data);
          userResetPasswordRequest(data)
            .then(() => {
              this.updateUserDialogVisible = false;
              this.$message({
                message: "修改密码成功",
                type: "success",
              });
            })
            .catch((error) => {
              this.$message({
                message: "修改密码失败",
                type: "warning",
              });
              console.log(error);
            });
        }
      });
    },

    // 个人提交记录
    getSubmissionsList(currentPage = 1) {
      const that = this;
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
    formatTime,

    // 查看提交详情（外部）
    goSubmissionDetail(uuid) {
      const routeData = this.$router.resolve({
        name: "submissionDetail",
        params: { uuid },
      });
      window.open(routeData.href, "_blank");
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

<style lang="scss" scoped>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.userCenterTopRight {
  width: 68%;
  display: flex;
  flex-direction: column;
  align-content: space-between;
}

// 用户头像
.userImageBackground {
  width: 130px;
  height: 130px;
  margin: auto;
  border: 1px dashed $unimportant_font_color;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50% !important;
  overflow: hidden !important;
}
.userImageBackground:hover {
  border-color: $key_color;
}
.userImageEmpty {
  color: $unimportant_font_color;
  font-size: 25px;
}
.userImage {
  width: 125px;
  height: 125px;
}

.system_key_color {
  color: $key_color;
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
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  color: $ordinary_font_color;
}

.infoDetail {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  font-size: 14px;

  .infoWordRight {
    margin-top: 1px;
    color: $ordinary_font_color;
  }

  .infoWord {
    margin-left: 15px;
    color: $important_font_color;
    font-weight: 450;
  }
}

.tabWord {
  color: $ordinary_font_color;
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

  font-size: 14px;
}

.submissionWordHeavy {
  color: #505050;

  font-weight: 500;
  font-size: 14px;
}

.TopRightSmallWord {
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
  margin-left: 2px;
  font-size: 26px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: 0px;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
}

.submissionItem {
  margin-top: 10px;
}

.heetmap {
  margin-top: 30px;
}
</style>
