<template>
  <div class="apply">
    <div class="successIcon">
      <img :src="url+'/img/default/success.png'">
    </div>
    <div class="tips">
      <p>你已成功提交申请</p>
      <p>奇集官方人员将会在3个工作日内通过电话/微信联系你</p>
    </div>
    <button open-type="share" class="btn">推荐给好友</button>
    <div class="btn" @click="toIndex">
      <text>返回首页</text>
    </div>
  </div>
</template>
<script scoped>
import url from "@/utils/common";
export default {
  data() {
    return {
      url: url.url
    };
  },
  methods: {
    toIndex() {
      wx.switchTab({
        url: "../../../../index/index"
      });
    }
  },
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "校园生活很无趣?社团活动上奇集!",
      path: "/pages/index/index",
      imageUrl: this.url+"img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
.successIcon {
  padding: 100rpx 275rpx 0;
}
.successIcon img {
  width: 200rpx;
  height: 200rpx;
}
.tips {
  margin-top: 58rpx;
  text-align: center;
}
.tips p:first-child {
  font-size: 40rpx;
  color: #000000;
}
.tips p:nth-child(2) {
  font-size: 28rpx;
  color: #888888;
  margin-top: 40rpx;
}
.btn {
  width: 690rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #ffffff;
  font-size: 36rpx;
  background: #09bb07;
  border-radius: 10rpx;
  margin: 65rpx 30rpx 0;
}
</style>
