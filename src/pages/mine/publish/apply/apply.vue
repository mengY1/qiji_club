<template>
  <div class="apply">
    <div class="successIcon">
      <img :src="successIcon" :key="date.url+'/img/default/success.png'">
    </div>
    <div class="tips">
      <p>你已成功提交申请</p>
      <p>奇集将会在24小时内通知审核结果</p>
    </div>
    <form @submit="toMine" report-submit="true">
      <button class="backBtn" form-type="submit">我知道了</button>
    </form>

    <div class="footTips" v-if="date=='begin'">
      <p>你发布的活动将会默认参与人气活动王</p>
    </div>
  </div>
</template>
<script scoped>
import date from "@/utils/common";
import { formId } from "@/utils/common";
export default {
  data() {
    return {
      date: date.date,
      url: date.url,
      successIcon: date.url + "/img/default/success.png"
    };
  },
  methods: {
    toMine(e) {
      formId(e);
      wx.switchTab({
        url: "/pages/mine/index"
      });
    }
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
.backBtn {
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

.footTips {
  text-align: center;
  font-size: 28rpx;
  margin-top: 60rpx;
  color: #888;
}
</style>
