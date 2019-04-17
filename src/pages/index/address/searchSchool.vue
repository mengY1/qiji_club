<template>
  <div>
    <div class="search">
      <input type="text" placeholder="搜索学校" v-model="searchVal" :value="searchVal">
      <span @click="toSearch">搜索</span>
      <text class="deleted" @click="deleted" v-if="searchVal.length>0">×</text>
    </div>
    <main>
      <div class="tips" v-show="pShow">
        <p>暂无搜索相关学校</p>
      </div>

      <div class="schoolList">
        <p v-for="(item,index) in schoolList" :key="index" @click="getAddress(item.lng,item.lat,item.name,item.cms_school_id)">{{item.name}}</p>
      </div>
    </main>
  </div>
</template>
<script>
import url from "@/utils/common";
import { schools } from "@/utils/api";
export default {
  data() {
    return {
      searchVal: "",
      url: url.url,
      schoolList: "",
      pShow: false
    };
  },
  onLoad(options) {
    this.searchVal = options.val;
    this.searchSchool();
  },
  onHide() {
    this.schoolList = "";
    this.searchVal = "";
    this.pShow = false;
  },
  methods: {
    deleted() {
      this.searchVal = "";
    },
    toSearch() {
      this.searchSchool();
    },
    searchSchool() {
      schools({ keyword: this.searchVal }).then(res => {
        this.schoolList = res.data;
        this.pShow = false;
        if (res.data.length === 0) {
          this.pShow = true;
        }
      });
    },
    getAddress(lng, lat, name,cms_school_id) {
      wx.setStorageSync("longitude", lng);
      wx.setStorageSync("latitude", lat);
      wx.setStorageSync("nowSchool", name);
      wx.setStorageSync("user_school_id",cms_school_id)
      wx.setStorageSync("refreshIndex",20)//跳转到首页时设置一个缓存，在首页判断若有该缓存则在onShow执行页面刷新
      wx.switchTab({
        url: "/pages/index/index"
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
.search {
  padding: 40rpx 40rpx 0;
  line-height: 88rpx;
  font-size: 28rpx;
  color: #333333;
  position: relative;
}
.search input {
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
.search .deleted {
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
.search span {
  display: inline-block;
  height: 88rpx;
  margin-left: 24rpx;
}

main .tips {
  margin-top: 24rpx;
  color: #ff4c5b;
  font-size: 22rpx;
  padding-left: 80rpx;
}
main .schoolList {
  padding: 0 80rpx;
  line-height: 80rpx;
  color: #333333;
  font-size: 28rpx;
}
</style>

