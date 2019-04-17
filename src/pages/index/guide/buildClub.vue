<template>
    <div class="build">
        <div class="build_wrap">
            <div class="buildBox">
                <img :src="url+'/img/home/qianbao.png'" class="wallet">
                <div class="content">
                    <p>你好像还没有创建社团呢</p>
                    <p>听说创建了社团能拿赞助哦</p>
                </div>
                <div class="btn" @click="toBuild">
                    <p>创社团发活动</p>
                </div>
                <img :src="url+'/img/home/guanbi.png'" class="closeIcon" @click="close">
            </div>
        </div>
    </div>
</template>
<script>
import url from "@/utils/common";
export default {
  data() {
    return {
      url: url.url
    };
  },
  methods: {
    toBuild() {
      wx.navigateTo({
        url: "/pages/mine/buildClub/index"
      });
      this.$emit("buildClubGuide");
    },
    close() {
      this.$emit("buildClubGuide");
    }
  }
};
</script>
<style scoped>
.build {
  position: fixed;
  z-index: 40;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.build_wrap {
  width: 522rpx;
  height: 380rpx;
  position: fixed;
  z-index: 40;
  left: 114rpx;
  top: 376rpx;
  background: #fff;
  border-radius: 20rpx;
}
.build_wrap .buildBox {
  width: 522rpx;
  height: 380rpx;
  box-sizing: border-box;
  text-align: center;
  position: relative;
}
.build_wrap .buildBox .wallet {
  /* position: absolute;
  top: 0rpx; */
  margin: 0 auto;
  width: 367rpx;
  height: 274rpx;
  margin-top: -146rpx;
}
.build_wrap .buildBox .content p:first-child {
  margin-top: 0rpx;
  color: #331900;
  font-size: 36rpx;
}
.build_wrap .buildBox .content p:nth-child(2) {
  font-size: 28rpx;
  color: #331900;
  margin-top: 10rpx;
}
.build_wrap .buildBox .btn {
  width: 440rpx;
  height: 88rpx;
  margin: 0 auto;
  margin-top: 24rpx;
  border-radius: 44rpx;
  background: #ffc226;
  text-align: center;
  line-height: 88rpx;
  color: #fff;
  font-weight: bold;
  font-size: 32rpx;
}
.build_wrap .buildBox .closeIcon {
  width: 48rpx;
  height: 48rpx;
  position: absolute;
  bottom: -176rpx;
  left: 236rpx;
}
</style>
