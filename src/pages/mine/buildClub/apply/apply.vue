<template>
  <div class="apply">
    <div class="icon">
      <img :src="successIcon" :key="url+'/img/default/success.png'" alt="">
    </div>
    <main>
      <div class="applyTxt">
        <p>你已成功提交申请</p>
        <p>奇集将会在24小时内通知审核结果</p>
      </div>
      <div class="btn">
        <form @submit="toPublish" report-submit="true">
          <button form-type="submit">去发布活动</button>
        </form>
      </div>
      <div class="toMine" @click="toMine">
        <p>我知道了</p>
      </div>
    </main>
  </div>
</template>
<script scoped>
import common from "@/utils/common";
import { formId } from "@/utils/common";
export default {
  data() {
    return {
      url: common.url,
      successIcon: common.url + "/img/default/success.png"
    };
  },
  methods: {
    toPublish(e) {
      formId(e);
      if (common.status === "dev") {
        wx.reportAnalytics("create_org_click", {
          step: "去发布活动"
        });
      }
      wx.navigateTo({
        url: "/pages/mine/publish/publish"
      });
    },
    toMine() {
      if (common.status === "dev") {
        wx.reportAnalytics("create_org_click", {
          step: "我知道了"
        });
      }
      wx.switchTab({
        url: "/pages/mine/index"
      });
    }
  }
};
</script>
<style scoped>
.icon {
  margin-top: 100rpx;
}
.icon img {
  width: 200rpx;
  height: 200rpx;
  padding: 0 275rpx;
}
.applyTxt {
  margin-top: 58rpx;
  text-align: center;
}
.applyTxt p:first-child {
  font-size: 40rpx;
  color: #000000;
}
.applyTxt p:nth-child(2) {
  width: 569rpx;
  padding-left: 82rpx;
  font-size: 28rpx;
  color: #888888;
  margin-top: 38rpx;
}
.btn {
  margin-top: 64rpx;
  padding: 0 30rpx;
}
.btn button {
  height: 88rpx;
  font-size: 36rpx;
}
.btn button:first-child {
  color: #ffffff;
  background: #09bb07;
}
.btn button:nth-child(2) {
  margin-top: 30rpx;
  background: #ffffff;
}
.toMine {
  margin-top: 50rpx;
  text-align: center;
  font-size: 28rpx;
  color: #999999;
}
</style>

