<template>
  <div>
    <!-- <img class="guide" src="/static/images/guide.jpg" alt=""> -->
    <div class="guide" :style="{backgroundImage:'url('+bgImg+')'}"></div>
    <div class="button" @click="toBuild">
      <span>创建社团</span>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common";
import { userInfo } from "@/utils/api";
export default {
  data() {
    return {
      token: "",
      url:url.url,
      bgImg: url.url + "/img/guide.jpg"
    };
  },
  methods: {
    toBuild() {
      if (wx.getStorageSync("silentlogin").token) {
        var token = " ";
        token += wx.getStorageSync("silentlogin").token;
        userInfo({}, token).then(res => {
          console.log(res);
          if (res.orgs) {
            wx.showModal({
              title: "提示",
              content: "你已拥有社团，无法创建"
            });
          } else if (
            res.last_org_claim &&
            res.last_org_claim.audit_status == 10
          ) {
            wx.showModal({
              title: "提示",
              content: "你的社团正在审核中"
            });
          } else {
            wx.navigateTo({
              url: "/pages/mine/buildClub/index"
            });
          }
        });
      } else {
        wx.showToast({
          title: "请先注册"
        });
        setTimeout(() => {
          wx.navigateTo({
            url: "/pages/login/register/index"
          });
        }, 1000);
      }
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: "校园生活很无趣?社团活动上奇集!",
      path: "/pages/index/index",
      imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
.guide {
  /* width:750rpx;
    height: 1206rpx; */
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100vh;
}
.button {
  position: fixed;
  bottom: 53rpx;
  width: 670rpx;
  height: 88rpx;
  box-sizing: border-box;
  line-height: 88rpx;
  text-align: center;
  background: #ffb90c;
  border-radius: 44rpx;
  margin: 0 40rpx;
  font-weight: bold;
  font-size: 30rpx;
  color: #332503;
}
</style>


