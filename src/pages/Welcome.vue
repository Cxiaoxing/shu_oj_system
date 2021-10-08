<template>
  <div>
    <el-carousel :interval="4000" height="400px">
      <el-carousel-item v-for="(item,index) in imgList" :key="index">
        <img :src="item.src" style="width:100%;" />
      </el-carousel-item>
    </el-carousel>
    <el-card class="card">
      <div
        style="
          font-family: PingFang SC;
          font-size: 18px;
          font-weight: 400;
          color: #303133;
        "
      >
        公告
      </div>
      <el-table class="noticeTable" :data="tableData">
        <el-table-column prop="name" label="" width="600px">
          <template slot-scope="scope">
            <el-link>{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="" > </el-table-column>
        <el-table-column prop="address" label=""> </el-table-column>
      </el-table>
    </el-card>
    <div class="onboard">
      <img class="guideIcon" src="../img/guide.svg" @click.prevent.stop="guide" />
    </div>
  </div>
</template>

<script>
import Driver from 'driver.js' 
import 'driver.js/dist/driver.min.css' 
import steps from '../guide/step'
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "上海大学程序设计大赛",
          address: "上海大学计算机学院",
        },
        {
          date: "2016-05-04",
          name: "上海大学程序设计大赛",
          address: "上海大学计算机学院",
        },
        {
          date: "2016-05-01",
          name: "上海大学程序设计大赛",
          address: "上海大学计算机学院",
        },
        {
          date: "2016-05-03",
          name: "上海大学程序设计大赛",
          address: "上海大学计算机学院",
        },
      ],
      imgList: [
        {
          name: "1",
          src: "https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/homepic.png",
        },
        {
          name: "2",
          src: "https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/homepic.png",
        }
      ],
       driver: null
    };
  },
  created(){

  },
   mounted() {
      this.driver = new Driver()
  },
  methods:{
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    },
}
};
</script>

<style lang="less" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.card {
  margin-top: 30px;
}

.noticeTable {
  width: 100%;
}

.onboard {
  position:absolute;
  right:  20px;
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
   cursor:pointer
}

.guideIcon{
  width: 25px;
  height: 25px;
}
</style>