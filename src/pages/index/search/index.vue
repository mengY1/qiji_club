<template>
  <div class="search">
    <div class="input">
      <input type="text" class="in" maxlength="20" @focus="searchFocu" @blur="searchBlu" v-model="searchName" @confirm="toSearch" confirm-type="search">
      <div class="searchNumber" v-show="searchFocus">
        <text class="searchText">输入关键词搜索社团活动</text>
      </div>
    </div>

    <div class="history" v-show="historyShow">
      <div class="title">
        <text>搜索历史</text>
        <img src="http://54qj.54qn.cn/Public/images/common/delete.png" @click="cleanHistory">
      </div>
      <div class="label">
        <div class="label-item" v-for="(item,index) in history" :index="index" :key="index" v-show="index<7" @click="toSearch" :data-name="item">
          <text>{{item}}</text>
        </div>
      </div>
    </div>

    <div class="activity" v-show="activityShow">
      <div class="title">
        <span>活动</span>
      </div>
      <div class="activity-item" v-for="(item,index) in acitivities" :key="index" :data-id="item.act_id" @click="toAct">
        <div class="item_left">
          <img :src="url+item.cover+otherUrl">
          <div class="membersBg">
            {{item.members}}人已报名
          </div>
        </div>
        <div class="item_right">
          <p>{{item.title}}</p>
          <p>{{item.org_name}}</p>
          <p>{{activity_start_at[index]}} -- {{activity_expire_at[index]}}</p>
        </div>
      </div>
      <div class="more" @click="activityMore">
        <p>查看更多</p>
      </div>
    </div>

    <div class="club" v-show="clubShow">
      <div class="title">
        <span>社团</span>
      </div>
      <div class="activity-item" v-for="(item,index) in clubs" :key="index" :data-id="item.org_id" @click="toClub">
        <div class="item_left">
          <img v-if="item.logo" :src="url+item.logo+logoUrl">
          <img v-else :src="url+'/img/default/org_logo.jpg'">
        </div>
        <div class="item_right">
          <p>{{item.name}}</p>
          <p>{{item.cms_school_name}} | {{item.summary}}</p>
          <p class="popularity" v-if="item.org_status!=30">
            <!-- <img src="http://54qj.54qn.cn/Public/images/index/hot.png"> -->
            <span>人气{{item.popularity}}</span>
          </p>
          <p class="nobody" v-else>
            <span>无社长</span>
          </p>
        </div>
      </div>
      <div class="more" @click="clubMore">
        <p>查看更多</p>
      </div>
    </div>

  </div>
