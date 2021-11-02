<template>
  <div>
    <div id="playerView" style="width: 100%; height: 800px; margin-top:20px"></div>
  </div>
</template>

<script>
import TWebLive from "tweblive";
export default {
  data() {
    return {
      
    };
  },
  created() {
  },
  mounted() {
    this.playLive();
  },
  methods: {
    playLive() {
      let player = TWebLive.createPlayer();
      player.setCustomConfig({
        autoplay: true,
      });
      // 2、设置渲染界面
      player.setRenderView({ elementID: "playerView" });
      // 3、填入 flv hls 地址等信息，拉 CDN 流播放，此时 url 必须以 https:// 开头
      // 或 填入 sdkappid roomid 等信息，拉 WebRTC 低延时流播放，此时 url 必须以 room:// 开头
      let url =
        "https://" +
        "flv=https://live.yccxx.cn/live/1400344454_shuoj_chenxiangxiang_main.flv" +
        "&" + // 请替换成实际可用的播放地址
        "hls=https://live.yccxx.cn/live/1400344454_shuoj_chenxiangxiang_main.m3u8"; // 请替换成实际可用的播放地址
      player
        .startPlay(url)
        .then(() => {
          console.log("player | startPlay | ok");
          console.log(url);
        })
        .catch((error) => {
          console.error("player | startPlay | failed", error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.titleWord {
  
  font-size: 16px;
  margin-right: 10px;
  color: #505050;
}
</style>