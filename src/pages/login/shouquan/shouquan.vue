<template>
  <div>
    <header>
      <div class="logo">
        <!-- <img :src="url+'/img/default/shouquan/logo.png'" alt=""> -->
        <img src="/static/images/logo.png" alt="">
      </div>
    </header>
    <div class="content">
      <div v-show="status==10">
        <span>需要你的授权奇集才能为你提供服务</span>
        <span>获取你的公开信息(头像，昵称等)</span>
      </div>
      <div v-show="status==20">
        <span>你还没给奇集授权</span>
      </div>
    </div>
    <button class="bottom" type="primary" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo" @click="changeVal">{{status==10?"授权登录":"重新授权"}}</button>
  </div>
</template>
<script>
import url from "@/utils/common";
import { formId } from "@/utils/common";
import amapFile from "@/utils/amap-wx";
import { silentlogin, nearSchool } from "@/utils/api";
export default {
  data() {
    return {
      url: url.url,
      value: 1,
      status: 10, //10未授权 20拒绝授权
      channel: "", //渠道
      scene: "" //场景值
    };
  },
  onLoad() {
    wx.setStorageSync("longitude", 112.484108);
    wx.setStorageSync("latitude", 23.006117);
    wx.setStorageSync("nowSchool", "广东理工学院");
    wx.setStorageSync("user_school_id", 651314);
    this.getLocation();
  },
  mounted() {},
  updated() {},
  methods: {
    changeVal() {
      this.value = 1;
    },
    bindGetUserInfo() {
      var that = this;
      this.value = 1;
      wx.login({
        success: function(res) {
          var code = res.code;
          //用户信息授权
          wx.getUserInfo({
            lang: "zh_CN",
            success: function(res) {
              console.log(res);
              if (wx.getStorageSync("channel")) {
                that.channel = wx.getStorageSync("channel");
              }
              if (wx.getStorageSync("scene")) {
                that.scene = wx.getStorageSync("scene");
              }
              let data = {
                encryptedData: res.encryptedData,
                iv: res.iv,
                code: code,
                channel: that.channel,
                scene: that.scene
              };
              wx.setStorageSync("userInfo", data);
              that.value = 111;
              silentlogin(data).then(function(res) {
                // wx.setStorageSync("unionid", res.unionid);
                console.log(res);
                if (res.auth) {
                  let msg = {
                    nickname: res.nickname,
                    unionid: res.unionid,
                    avatar: res.avatar,
                    user_id: res.user_id,
                    token: res.auth.access_token,
                    openid: res.openid,
                    refresh_token: res.auth.refresh_token
                  };
                  wx.setStorageSync("silentlogin", msg);
                  wx.setStorageSync("refreshIndex", 20);//20表示返回到首页的时候刷新页面
                  setTimeout(() => {
                    wx.navigateBack({
                      success: function() {
                        delta: 0;
                      }
                    });
                  }, 500);
                } else {
                  let msg = {
                    nickname: res.nickname,
                    unionid: res.unionid,
                    avatar: res.avatar,
                    user_id: res.user_id,
                    openid: res.openid
                  };
                  wx.setStorageSync("silentlogin", msg);
                  wx.setStorageSync("refreshIndex", 20);//20表示返回到首页的时候刷新页面
                  setTimeout(() => {
                    wx.navigateBack({
                      success: function() {
                        delta: 0;
                      }
                    });
                  }, 500);
                }
              });
            },
            fail: function(res) {
              that.status = 20;
            }
            // fail: function(res) {
            //   console.log(res);
            //   wx.navigateBack({
            //     success: function() {
            //       delta: -1;
            //     }
            //   });
            // }
          });
        }
      });
      console.log(222, this.value);
    },
    //地理位置授权
    getLocation() {
      var that = this;
      // 地理位置授权
      wx.getLocation({
        type: "gcj02",
        altitude: true,
        success: function(res) {
          console.log("地理位置授权信息", res);
          wx.setStorageSync("longitude", res.longitude);
          wx.setStorageSync("latitude", res.latitude);
          // that.getPolyline();
          that.getSchool(res.longitude, res.latitude);
        },
        fail: function(res) {
          wx.setStorageSync("longitude", 112.484108);
          wx.setStorageSync("latitude", 23.006117);
          wx.setStorageSync("nowSchool", "广东理工学院");
          wx.setStorageSync("user_school_id", 651314);
        }
      });
    },
    //根据授权获取的经纬度查询学校
    getSchool(lng, lat) {
      nearSchool({ lng: lng, lat: lat }).then(res => {
        var { lat, lng, name, cms_school_id } = res.data[0];
        wx.setStorageSync("longitude", lng);
        wx.setStorageSync("latitude", lat);
        wx.setStorageSync("nowSchool", name);
        wx.setStorageSync("user_school_id", cms_school_id);
      });
    }
    //高德地图
    // getPolyline() {
    //   var that = this;
    //   var myAmapFun = new amapFile.AMapWX({
    //     key: "1fd7260e20d4a36891d33542efbdfc79"
    //   });
    //   var location = wx.getStorageSync("location");
    //   myAmapFun.getRegeo({
    //     location: location,
    //     success: function(data) {
    //       //成功回调
    //       console.log(data);
    //       var city = data[0].regeocodeData.addressComponent.city;
    //       that.city = city;
    //       if (city.length == 0) {
    //         that.city = data[0].regeocodeData.addressComponent.province;
    //       }
    //       wx.setStorageSync("city", that.city);
    //     },
    //     fail: function(info) {
    //       //失败回调
    //       console.log(info);
    //     }
    //   });
    // }
  },
  onUnload: function() {
    if (this.value == 1) {
      wx.navigateBack({
        success: function() {
          delta: -1;
        }
      });
    }
  }
};
</script>
<style>
header {
}
header .logo {
  margin: 100rpx auto 0;
  width: 198rpx;
  height: 198rpx;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
  border-radius: 20rpx;
  text-align: center;
  padding-top: 72rpx;
}
header .logo img {
  width: 120rpx;
  height: 54rpx;
}
.content {
  text-align: center;
  margin-top: 47rpx;
}
.content span {
  display: block;
  color: #333333;
  font-size: 32rpx;
  line-height: 48rpx;
}
.bottom {
  border-radius: 80rpx;
  margin: 0 auto;
  margin-top: 52rpx;
  font-size: 35rpx;
  width: 690rpx;
  height: 88rpx;
  box-sizing: border-box;
  border-radius: 10rpx;
}
</style>

