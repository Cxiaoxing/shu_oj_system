<template>
  <div class="pusher">
    <el-button type="primary" v-if="liveState === false" @click="createLive"
      >创建直播</el-button
    >
    <div class="flex">
      <div class="settingBar" v-if="liveState === true">
        <div>
          <div
            class="pusher-mic cursor"
            v-if="isStartCamera"
            @click="startCamera"
          >
            <img class="pusher-icon" src="../../img/live/mutevideo.svg" />
          </div>
          <div class="pusher-mic cursor" v-else @click="stopCamera">
            <img class="pusher-icon" src="../../img/live/video.svg" />
          </div>
        </div>
        <div>
          <div class="pusher-mic cursor" v-if="isMute" @click="startMicrophone">
            <img class="pusher-icon" src="../../img/live/mutevoice.svg" />
          </div>
          <div class="pusher-mic cursor" v-else @click="stopMicrophone">
            <img class="pusher-icon" src="../../img/live/voice.svg" />
          </div>
        </div>
        <div>
          <div class="pusher-mic cursor" @click="endLive">
            <img class="pusher-icon" src="../../img/live/endlive.svg" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="liveState === true"
      id="video-container"
      class="video-container"
    ></div>
    <el-dialog title="请输入直播名称" :visible.sync="dialogVisible" width="30%">
      <el-input v-model="liveName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="startLive"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TWebLive from "tweblive";
// 1、创建 Pusher（推流）对象
let pusher = TWebLive.createPusher({ userID: "chenxiangxiang" });
export default {
  data() {
    return {
      SDKAppID: "1400344454",
      roomID: "001",
      userID: "chenxiangxiang",
      userSig:
        "eJwtjTEPgjAUhP-LWzWkhVdEEicdRCUOdXBFWuDF2NBKSNX430VgueS*u9x94HKSQa8dpBAGDJajJ6VNRxWNuGy08VSYepS58VT3om1JQcqRsQgRBU6J9i05PXAhRMgYm2hHjz*L*ZonyDGZV6geDnYyakTztrk9uld2OHdWqpDvPd4WVx2XfWZXeeXrrcuSDXx-lTU1Yg__",
      liveDomainName: "live.yccxx.cn",
      streamID: "1400344454_shuoj_chenxiangxiang_main",
      liveState: false,
      cameraList: [],
      isPush: true, //开始推流
      isPlay: true,
      isMute: false,
      isStartCamera: true,
      set_RenderView: false,
      dialogVisible: false,
      liveName: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 创建直播
    createLive() {
      this.dialogVisible = true;
    },
    // 开始直播
    startLive() {
      this.dialogVisible = false;
      // window.localStorage.setItem('liveName',this.liveName);
      this.liveState = true;
      pusher.checkSystemRequirements().then((checkResult) => {
        if (!checkResult.result) {
          alert("Your browser is not compatible with TWebLive Pusher");
        }
      });
      // 3、设置渲染界面，且从麦克风采集音频，从摄像头采集视频（默认720p）
      pusher
        .setRenderView({
          elementID: "video-container",
          audio: true,
          video: true,
        })
        .then(() => {
          // 4、填入 sdkappid roomid 等信息，推流
          // url 必须以 `room://` 开头
          let url = `room://sdkappid=${this.SDKAppID}&roomid=${this.roomID}&userid=${this.userID}&usersig=${this.userSig}&livedomainname=${this.liveDomainName}&streamid=${this.streamID}`;
          pusher.startPush(url).then(() => {
            console.log("pusher | startPush | ok");
          });
          this.isStartCamera = false;
        })
        .catch((error) => {
          console.error("pusher | setRenderView | failed", error);
        });
    },
    // 结束直播
    endLive() {
      this.liveState = false;
      // window.localStorage.clear('liveName',this.liveName);
      pusher
        .stopPush()
        .then(() => {
          console.log("pusher | stopPush | ok");
          window.location.reload();
        })
        .catch((error) => {
          console.error("pusher | stopPush | failed", error);
          this.$message({
            message: "停止推流失败",
            type: "danger",
          });
        });
    },
    stopCamera() {
      pusher
        .stopCamera()
        .then(() => {
          this.isStartCamera = true;
          this.$message({
            message: "摄像头已关闭",
            type: "success",
          });
          console.log("pusher | stopCamera | ok");
        })
        .catch((error) => {
          console.error("pusher | stopCamera | failed", error);
        });
    },
    startCamera() {
      pusher
        .startCamera()
        .then(() => {
          this.isStartCamera = false;
          this.$message({
            message: "摄像头已打开",
            type: "success",
          });
          console.log("pusher | startCamera | ok");
        })
        .catch((error) => {
          console.error("pusher | startCamera | failed", error);
        });
    },
    startMicrophone() {
      pusher
        .startMicrophone()
        .then(() => {
          this.isMute = false;
          this.$message({
            message: "麦克风已打开",
            type: "success",
          });
          console.log("pusher | startMicrophone | ok");
        })
        .catch((error) => {
          console.error("pusher | startMicrophone | failed", error);
        });
    },
    stopMicrophone() {
      pusher
        .stopMicrophone()
        .then(() => {
          this.isMute = true;
          this.$message({
            message: "麦克风已关闭",
            type: "success",
          });
          console.log("pusher | stopMicrophone | ok");
        })
        .catch((error) => {
          console.error("pusher | stopMicrophone | failed", error);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.cursor {
  cursor: pointer;
}
.pusher {
  position: relative;
  height: 100%;
  .video-container {
    position: relative;
    height: -moz-any() 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 10px;

    .stop-camera {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .settingBar {
    width: 20%;
    display: flex;
    justify-content: space-between;
  }
}
.flex {
  display: flex;
  justify-content: center;
}

.pusher-icon {
  width: 30px;
}
</style>