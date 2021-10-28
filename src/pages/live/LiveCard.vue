<template>
  <div class="live-list">
    <div class="live-container">
      <div class="list-box" v-if=" name!== null ">
        <div class="live-item" :key="index" v-for="(item, index) in liveRoom">
          <div class="item-box" @click="playerHandler()">
            <p>
              <img
                class="live-img"
                src="https://cxx-1258119840.cos.ap-shanghai.myqcloud.com/Oval.svg"
              />
              <span class="live-name">{{ item.title }}</span>
            </p>
            <p>
              <span class="live-btn">去围观</span>
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <img class="empty-img" src="@/assets/img/live/live-empty.png" />
        <p class="empty-text">
          当前没有直播,请稍后再来~
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      liveRoom: [
          {title: "测试"},
      ],
      name:1,
    };
  },
  created() {
      // this.name = window.localStorage.getItem('liveName');
  },

  methods: {
    playerHandler() {
      this.$router.push("/playerLive");
    },
  },
};
</script>
<style lang="scss" scoped>
.live-list {
  background: #f9f9f9;
  width: 100%;
  position: relative;
  height: 100%;
  overflow-y: scroll;
  .live-title {
    text-align: left;
    margin: 40px;
    margin-bottom: 0;
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: #333333;
  }
  .live-container {
    /*width 90%*/
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .list-box {
    /*margin  40px*/
    display: inline-flex;
    justify-content: center;
    flex-wrap: wrap;
    /*overflow-y scroll*/
    //height calc(100% - 480px)
    .live-item {
      border: 1px solid #f2f3f8;
      box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.05);
      margin: 15px;
      min-width: 380px;
      height: 130px;
      /*display inline-flex*/
      background: #ffffff;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      .item-box {
        height: 60px;
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
      }
      .live-img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      .live-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 18px;
        color: #333333;
        line-height: 60px;
        height: 40px;
        width: 180px;
        /*text-align center*/
        display: inline-block;
        font-family: PingFangSC-Medium;
      }
      .live-btn {
        /*width 80px*/
        /*height 36px*/
        padding: 6px 12px;
        border: 1px solid #dddddd;
        border-radius: 18px;
        font-size: 12px;
        line-height: 60px;
        cursor: pointer;
      }
    }
  }
}
.empty-img {
  display: block;
  margin: 0 auto;
  margin-top: 30px;
  height: 200px;
  margin-bottom: 40px;
}
.empty-text {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #888888;
  line-height: 18px;
  display: flex;
  justify-content: center;
}
.guide-box {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.84);
  z-index: 9999;
  padding: 0 20px;

  & img {
    width: 100%;
    height: 200px;
  }

  .guide-text {
    font-size: 20px;
    line-height: 32px;
    color: #ffffff;

    & i {
      width: 1px;
      height: 1px;
      border-radius: 50%;
      background: #ffffff;
    }
  }
}

.header-box {
  position: relative;
  width: 100%;
  background: #ffffff;
  height: 60px;
  line-height: 60px;
  z-index: 1;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.35);
}
.logo-img {
  height: 30px;
  /*margin-top 15px*/
  margin-left: 30px;
}

.live-dialog {
  width: 600px;
}
@media screen and (max-width: 1000px) {
  .title-box {
    width: 100%;
  }
}

@media screen and (min-width: 1200px) and (max-width: 1500px) {
  .list-box {
    width: 1230px;
  }
  .title-box {
    width: 1230px;
  }
  /deep/ .el-dialog {
    width: 40%;
  }
}
//适配大屏
@media screen and (min-width: 1500px) {
  .list-box {
    width: 90%;
  }
  .title-box {
    width: 85%;
    margin-left: 80px;
    margin-bottom: 20px;
  }
  .live-list .live-top .text-box .top-title {
    margin-top: 200px;
  }
  .live-list .live-top {
    min-height: 550px;
  }
  /deep/ .el-dialog {
    width: 40%;
  }
}
//适配移动端
@media screen and (max-width: 700px) {
  .list-box {
    width: 90%;
  }
  .title-box {
    width: 85%;
    margin-left: 80px;
    margin-bottom: 20px;
  }
  .live-list .live-top .text-box .top-title {
    margin-top: 80px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #ffffff;
    line-height: 28px;
  }

  .live-list .live-top .text-box .top-text {
    font-family: PingFangSC-Light;
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
  }
  .live-list .live-top .text-box .pusher-btn {
    background: #2864f0;
    border-radius: 20px;
    padding: 10px 30px;
    margin-top: 30px;
  }

  .live-list .list-box {
    height: calc(100% - 365px);
  }
  .title-box {
    width: 100%;
    margin-left: 0;
    margin-bottom: 0;
  }
  .live-list .live-title {
    margin: 30px 20px 20px 20px;
    font-size: 20px;
  }
  .live-list .list-box .live-item {
    width: 100%;
    min-width: 100%;
    margin: 9px 10px;
  }
  .live-list .list-box .live-item .live-name {
    font-size: 16px;
    width: 150px;
  }
  .empty-img {
    height: 160px;
  }
  /deep/ .el-dialog {
    width: 80%;
  }
}
</style>