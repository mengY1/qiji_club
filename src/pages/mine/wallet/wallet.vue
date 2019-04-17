<template>
  <div class="wallet">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <div class="haveMoney" v-if="itemShow">
      <div class="now">
        <span>{{money}}</span>
        <div class="btn" @click="toWithdraw">
          <text>提现</text>
        </div>
      </div>
      <div class="more" @click="toFlowRecord">
        <span>流水记录</span>
        <img :src="url+'/img/default/more.png'">
      </div>
    </div>

    <div class="noMoney" v-else>
      <div class="now">
        <span>0.00</span>
        <div class="btn" @click="toSupport">
          <text>马上去赚赞助</text>
        </div>
      </div>
      <div class="more" @click="toFlowRecord">
        <span>流水记录</span>
        <img :src="moreIcon" v-if="moreIcon" :key="moreIcon">
      </div>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common"
import { userInfo, clubActivities } from "@/utils/api";
import loading from "@/components/loading";
export default {
  data() {
    return {
      url:url.url,
      itemShow: false,
      money: "1",
      userInfoList: {},
      ActListShow: true,
      loadingShow: true,
      moreIcon:url.url+'/img/default/more.png'
    };
  },
  // onLoad: function(options) {
  //   //   let money = options.money
  //   //   this.money = money
  //   this.getActInfo();
  // },
  components: {
    loading
  },
  onLoad() {},
  onShow() {
    this.loadingShow = true;
    this.getActInfo();
  },
  updated() {},
  methods: {
    getMoney() {
      var that = this;
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      userInfo({}, token, true)
        .then(function(res) {
          that.money = res.orgs.wallet_amount;
          console.log(that.money);
          if (that.money > 0) {
            that.itemShow = true;
          }
          that.loadingShow = false;
        })
        .catch(err => {
          that.loadingShow = false;
        });
    },
    async getActInfo() {
      let org_id = wx.getStorageSync("org_id");
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      let data = await clubActivities(org_id, { status: 20 }, token, true);
      if (data.data.length == 0) {
        this.ActListShow = false;
      }
      this.getMoney();
    },
    toWithdraw() {
      var url = "./withdraw/withdraw?money=";
      wx.navigateTo({
        url: url + this.money
      });
    },
    toFlowRecord() {
      wx.navigateTo({
        url: "./flowRecord/flowRecord"
      });
    },
    toSupport() {
      if (this.ActListShow) {
        wx.navigateTo({
          url: "./support/support"
        });
      } else {
        wx.navigateTo({
          url: "../../mine/publish/publish"
        });
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
.now {
  width: 670rpx;
  height: 276rpx;
  border: 1px solid #e6e6e6;
  border-radius: 20rpx;
  margin: 20rpx 40rpx 0;
  text-align: center;
  padding-top: 50rpx;
}
.now span {
  font-size: 66rpx;
  font-weight: bold;
}
.now .btn {
  margin: 40rpx 40rpx 40rpx;
  width: 590rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #ffb90c;
  border-radius: 20rpx;
  font-size: 34rpx;
  color: #331900;
}
.more {
  padding: 40rpx;
  margin-top: 40rpx;
  position: relative;
}
.more span {
  font-size: 34rpx;
  color: #99958a;
}
.more img {
  width: 16rpx;
  height: 28rpx;
  position: absolute;
  right: 40rpx;
  top: 56rpx;
}
</style>

