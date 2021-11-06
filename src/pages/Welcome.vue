<template>
  <div>
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(item, index) in imgList" :key="index">
        <img :src="item.src" style="width: 100%" />
        <!-- todo: 上传图片公告，点击跳转 @click="jumpToAnnounceDetail(item)" -->
      </el-carousel-item>
    </el-carousel>
    <el-card style="margin-top: 10px">
      <el-table :data="announceList" @row-click="jumpToAnnounceDetail">
        <el-table-column prop="title" label="公告" />
        <el-table-column
          prop="release_time"
          :formatter="formatTime"
          label="发布时间"
        />
      </el-table>
      <el-pagination
        background
        hide-on-single-page
        @current-change="getAnnounceList"
        :page-size="pageSize"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        :total="total"
        style="margin-top: 30px; text-align: center"
      >
      </el-pagination>
    </el-card>
    <!-- 新手指引 -->
    <div class="onboard">
      <i class="el-icon-question guideIcon" @click.prevent.stop="guide" />
    </div>
  </div>
</template>

<script>
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import steps from "../guide/step";
import moment from "moment";
import { announceListRequest } from "@/request/announceRequest";
export default {
  data() {
    return {
      // 公告列表
      currentPage: 1,
      pageSize: 4,
      total: null,
      announceList: [],
      imgList: [
        {
          id: "1",
          src: "https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/homepic.png",
        },
        {
          id: "2",
          src: "https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/homepic.png",
        },
        {
          id: "3",
          src: "https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/homepic.png",
        },
      ],
      driver: null,
    };
  },
  created() {
    this.getAnnounceList();
  },
  mounted() {
    this.driver = new Driver({});
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps);
      this.driver.start();
    },
    formatTime: function (row) {
      return moment(row.release_time).format("YYYY-MM-DD HH:mm:ss");
    },
    getAnnounceList(currentPage = 1) {
      const that = this;
      const params = {
        id_order: true,
        limit: this.pageSize,
        offset: this.pageSize * (currentPage - 1),
      };
      announceListRequest(params)
        .then(function (response) {
          that.currentPage = currentPage;
          that.announceList = response.list;
          that.total = response.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    jumpToAnnounceDetail(row) {
      this.$router.push(`/announceDetail/${row.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.onboard {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 3;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d1d0d0;
  -webkit-box-shadow: #d1d0d0 0px 0px 10px;
  -moz-box-shadow: #d1d0d0 0px 0px 10px;
  box-shadow: #d1d0d0 0px 0px 10px;
  cursor: pointer;
}

.guideIcon {
  font-size: 30px;
  color: $key_color_light;
}
</style>