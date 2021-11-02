<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛管理</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域，展示竞赛列表 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row>
        <el-col :span="8">
          <el-input
            size="medium"
            placeholder="请输入想要搜索的竞赛名称"
            v-model="searchInput"
            @keyup.enter.native="getContestList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getContestList()"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table :data="contestlist" style="margin-top: 20px">
        <el-table-column prop="region" label="域"> </el-table-column>
        <el-table-column prop="title" label="竞赛名称"></el-table-column>
        <el-table-column prop="start_time" label="开始时间">
          <template slot-scope="scope" v-if="scope.row.start_time !== null">
            {{ formatTime(scope.row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间">
          <template slot-scope="scope" v-if="scope.row.end_time !== null">
            {{ formatTime(scope.row.end_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 查看按钮 -->
            <el-button
              size="small"
              @click="handleClickProblem(scope.row.region)"
              >查看</el-button
            >
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="small"
              @click="showEditDialog(scope.$index)"
              >修改</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="small"
              @click="deleteContest(scope.row.region, scope.row.title)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        hide-on-single-page
        @current-change="getContestList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        style="margin-top: 30px; text-align: center"
      >
      </el-pagination>
    </el-card>

    <!-- 修改竞赛弹窗 -->
    <el-dialog
      title="修改竞赛"
      :visible.sync="modifyContestDialogVisible"
      width="75%"
    >
      <!-- 内容主体区域 -->
      <el-row :gutter="30" style="margin-top: 20px">
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">域</span>
          </div>
          <div style="padding-left: 16px">{{ modify_region }}</div>
        </el-col>
        <el-col :span="12">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">竞赛名称</span>
          </div>
          <el-input
            placeholder="请输入竞赛的名称"
            v-model="modify_title"
            clearable
            style="margin-top: 10px;  font-size: 14px"
          >
          </el-input>
        </el-col>
      </el-row>
      <!-- 竞赛描述 -->
      <div class="problemDetail">
        <div class="titleLayout">
          <span class="itemTitle">相关介绍</span>
        </div>
        <!-- 富文本编辑器 -->
        <div style="margin-top: 10px">
          <mavon-editor
            v-model="modify_introduction"
            class="margin"
          ></mavon-editor>
        </div>
      </div>
      <!-- 时间、密码 -->
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 开始时间 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">开始时间</span>
          </div>
          <div class="block">
            <el-date-picker
              v-model="startTime"
              value-format="yyyy-MM-ddTHH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择开始时间"
              class="margin"
            >
            </el-date-picker>
          </div>
        </el-col>
        <!-- 结束时间 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">结束时间</span>
          </div>
          <el-date-picker
            v-model="endTime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择结束时间"
            class="margin"
          >
          </el-date-picker>
        </el-col>
        <!-- 封榜时间 -->
        <el-col :span="6">
          <div class="titleLayout">
            <img class="mustPic" src="@/assets/img/required_field.svg" />
            <span class="itemTitle">封榜时间</span>
          </div>
          <el-date-picker
            v-model="sealTime"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择封榜时间"
            class="margin"
          >
          </el-date-picker>
        </el-col>
        <!-- 竞赛密码 -->
        <el-col :span="6">
          <div class="titleLayout" v-if="is_modify_password === false">
            <span class="itemTitle">是否修改竞赛密码</span>
          </div>
          <el-switch
            v-model="is_modify_password"
            class="margin"
            v-if="is_modify_password === false"
          >
          </el-switch>
          <div class="titleLayout" v-if="is_modify_password">
            <span class="itemTitle">修改竞赛密码&emsp;</span>
            <el-switch v-model="is_modify_password"> </el-switch>
          </div>
          <el-input
            v-model="password"
            placeholder="请输入竞赛密码"
            class="margin"
            v-if="is_modify_password"
          >
          </el-input>
        </el-col>
      </el-row>
      <!-- settings选择-->
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 比赛开始后是否能注册参加比赛 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛开始后是否能注册参加比赛</span>
          </div>
          <el-switch v-model="register_after_start" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛开始后注册是否参与排名 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛开始后注册是否参与排名</span>
          </div>
          <el-switch v-model="unrate_after_start" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛开始前是否能查看题目 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛开始前是否能查看题目</span>
          </div>
          <el-switch v-model="view_before_start" class="margin"> </el-switch>
        </el-col>
      </el-row>
      <el-row :gutter="30" style="margin-top: 40px">
        <!-- 比赛结束后是否能查看题目 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛结束后是否能查看题目</span>
          </div>
          <el-switch v-model="view_after_end" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛结束后是否公开 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛结束后是否公开</span>
          </div>
          <el-switch v-model="public_after_end" class="margin"> </el-switch>
        </el-col>
        <!-- 比赛结束后是否还能提交 -->
        <el-col :span="8">
          <div class="titleLayout">
            <span class="itemTitle">比赛结束后是否还能提交</span>
          </div>
          <el-switch v-model="submit_after_end" class="margin"> </el-switch>
        </el-col>
      </el-row>
      <div
        style="
          margin-top: 30px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        "
      >
        <el-button type="primary" @click="modifyContest()">修改竞赛</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { contestListRequest, contestEditRequest, contestDeleteRequest } from "@/request/contestRequest";
export default {
  data() {
    return {
      // 获取到的题目列表
      contestlist: [],
      // 搜索输入内容
      searchInput: "",
      // 当前页
      currentPage: 1,
      // 每页记录数
      pageSize: 10,
      // 总记录数
      total: null,
      // 控制修改竞赛弹窗展示
      modifyContestDialogVisible: false,
      // 修改竞赛内容
      modify_region: "",
      modify_title: "",
      modify_introduction: "",
      startTime: "",
      endTime: "",
      sealTime: "",
      password: "",
      register_after_start: true,
      unrate_after_start: true,
      view_before_start: false,
      view_after_end: true,
      public_after_end: false,
      submit_after_end: true,
      // 是否修改密码
      is_modify_password: false,
    };
  },
  created() {
    this.getContestList();
  },
  methods: {
    // 获取竞赛列表
    getContestList(currentPage = 1) {
      var that = this;
      const params = {
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      contestListRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.contestlist = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // 查看竞赛题目详情
    handleClickProblem(re) {
      let region = re;
      let that = this;
      that.$router.push({
        name: "contestDetailList",
        params: { region: region },
      });
    },

    // 展示修改竞赛弹窗
    showEditDialog(index) {
      // 获取需要修改的竞赛原信息
      let contestInfo = this.contestlist[index];
      this.modify_region = contestInfo.region;
      this.modify_title = contestInfo.title;
      this.modify_introduction = contestInfo.introduction;
      this.startTime = contestInfo.start_time;
      this.endTime = contestInfo.end_time;
      this.sealTime = contestInfo.seal_time;
      this.password = "";
      this.register_after_start = contestInfo.settings.register_after_start;
      this.unrate_after_start = contestInfo.settings.unrate_after_start;
      this.view_before_start = contestInfo.settings.view_before_start;
      this.view_after_end = contestInfo.settings.view_after_end;
      this.public_after_end = contestInfo.settings.public_after_end;
      this.submit_after_end = contestInfo.settings.submit_after_end;
      this.is_modify_password = false;
      this.modifyContestDialogVisible = true;
    },

    // 发起修改竞赛请求
    modifyContest() {
      var data = {};
      if (this.is_modify_password) {
        data = {
          new_title: this.modify_title,
          new_introduction: this.modify_introduction,
          new_start_time: this.startTime,
          new_end_time: this.endTime,
          new_seal_time: this.sealTime,
          new_password: this.password,
          new_settings: {
            register_after_start: this.register_after_start,
            unrate_after_start: this.unrate_after_start,
            view_before_start: this.view_before_start,
            view_after_end: this.view_after_end,
            public_after_end: this.public_after_end,
            submit_after_end: this.submit_after_end,
          },
        };
      } else {
        data = {
          new_title: this.modify_title,
          new_introduction: this.modify_introduction,
          new_start_time: this.startTime,
          new_end_time: this.endTime,
          new_seal_time: this.sealTime,
          new_settings: {
            register_after_start: this.register_after_start,
            unrate_after_start: this.unrate_after_start,
            view_before_start: this.view_before_start,
            view_after_end: this.view_after_end,
            public_after_end: this.public_after_end,
            submit_after_end: this.submit_after_end,
          },
        };
      }
      let that = this;
      contestEditRequest(this.modify_region, data)
        .then(function (response) {
          // 提示用户创建成功
          that.$message({
            message: "修改竞赛成功！",
            type: "success",
          });
          that.modifyContestDialogVisible = false;
          that.getContestList();
        })
        .catch(function (error) {
          that.$message({
            message: "修改竞赛失败！",
            type: "warning",
          });
          console.log(error);
        });
    },
    // 删除竞赛
    deleteContest(contestid, title) {
      this.$confirm(
        "此操作将永久删除竞赛 【" + title + "】 , 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let that = this;
          contestDeleteRequest(contestid)
            .then(function (response) {
              //重新获取竞赛列表
              that.getContestList();
              // 提示用户删除成功
              that.$message({
                message: "删除成功！",
                type: "success",
              });
            })
            .catch(function (error) {
              that.$message({
                message: "删除失败！",
                type: "warning",
              });
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 格式化展示时间
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style lang='less' scoped>
.editpic {
  width: 25px;
}

.mustPic {
  width: 25px;
}

.titleLayout {
  display: flex;
  flex-direction: row;
  align-items: center;
  //width: 100px;
}
.problemDetail {
  margin-top: 40px;
}

.itemTitle {
  
  font-size: 15px;
  color: #494747;
}

.margin {
  margin-top: 10px;
}
</style>

