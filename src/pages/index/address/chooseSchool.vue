<template>
  <div>
    <header>
      <div class="search">
        <input type="text" placeholder="搜索学校" v-model="searchVal">
        <span @click="toSearch">搜索</span>
        <text class="deleted" @click="deleted" v-if="searchVal.length>0">×</text>
      </div>

      <div class="now">
        <span>当前定位</span>
        <div class="nowRight" @click="renew">
          <img :src="url+'/img/home/icon_Choose school.png'" alt="">
          <span>重新定位</span>
        </div>
        <div class="nowBox_wrap">
          <div class="nowBox">
            <p>{{nowSchool}}</p>
          </div>
        </div>
      </div>

      <div class="nearSchool">
        <p>附近学校</p>
        <div class="schoolBox" v-for="(item,index) in schoolList" :key="index">
          <p @click="chooseSchool(item.lat,item.lng,item.name,item.cms_school_id)" v-if="index<10">{{item.name}}</p>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
import { nearSchool } from "@/utils/api";
import url from "@/utils/common";
export default {
  data() {
    return {
      url: url.url,
      searchVal: "",
      nowSchool: "",
      schoolList: []
    };
  },
  onLoad() {
    this.nowSchool = wx.getStorageSync("nowSchool");
    this.searchVal = "";
    this.getNearSchool();
  },
  methods: {
    deleted() {
      this.searchVal = "";
    },
    toSearch() {
      if (this.searchVal.length > 0) {
        wx.navigateTo({
          url: "./searchSchool?val=" + this.searchVal
        });
      }
    },
    getNearSchool(status) {
      nearSchool({
        lat: wx.getStorageSync("latitude"),
        lng: wx.getStorageSync("longitude")
      }).then(res => {
        this.schoolList = res.data;
        var { lat, lng, name,cms_school_id } = res.data[0];
        wx.setStorageSync("longitude", lng);
        wx.setStorageSync("latitude", lat);
        wx.setStorageSync("nowSchool", name);
        wx.setStorageSync("user_school_id",cms_school_id)
        if (status === 20) {
          wx.setStorageSync("refreshIndex",20)//跳转到首页时设置一个缓存，在首页判断若有该缓存则在onShow执行页面刷新
          setTimeout(() => {
            wx.switchTab({
              url: "/pages/index/index"
            });
          }, 500);
        }
      });
    },
    chooseSchool(lat, lng, name,cms_school_id) {
      wx.setStorageSync("longitude", lng);
      wx.setStorageSync("latitude", lat);
      wx.setStorageSync("nowSchool", name);
      wx.setStorageSync("user_school_id",cms_school_id)
      wx.setStorageSync("refreshIndex",20)//跳转到首页时设置一个缓存，在首页判断若有该缓存则在onShow执行页面刷新
      wx.switchTab({
        url: "/pages/index/index"
      });
    },
    renew() {
      this.toview = "";
      var that = this;
      var status = 10;
      wx.getSetting({
        success: function(res) {
          console.log(res.authSetting);
          //判断用户有无进行地理授权
          if (!res.authSetting["scope.userLocation"]) {
            wx.openSetting({
              success: function() {
                wx.getLocation({
                  type: "gcj02",
                  altitude: true,
                  success: function(res) {
                    console.log("地理位置授权信息", res);
                    status += 10;
                    wx.setStorageSync("longitude", res.longitude);
                    wx.setStorageSync("latitude", res.latitude);
                    that.getNearSchool(status);
                  }
                });
              }
            });
          } else {
            wx.getLocation({
              type: "gcj02",
              altitude: true,
              success: function(res) {
                console.log("地理位置授权信息", res);
                wx.setStorageSync(
                  "location",
                  res.longitude + "," + res.latitude
                );
                wx.setStorageSync("longitude", res.longitude);
                wx.setStorageSync("latitude", res.latitude);
                wx.setStorageSync(
                  "location",
                  res.longitude + "," + res.latitude
                );
                status += 10;
                that.getNearSchool(status);
              }
            });
          }
        }
      });
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
header .search {
  padding: 40rpx 40rpx 0;
  line-height: 88rpx;
  font-size: 28rpx;
  color: #333333;
  position: relative;
}
header .search input {
  width: 590rpx;
  line-height: 88rpx;
  height: 88rpx;
  box-sizing: border-box;
  background: #f5f5f5;
  border-radius: 44rpx;
  padding-left: 40rpx;
  color: #331900;
  float: left;
}
header .search .deleted {
  position: absolute;
  display: inline-block;
  box-sizing: border-box;
  width: 26rpx;
  height: 26rpx;
  text-align: center;
  line-height: 26rpx;
  color: #fff;
  border-radius: 50%;
  background: #ccc7b8;
  top: 71rpx;
  right: 150rpx;
  z-index: 5;
}
header .search span {
  display: inline-block;
  height: 88rpx;
  margin-left: 24rpx;
}

header .now {
  margin-top: 54rpx;
  padding: 0 40rpx 0 42rpx;
  line-height: 50rpx;
  overflow: hidden;
}
header .now > span {
  font-size: 28rpx;
  color: #999999;
  float: left;
  line-height: 38rpx;
}
header .now .nowRight {
  margin-left: 0rpx;
  overflow: hidden;
  float: right;
  font-size: 28rpx;
  color: #576b95;
  line-height: 38rpx;
  height: 38rpx;
}
header .now .nowRight img {
  width: 32rpx;
  height: 32rpx;
  vertical-align: middle;
  padding-bottom: 4rpx;
}
header .now .nowBox_wrap {
  width: 100%;
  overflow: hidden;
}
header .now .nowBox {
  line-height: 60rpx;
  padding: 0 44rpx 0 46rpx;
  box-sizing: border-box;
  color: #576b95;
  font-size: 28rpx;
  background: #f5f5f5;
  border-radius: 4rpx;
  margin-top: 26rpx;
  overflow: hidden;
  float: left;
  margin-left: 0rpx;
}
header .now .nowBox p {
  max-width: 578rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

header .nearSchool {
  margin-top: 52rpx;
  font-size: 28rpx;
  color: #999999;
  padding: 0 40rpx 0rpx 42rpx;
}
header .nearSchool .schoolBox {
  margin-top: 0rpx;
  padding: 0 44rpx 0 46rpx;
  color: #333333;
  line-height: 60rpx;
  background: #f5f5f5;
  border-radius: 4rpx;
  box-sizing: border-box;
  float: left;
  margin-top: 20rpx;
  margin-right: 20rpx;
}
header .nearSchool .schoolBox p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 576rpx;
}
</style>
