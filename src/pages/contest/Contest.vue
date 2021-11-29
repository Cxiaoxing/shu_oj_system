<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>竞赛</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input
        class="singleSearchBar"
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

      <div>
        <div class="contestWrap">
          <div
            v-for="(contest, index) in contestlist"
            :key="index"
            @click="goContest(contest.region)"
            class="contestItem"
          >
            <el-row type="flex" justify="space-between" align="middle">
              <img class="trophy" src="@/assets/img/trophy.svg" />
              <el-col :span="18" class="contest-main">
                <div class="title">{{ contest.title }}</div>
                <div class="detail">
                  <div class="contestTime">
                    <i class="el-icon-date" />
                    <span class="contestTimeWord">{{
                      formatTime(contest.start_time)
                    }}</span>
                  </div>
                  <div class="contestTime">
                    <i class="el-icon-time" />
                    <span class="contestTimeWord">{{
                      getDuration(contest.start_time, contest.end_time)
                    }}</span>
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
          </div>
        </div>
      </div>
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
  </div>
</template>
<script>
import time from "@/utils/time";
import moment from "moment";
import { contestListRequest } from "@/request/contestRequest.js";

export default {
  data() {
    return {
      contestlist: [],
      searchInput: "",
      currentPage: 1,
      pageSize: 6,
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
      const that = this;
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
    formatTime(the_time) {
      return moment(the_time).format("YYYY-MM-DD HH:mm:ss");
    },
    // 跳转至竞赛详情页
    goContest(region) {
      this.$router.push({
        name: "contestDetail",
        params: { region: region },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.contestWrap .contestItem {
  padding: 20px;
  border-bottom: 1px solid rgba(187, 187, 187, 0.5);
  list-style: none;
  &:hover {
    background-color: $key_color_light;
  }
}

.trophy {
  height: 52px;
}

.contest-main {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 18px;
}

.detail {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
}
.contestTime {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 20px;
}
.contestTimeWord {
  margin-left: 5px;
  color: $ordinary_font_color;
  font-size: 14px;
  font-weight: 500;
}
</style>
