<template>
  <div class="guide">
    <div class="guide_wrap">
      <img :src="url+'/img/home/img.png'" class="guide_banner" alt="">
      <div class="bottom">
        <div class="bottomBox" :style="{backgroundImage:'url('+bgImg1+')'}" style="margin-bottom:40rpx;" :data-id=1 @click="toRegister">
          <p>社长用户</p>
          <p>我要活动赞助</p>
        </div>
        <div class="bottomBox" :style="{backgroundImage:'url('+bgImg2+')'}" :data-id=2 @click="toRegister">
          <p>个人用户</p>
          <p>我要查看活动</p>
        </div>
      </div>
      <div class="close" @click="close">
        <img :src="url+'/img/home/guanbi.png'" alt="">
      </div>
    </div>

  </div>
</template>
<script>
import url from "@/utils/common";
export default {
  data() {
    return {
      url: url.url,
      bgImg1: url.url + "img/home/shezhang.png",
      bgImg2: url.url + "img/home/gerenyonghu.png"
    };
  },
  methods: {
    toRegister(e) {
      var id = e.currentTarget.dataset.id;
      this.$emit("toRegister", id);
      wx.setStorageSync("guideShow", "hide");
      if (id == 1) {
        wx.setStorageSync("registerStatus", "president");
      } else {
        wx.setStorageSync("registerStatus", "personal");
      }
    },
    close() {
      console.log("关闭");
      this.$emit("close");
      wx.setStorageSync("guideShow", "hide");
    }
  }
};
</script>
<style scoped>
.guide {
  position: fixed;
  z-index: 40;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.6);
}
.guide_wrap {
  position: relative;
  top: 50%;
  box-sizing: border-box;
  width: 670rpx;
  height: 712rpx;
  border-radius: 20rpx;
  background: rgba(245, 245, 245, 1);
  margin: auto;
  margin-top: -356rpx;
  /* margin-top: 160rpx; */
}
.guide_wrap .guide_banner {
  width: 670rpx;
  height: 240rpx;
}
.guide_wrap .bottom {
  width: 670rpx;
  height: 472rpx;
  box-sizing: border-box;
  padding: 40rpx;
}
.guide_wrap .bottomBox {
  background-size: 100% 100%;
  width: 590rpx;
  height: 176rpx;
  box-sizing: border-box;
  border-radius: 20rpx;
  padding: 50rpx 0 50rpx 40rpx;
  color: #333333;
}
.guide_wrap .bottomBox p:first-child {
  font-size: 36rpx;
  font-weight: bold;
}
.guide_wrap .bottomBox p:nth-child(2) {
  font-size: 24rpx;
}
.close {
  width: 48rpx;
  height: 48rpx;
  margin: 0 auto;
  margin-top: 70rpx;
}
.close img {
  width: 48rpx;
  height: 48rpx;
}
</style>
