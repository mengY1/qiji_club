<template>
  <div>
    <div class="bg" :style="{backgroundImage: 'url(' + coverImgUrl + ')', backgroundSize:'100% 100%'}">
      <div class="main_wrap">
        <div class="title">
          <p>添加奇奇个人微信</p>
          <p>申请进入奇集社长交流群</p>
        </div>
        <div class="qrCode">
          <img :src="url+'/img/orgapp/1.0.0/qiqi_wechat_account.jpg'">
        </div>
        <div class="tips">
          <p>截图保存二维码，打开微信扫一扫</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      url: common.url,
      coverImgUrl: common.url + "/img/orgapp/1.0.0/mine/mine/bg@2x_.png"
    };
  },
  methods: {}
};
</script>
<style>
.bg {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.main_wrap {
  background: #fff;
  margin: 144rpx auto 0;
  width: 680rpx;
  height: 918rpx;
  border-radius: 10rpx;
  overflow: hidden;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-top: 150rpx;
  color: #321c07;
}
.qrCode {
  margin-top: 88rpx;
}
.qrCode img {
  width: 448rpx;
  height: 448rpx;
  display: block;
  margin: 0 auto;
}
.tips {
  font-size: 28rpx;
  color: #333333;
  text-align: center;
  margin-top: 4rpx;
}
</style>
