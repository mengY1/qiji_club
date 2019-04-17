<template>
  <!-- 扫码移交社长 -->
  <div>
    <div class="bg" :style="{backgroundImage: 'url(' + coverImgUrl + ')', backgroundSize:'100% 100%'}">
      <div class="main_wrap">
        <div class="main">
          <img class="logo" :src="url+'/img/orgapp/1.0.0/mine/remove/qj_logo@2x.png'" alt="">
          <img class="qr_code" v-if="qrcode" :src="url+qrcode" alt="">
          <div class="text">
            <h1>移交流程</h1>
            <p class="tips">
              1.让新社长用微信扫一扫，扫描此二维码
              2.新社长扫描成功后，点击【确认】按钮
              3.新社长确认后即可转移成功
            </p>
          </div>
        </div>
        <div class="bottom_wrap">
          <img class="tips_icon" :src="url+'/img/orgapp/1.0.0/mine/remove/Exclamatory @2x.png'" alt="">
          <div class="text">
            <p>请谨慎操作，社长移交成功后你将失去社团管理权限，</p>
            <p>操作不可撤回，移交过程请勿退出此页面</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
import { chaif_replaces, remove_key } from "@/utils/api";
export default {
  data() {
    return {
      url: common.url,
      org_id: "",
      coverImgUrl: common.url + "/img/orgapp/1.0.0/mine/remove/bg@2x.png",
      qrcode: "",
      timer: "",
      new_confirm_status: "",
      key: ""
    };
  },
  onLoad(options) {
    this.org_id = options.org_id;
    this.getRemoveInfo(options.org_id);
    this.pollingAction();
  },
  onShow() {},
  onUnload() {
    clearInterval(this.timer);
  },
  methods: {
    //   生成移交记录
    getRemoveInfo(id) {
      chaif_replaces(id).then(res => {
        this.qrcode = res.qrcode;
        this.new_confirm_status = res.new_confirm_status;
        this.key = res.key;
        console.log(this.key);
      });
    },
    //移交详情
    getRemoveDetail() {
      remove_key(this.key,"",true).then(res => {
        if (res.data.new_confirm_status === 1) {
          //新社长已确认,清除定时器
          clearInterval(this.timer);
          wx.reLaunch({
            url: "./oldProprieter?key=" + this.key
          });
        }
      });
    },
    // 设置定时器进行轮询
    pollingAction() {
      this.timer = setInterval(() => {
        this.getRemoveDetail();
      }, 1500);
    }
  }
};
</script>
<style>
.bg {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.main_wrap {
  position: relative;
}
.main {
  width: 650rpx;
  height: 730rpx;
  border-radius: 10rpx 10rpx 0 0;
  background: #fff;
  margin: 186rpx auto 0;
  overflow: hidden;
}
.logo {
  width: 180rpx;
  height: 180rpx;
  display: block;
  position: absolute;
  top: -90rpx;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 10;
}
.qr_code {
  width: 360rpx;
  height: 360rpx;
  display: block;
  margin: 114rpx auto 0;
}
.text {
  text-align: center;
}
.text h1 {
  color: #333333;
  font-weight: bold;
  font-size: 32rpx;
  margin-top: 34rpx;
}
.text .tips {
  width: 500rpx;
  line-height: 48rpx;
  color: #999999;
  font-size: 28rpx;
  margin: 0 auto;
}
.bottom_wrap {
  width: 650rpx;
  height: 120rpx;
  background: #f5f5f5;
  margin: 0 auto;
  border-radius: 0 0 10rpx 10rpx;
  position: relative;
  overflow: hidden;
}
.bottom_wrap .tips_icon {
  width: 32rpx;
  height: 32rpx;
  position: absolute;
  top: 44rpx;
  left: 26rpx;
}
.bottom_wrap .text {
  color: #333333;
  font-size: 24rpx;
  text-align: left;
  margin-left: 72rpx;
  margin-top: 28rpx;
}
</style>