</template>
<script>
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import otherUrl from "@/utils/common";
import changeTime from "@/utils/changeTime";
import { activitiesList, orgs } from "@/utils/api";
export default {
  data() {
    return {
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      searchFocus: true,
      searchName: "",
      token: "",
      history: [],
      historyShow: false,
      activityShow: false,
      clubShow: false,
      actPage: 1,
      clubPage: 1,
      acitivities: [],
      clubs: [],
      activity_start_at: [],
      activity_expire_at: []
    };
  },
  mounted() {
    var token = " ";
    token += wx.getStorageSync("silentlogin").token;
    this.token = token;
    this.searchName = "";
  },
  onLoad() {
    if (wx.getStorageSync("history")) {
      this.history = wx.getStorageSync("history");
      if (this.history.length == 0) {
        this.historyShow = false;
      } else {
        this.historyShow = true;
      }
    } else {
      this.history = [];
      this.historyShow = false;
    }
    this.searchName = "";
    this.activityShow = false;
    this.clubShow = false;
    console.log(this.historyShow);
  },
  onShow() {
    // this.searchName = "";
    // // this.historyShow = true;
    // this.activityShow = false;
    // this.clubShow = false;
  },
  methods: {
    searchFocu() {
      this.searchFocus = false;
    },
    searchBlu() {
      this.searchName == ""
        ? (this.searchFocus = true)
        : (this.searchFocus = false);
    },
    cleanHistory() {
      this.history = [];
      wx.setStorageSync("history", this.history);
    },
    toSearch(e) {
      this.activity_start_at = [];
      this.activity_expire_at = [];
      if (e.currentTarget.dataset.name) {
        this.searchName = e.currentTarget.dataset.name;
      } else {
        this.searchName = this.searchName.replace(/\s+/g, "");
        if (this.searchName.length > 0) {
          this.history.unshift(this.searchName);
        }
      }
      wx.setStorageSync("history", this.history);
      this.searchName = this.searchName.replace(/\s+/g, "");
      if (this.searchName.length > 0) {
        var that = this;
        console.log(this.historyShow);
        this.searchFocus = false;
        this.longitude = wx.getStorageSync("longitude");
        this.latitude = wx.getStorageSync("latitude");
        activitiesList(
          {
            pagesize: 3,
            page: 1,
            keyword: this.searchName,
            lng: this.longitude,
            lat: this.latitude,
            sort: "1,2"
          },
          this.token
        ).then(res => {
          for (var i = 0; i < res.data.length; i++) {
            this.activity_start_at.push(
              changeTime(res.data[i].activity_start_at, 16, 5)
            );
            this.activity_expire_at.push(
              changeTime(res.data[i].activity_expire_at, 16, 5)
            );
          }
          that.acitivities = res.data;
          console.log(that.acitivities);
          if (that.acitivities.length > 0) {
            that.historyShow = false;
            that.activityShow = true;
          } else {
            that.historyShow = true;
            that.activityShow = false;
          }
          that.searchOrg();
        });
      }
    },
    searchOrg() {
      var that = this;
      var longitude = wx.getStorageSync("longitude");
      var latitude = wx.getStorageSync("latitude");
      orgs(
        {
          pagesize: 3,
          page: 1,
          keyword: that.searchName,
          lng: longitude,
          lat: latitude,
          sort: "1,2"
        },
        this.token
      ).then(function(res) {
        that.clubs = res.data;
        if (that.clubs.length > 0) {
          that.clubShow = true;
          that.historyShow = false;
        } else {
          if (that.activityShow == false) {
            that.historyShow = true;
            wx.showToast({
              title: "没有查询结果"
            });
          } else {
            that.historyShow = false;
          }
          that.clubShow = false;
        }
      });
    },
    activityMore() {
      var url = "./searchMore?id=";
      wx.navigateTo({
        url: url + 1 + "&name=" + this.searchName
      });
    },
    toAct(e) {
      var id = e.currentTarget.dataset.id;
      var url = "../../activity/detail/detail?act_id=";
      wx.navigateTo({
        url: url + id
      });
    },
    clubMore() {
      var url = "./searchMore?id=";
      wx.navigateTo({
        url: url + 2 + "&name=" + this.searchName
      });
      // this.clubPage += 1;
      // var that = this;
      // orgs(
      //   { pagesize: 3, page: this.clubPage, keyword: this.searchName },
      //   this.token
      // ).then(function(res) {
      //   for (var i = 0; i < 3; i++) {
      //     if (res.data[i].org_id != "") {
      //       that.clubs.push(res.data[i]);
      //     }
      //   }
      // });
    },
    toClub(e) {
      var id = e.currentTarget.dataset.id;
      wx.setStorageSync("org_id", id);
      var url = "../../club/index?org_id=";
      wx.navigateTo({
        url: url + id
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
.search .input {
  width: 670rpx;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
  margin: 66rpx 40rpx 0;
}
.search .in {
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  /* color: #ccc7b8; */
  padding-left: 40rpx;
  font-size: 28rpx;
}
.search .searchNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}

.history {
  padding: 60rpx 33rpx 0;
}
.history .title {
  font-size: 30rpx;
  color: #332503;
  margin-left: 7rpx;
}
.history .title img {
  width: 26rpx;
  height: 26rpx;
  padding-top: 33rpx;
  float: right;
  margin-right: 7rpx;
}
.history .label {
  margin-top: 28rpx;
}
.history .label .label-item {
  padding: 19rpx 32rpx 18rpx 31rpx;
  border: 1px solid #e6e6e6;
  display: inline-block;
  border-radius: 30rpx;
  font-size: 26rpx;
  color: #99958a;
  margin: 14rpx 7rpx 0;
}

.activity,
.club {
  padding: 40rpx 40rpx 0;
  border-bottom: 20rpx solid #f6f6f6;
}
.title,
.club.title {
  line-height: 88rpx;
  font-size: 34rpx;
  color: #332503;
  border-bottom: 1px solid #e6e6e6;
}
.activity-item {
  padding: 40rpx 0;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
}
.activity-item .item_left {
  float: left;
  margin-right: 20rpx;
  position: relative;
}
.activity-item .item_left .membersBg {
  position: absolute;
  bottom: 8rpx;
  height: 48rpx;
  width: 100%;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  font-size: 22rpx;
  line-height: 48rpx;
  box-sizing: border-box;
  padding-left: 14rpx;
}
.activity-item .item_left img {
  width: 236rpx;
  height: 132rpx;
}
.activity-item .item_right p {
  font-size: 26rpx;
  color: #99958a;
  line-height: 46rpx;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.activity-item .item_right p:first-child {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 42rpx;
  font-size: 28rpx;
  color: #331900;
}
/* .activity-item .item_right h1 {
  color: #ff4c5b;
  font-size: 42rpx;
  line-height: 42rpx;
}
.activity-item .item_right h1 img {
  width: 28rpx;
  height: 32rpx;
  margin-right: 16rpx;
} */
.activity-item .item_right .popularity span {
  font-size: 22rpx;
  color: #ffffff;
  margin-top: 3rpx;
  font-family: "1234567890-Regular";
  display: inline-block;
  line-height: 36rpx;
  text-align: center;
  padding: 0 16rpx;
  border-radius: 8rpx;
  background: #ff555c;
}
.activity-item .item_right .nobody {
  padding: 0 16rpx;
  line-height: 32rpx;
  color: #fff;
  background: #ccb166;
  text-align: center;
  display: inline-block;
  border-radius: 8rpx;
  margin-top: 24rpx;
  font-size: 22rpx;
}
.more p {
  font-size: 28rpx;
  line-height: 88rpx;
  text-align: center;
}

.club .item_left img {
  width: 156rpx;
  height: 156rpx;
  border-radius: 20rpx;
}
</style>

