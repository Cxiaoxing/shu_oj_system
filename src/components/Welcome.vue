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

    <!--新增部分：“帮助” from 30 to 176-->
    <el-card>
      <div
        style="
          font-family: PingFang SC;
          font-size: 18px;
          font-weight: 400;
          color: #303133;
        "
      >
        帮助
      </div>
      <br /> 
      <div
        style="
          font-family: PingFang SC;
          font-size: 17px;
          font-weight: 400;
          color: #303133;">
        一、判题系统
      </div> 
      <!--
      <div class="helpTextStyle">
        Accepted: 你的答案符合判题标准
      </div>
      <div class="helpTextStyle">
        Runtime Error: 你的程序运行时出现错误（指针越界，栈溢出，有未处理的异常，主函数返回值非零等）
      </div>
      <div class="helpTextStyle">
        Time Limit Exceeded: 你的程序执行时间超出题目要求
      </div>
      <div class="helpTextStyle">
        Memory Limit Exceeded: 你的程序内存使用超出题目要求
      </div>
      <div class="helpTextStyle">
        Compile Error: 你的程序在编译（包括链接）时出现错误
      </div>
      <div class="helpTextStyle">
        Wrong Answer: 你的程序输出的答案不符合判题标准
      </div>
      <div class="helpTextStyle">
        System Error: 判题系统发生故障，请等待重判
      </div>
      <div class="helpTextStyle">
        Waiting: 你的提交正在等待处理
      </div>
      -->
      <div class="helpTextStyle">
        <table border="0">
          <tr>
            <td>Accepted</td>
            <td>你的答案符合判题标准</td>
          </tr>
          <tr>
            <td>Runtime Error</td>
            <td>你的程序运行时出现错误（指针越界，栈溢出，有未处理的异常，主函数返回值非零等）</td>
          </tr>
          <tr>
            <td>Time Limit Exceeded</td>
            <td>你的程序执行时间超出题目要求</td>
          </tr>
          <tr>
            <td>Memory Limit Exceeded</td>
            <td>你的程序内存使用超出题目要求</td>
          </tr>
          <tr>
            <td>Compile Error</td>
            <td>你的程序在编译（包括链接）时出现错误</td>
          </tr>
          <tr>
            <td>Wrong Answer</td>
            <td>你的程序输出的答案不符合判题标准</td>
          </tr>
          <tr>
            <td>System Error</td>
            <td>判题系统发生故障，请等待重判</td>
          </tr>
          <tr>
            <td>Waiting</td>
            <td>你的提交正在等待处理</td>
          </tr>
        </table>
      </div>

      <br /> 
      <div
        style="
          font-family: PingFang SC;
          font-size: 17px;
          font-weight: 400;
          color: #303133;">
       二、 编译参数
      </div>
      <div class="helpTextStyle">
        <table border="0">
          <tr>
            <td>C（GCC 4.8）</td>
            <td></td>
            <td>gcc -DONLINE_JUDGE -O2 -w -std=c99 {src_path} -lm -o {exe_path}main</td>
          </tr>
          <tr>
            <td>C++（G++ 4.3）</td>
            <td></td>
            <td>g++ -DONLINE_JUDGE -O2 -w -std=c++11 {src_path} -lm -o {exe_path}main</td>
          </tr>
          <tr>
            <td>Java（Oracle JDK 1.7）</td>
            <td></td>
            <td>javac {src_path} -d {exe_path} //编译</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td>java -cp {exe_path} Main //运行</td>
          </tr>
        </table>
      </div>

      <br /> 
      <div
        style="
          font-family: PingFang SC;
          font-size: 17px;
          font-weight: 400;
          color: #303133;">
       三、 常见问题
      </div>
      <div class="helpTextStyle">
        <table border="0">
          <tr>
            1、无特殊说明，请使用标准输入输出。
          </tr>
          <tr>
            2、Java 代码需使用 Main 作为主类名。C/C++代码使用int main()，并且需要return 0;。
          </tr>
          <tr>
            3、C/C++ 的64位整数类型，请使用 long long 声明，使用 cin/cout 或 %lld 输入输出。 使用__int64会导致编译错误。
          </tr>
          <tr>
            4、程序执行时间指CPU时间，占用内存按执行过程中内存消耗的峰值计，有多组测试数据时以最大的时间和内存消耗为准
          </tr>
          <tr>
            5、判题的时候会去除你的输出的最后的换行和空格，然后与去除最后的换行和空格的答案做比较，如果不一致就是 Wrong Answer。 其余的行末空格和空行不去除，看清楚题目的要求。没有格式错误。
          </tr>
        </table>
      </div>
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

.helpTextStyle{
  font-family: PingFang SC;
  font-size: 15px;
  font-weight: 240;
  color: #303133;
}
</style>