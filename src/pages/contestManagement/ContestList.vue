<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛管理</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input
        placeholder="请输入想要搜索的竞赛名称"
        v-model="searchInput"
        @keyup.enter.native="getContestList()"
        class="singleSearchBar"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="getContestList()"
        ></el-button>
      </el-input>

      <el-table
        :data="contestlist"
        style="margin-top: 20px"
        @row-click="handleClickProblem"
      >
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
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click.stop="showEditDialog(scope.$index)"
              >修改</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click.stop="deleteContest(scope.row.region, scope.row.title)"
              >删除</el-button
            >
            <el-button
              size="small"
              @click.stop="showLinkGroups(scope.row.region)"
              >查看小组</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        hide-on-single-page
        @current-change="getContestList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        class="table_pagination"
      >
      </el-pagination>
    </el-card>

    <!-- 修改竞赛弹窗 -->
    <el-dialog
      title="修改竞赛"
      :visible.sync="editContestDialogVisible"
      width="75%"
    >
      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <img class="required_img" src="@/assets/img/required_field.svg" />
          <span class="text">竞赛域名</span>
        </div>
        <el-input
          placeholder="请输入竞赛域名"
          v-model="region"
          class="create-form-value-wrap"
        >
          <template slot="prepend">contest_</template>
        </el-input>
      </div>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">竞赛名称</span>
          </div>
          <el-input
            placeholder="请输入竞赛名称"
            v-model="title"
            class="create-form-value-wrap"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <el-switch v-model="isUpdatePassword"> </el-switch>
            <span class="text" style="margin-left: 15px">修改竞赛密码</span>
          </div>
          <el-input
            v-model="password"
            placeholder="请输入竞赛密码"
            class="create-form-value-wrap"
            :disabled="!isUpdatePassword"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">竞赛类型</span>
          </div>
          <el-select
            placeholder="请选择竞赛类型"
            v-model="contestType"
            class="create-form-value-wrap"
          >
            <el-option
              v-for="item in contestTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">开始时间</span>
          </div>
          <el-date-picker
            placeholder="请选择竞赛开始时间"
            v-model="startTime"
            class="create-form-value-wrap"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">结束时间</span>
          </div>
          <el-date-picker
            placeholder="请选择竞赛结束时间"
            v-model="endTime"
            class="create-form-value-wrap"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          >
          </el-date-picker>
        </el-col>
        <el-col :span="8">
          <div class="create-form-label-wrap">
            <img class="required_img" src="@/assets/img/required_field.svg" />
            <span class="text">封榜时间</span>
          </div>
          <el-date-picker
            placeholder="请选择竞赛封榜时间"
            v-model="sealTime"
            class="create-form-value-wrap"
            value-format="yyyy-MM-ddTHH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
          >
          </el-date-picker>
        </el-col>
      </el-row>

      <div class="create-form-row-wrap">
        <div class="create-form-label-wrap">
          <span class="text">竞赛说明</span>
        </div>
        <div class="create-form-value-wrap">
          <mavon-editor v-model="introduction"></mavon-editor>
        </div>
      </div>

      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="view_before_start"> </el-switch>
            <span class="text">比赛开始前能查看题目</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="register_after_start"> </el-switch>
            <span class="text">比赛开始后能报名参加比赛</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="unrate_after_start"> </el-switch>
            <span class="text">比赛开始后报名能参与排名</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="30" class="create-form-row-wrap">
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="view_after_end"> </el-switch>
            <span class="text">比赛结束后能查看题目</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="submit_after_end"> </el-switch>
            <span class="text">比赛结束后能提交</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="create-form-switch-item">
            <el-switch v-model="public_after_end"> </el-switch>
            <span class="text">比赛结束后题目公开</span>
          </div>
        </el-col>
      </el-row>

      <div class="create-form-button-wrap">
        <el-button type="primary" @click="editContest()">修改竞赛</el-button>
      </div>
    </el-dialog>

    <LinkGroupsDialog
      :region="linkGroupsRegion"
      :linkGroupsDialogVisible="linkGroupsDialogVisible"
      :closeDialog="closeLinkGroupsDialog"
    />
  </div>
</template>

<script>
import moment from "moment";
import {
  contestListRequest,
  contestEditRequest,
  contestDeleteRequest,
} from "@/request/contestRequest";
import LinkGroupsDialog from "@/components/LinkGroupsDialog.vue";
export default {
  components: {
    LinkGroupsDialog,
  },
  data() {
    return {
      // 展示
      contestlist: [],
      searchInput: "",
      currentPage: 1,
      pageSize: 8,
      total: null,

      // 修改
      editContestDialogVisible: false,
      region: "",
      title: "",
      introduction: "",
      contestType: "",
      startTime: "",
      endTime: "",
      sealTime: "",
      isUpdatePassword: false, // 是否修改密码
      password: "",
      register_after_start: true,
      unrate_after_start: true,
      view_before_start: false,
      view_after_end: true,
      public_after_end: false,
      submit_after_end: true,

      contestTypeOptions: [
        {
          label: "公开赛",
          value: "open_contest",
        },
        {
          label: "小组赛",
          value: "group_contest",
        },
      ],

      linkGroupsRegion: "",
      linkGroupsDialogVisible: false,
    };
  },
  created() {
    this.getContestList();
  },
  methods: {
    // 获取竞赛列表
    getContestList(currentPage = 1) {
      const params = {
        title_filter: this.searchInput,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      contestListRequest(params)
        .then((response) => {
          this.currentPage = currentPage;
          this.contestlist = response.list;
          this.total = response.total;
        })
        .catch(() => {
          this.$message.warning("获取竞赛列表失败");
        });
    },

    // 查看竞赛题目详情
    handleClickProblem(row) {
      this.$router.push({
        name: "contestDetailList",
        params: { region: row.region },
      });
    },

    // 展示修改竞赛弹窗
    showEditDialog(index) {
      const contestInfo = this.contestlist[index];
      this.region = contestInfo.region;
      this.title = contestInfo.title;
      this.introduction = contestInfo.introduction;
      this.contestType = contestInfo.self_type;
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
      this.isUpdatePassword = false;
      this.editContestDialogVisible = true;
    },

    // 发起修改竞赛请求
    editContest() {
      const data = {
        new_title: this.title,
        new_introduction: this.introduction,
        new_password: this.password,
        new_self_type: this.contestType,
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
      if (!this.isUpdatePassword) {
        delete data["new_password"];
      }
      contestEditRequest(this.region, data)
        .then(() => {
          this.$message({
            message: "修改竞赛成功",
            type: "success",
          });
          this.editContestDialogVisible = false;
          this.getContestList();
        })
        .catch(() => {
          this.$message({
            message: "修改竞赛失败",
            type: "warning",
          });
        });
    },
    // 删除竞赛
    deleteContest(region, title) {
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
          contestDeleteRequest(region)
            .then(() => {
              this.getContestList(this.currentPage);
              this.$message.success("删除成功");
            })
            .catch(() => {
              this.$message.warning("删除失败");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 小组赛链接的小组列表
    showLinkGroups(region) {
      this.linkGroupsRegion = region;
      this.linkGroupsDialogVisible = true;
    },
    closeLinkGroupsDialog() {
      this.linkGroupsDialogVisible = false;
    },

    // 格式化展示时间
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

