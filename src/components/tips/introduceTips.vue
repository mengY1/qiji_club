<template>
  <!-- 奇集社团介绍弹窗 -->
  <div v-if="tipShow">
    <div class="windows_bg">
      <div class="window">
        <img :src="url+'/img/home/pop_guanbi@2x.png'" class="close_icon" @click="iKnow">
        <img :src="url+'/img/orgapp/1.0.0/complete/pop@2x.png'" class="slogan">
        <p class="txt">
          奇集社团是一个提供社长交流，社团赞助，活动管理的平台。在奇集社团发布的活动信息，将会在奇集小程序展示给你的同学查看。
        </p>
        <div class="btn">
          <form @submit="iKnow" report-submit='true'>
            <button form-type="submit" style="background:#ffb90c">我知道了</button>
          </form>
          <form @submit="toLook" report-submit='true'>
            <button form-type="submit" style="background:#f6f6f6">去奇集看看</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
import {formId} from "@/utils/common"
export default {
  data() {
    return {
      url: common.url,
      tipShow: false
    };
  },
  onLoad() {
    if (wx.getStorageSync("intro_tips_status")) {
      this.tipShow = false;
    } else {
      this.tipShow = true;
    }
  },
  onShow() {
    if (wx.getStorageSync("intro_tips_status")) {
      this.tipShow = false;
    } else {
      this.tipShow = true;
    }
  },
  methods: {
    iKnow(e) {
      formId(e)
      this.tipShow = false;
      wx.setStorageSync("intro_tips_status", true);
    },
    toLook(e) {
      formId(e)
      this.tipShow = false;
      wx.setStorageSync("intro_tips_status", true);
      wx.navigateToMiniProgram({
        appId: "wx99418b7b5cdcc4d4",
        path: "pages/index/index?id=123",
        extraData: {},
        envVersion: "develop",
        success(res) {
          // 打开成功
        }
      });
    }
  }
};
</script>
<style scoped>
.windows_bg {
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  z-index: 10;
}

.window {
  width: 590rpx;
  height: 742rpx;
  background: #fff;
  border-radius: 8rpx;
  margin: 200rpx auto 0;
  position: relative;
  overflow: hidden;
  padding: 0 60rpx 0 52rpx;
  box-sizing: border-box;
}
.close_icon {
  width: 22rpx;
  height: 22rpx;
  position: absolute;
  right: 30rpx;
  top: 30rpx;
}
.slogan {
  display: block;
  width: 352rpx;
  height: 218rpx;
  margin: 60rpx auto 0;
}
.txt {
  font-size: 28rpx;
  line-height: 44rpx;
  color: #333333;
  text-align: center;
  margin-top: 20rpx;
}
.btn {
  margin-top: 42rpx;
}
.btn button {
  width: 272rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 28rpx;
  color: #332503;
  margin-bottom: 20rpx;
}
.btn button:after {
  border: 0;
}
</style>
