<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部区域 -->
      <div class="header">
        <!-- 搜索竞赛 -->
        <el-row>
          <el-col :span="5">
            <el-input
              placeholder="请输入竞赛名称"
              v-model="searchInput"
              size="medium"
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
        <!-- 竞赛状态 filter -->
      </div>
      <!-- 竞赛列表展示区域 -->
      <div>
        <div id="contest-list">
          <li v-for="(contest, index) in contestlist" :key="index">
            <el-row type="flex" justify="space-between" align="middle">
              <img class="trophy" src="../img/trophy.svg" />
              <el-col :span="18" class="contest-main">
                <div class="title">
                  <a
                    class="entry"
                    @click.stop="goContest(contest.title, contest.region)"
                  >
                    {{ contest.title }}
                  </a>
                </div>
                <div class="detail">
                  <div class="detailItem">
                    <img
                      v-if="contest.start_time !== null"
                      class="icon"
                      src="../img/cal.svg"
                    />
                    <span
                      v-if="contest.start_time !== null"
                      class="detailItemWord"
                      >{{ formatTime(contest.start_time) }}</span
                    >
                  </div>
                  <div class="detailItem">
                    <img
                      v-if="contest.end_time !== null"
                      class="icon"
                      src="../img/time.svg"
                    />
                    <span
                      v-if="contest.end_time !== null"
                      class="detailItemWord"
                      >{{
                        getDuration(contest.start_time, contest.end_time)
                      }}</span
                    >
                  </div>
                </div>
              </el-col>
              <el-col :span="4" style="text-align: center">
                <el-tag
                  effect="dark"
                  v-if="contest.state === 'Preparing'"
                  type="info"
                  >{{ contest.state }}</el-tag
                >
                <el-tag
                  effect="dark"
                  v-if="contest.state === 'Running'"
                  type="success"
                  >{{ contest.state }}</el-tag
                >
                <el-tag
                  effect="dark"
                  v-if="contest.state === 'SealedRunning'"
                  type="success"
                  >{{ contest.state }}</el-tag
                >
                <el-tag
                  effect="dark"
                  v-if="contest.state === 'Ended'"
                  type="danger"
                  >{{ contest.state }}</el-tag
                >
              </el-col>
            </el-row>
          </li>
        </div>
      </div>

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
  </div>
</template>
<script>
import time from "@/utils/time";
import moment from "moment";
import { contestListRequest } from "../request/contestRequest.js";

export default {
  data() {
    return {
      // 获取到的竞赛列表
      contestlist: [],
      // 搜索输入内容
      searchInput: "",
      // 当前页
      currentPage: 1,
      // 每页记录数
      pageSize: 6,
      // 总记录数
      total: null,
    };
  },
  created() {
    this.getContestList();
  },
  methods: {
    getDuration(startTime, endTime) {
      return time.duration(startTime, endTime);
    },
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
    // 格式化展示时间
    formatTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    // 跳转至竞赛详情页
    goContest(contestTitle, re) {
      let title = contestTitle;
      let region = re;
      let that = this;
      that.$router.push({
        name: "contestDetail",
        params: { title: title, region: region },
      });
    },
  },
};
</script>
<style lang="less" scoped>
#contest-list {
  > li {
    padding: 20px;
    border-bottom: 1px solid rgba(187, 187, 187, 0.5);
    list-style: none;
    .trophy {
      height: 52px;
    }
    .contest-main {
      .title {
        font-size: 18px;
        a.entry {
          color: #495060;
          &:hover {
            color: #2d8cf0;
            border-bottom: 1px solid #2d8cf0;
          }
        }
      }
      li {
        display: inline-block;
        // padding: 10px 0 0 10px;
        &:first-child {
          padding: 10px 0 0 0;
        }
      }
    }
  }
}
.contest-main {
  display: flex;
  flex-direction: column;
}
.detail {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.detailItem {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}
.detailItemWord {
  color: #495060;
  font-size: 15px;
}
.icon {
  width: 15px;
  margin-right: 5px;
}
</style>
