<template>
  <div>
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <div class="input">
      <input type="text" class="in" @focus="searchFocu" @blur="searchBlu" v-model="searchName" @confirm="toSearch" confirm-type="send">
      <div class="searchNumber" v-show="searchFocus">
        <text class="searchText">搜索结果优先显示活动，其次显示社团</text>
      </div>
    </div>
    <div class="activity" v-if="id==1">
      <!-- <div class="title">
            <span>活动</span>
          </div> -->
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
      <div class="more" v-show="pShow">
        <p>已无更多内容</p>
      </div>
    </div>

    <div class="club" v-if="id==2">
      <!-- <div class="title">
            <span>社团</span>
          </div> -->
      <div class="activity-item" v-for="(item,index) in clubs" :key="index" :data-id="item.org_id" @click="toClub">
        <div class="item_left">
          <img v-if="item.logo" :src="url+item.logo+logoUrl">
          <img v-else :src="url+'/img/default/org_logo.jpg'">
        </div>
        <div class="item_right">
          <p>{{item.name}}</p>
          <p>{{item.cms_school_name}} | {{item.summary}}</p>
          <p>
            <span v-if="item.org_status==30" class="green">无社长</span>
            <span v-else>人气{{item.popularity}}</span>
          </p>
        </div>
      </div>
      <div class="more" v-show="pShow">
        <p>已无更多内容</p>
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
import loading from "@/components/loading";
export default {
  onLoad(options) {
    this.loadingShow = true;
    this.id = options.id;
    this.searchName = options.name;
  },
  data() {
    return {
      loadingShow: true,
      searchFocus: false,
      id: "",
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      acitivities: [],
      activity_start_at: [],
      activity_expire_at: [],
      clubs: [],
      searchName: "",
      page: 1,
      token: " ",
      pShow: false,
      longitude: "",
      latitude: ""
    };
  },
  onReachBottom() {
    this.more();
  },
  components: {
    loading
  },
  mounted() {
    var that = this;
    if (this.id == 1) {
      this.longitude = wx.getStorageSync("longitude");
      this.latitude = wx.getStorageSync("latitude");
      activitiesList(
        {
          pagesize: 20,
          page: 1,
          keyword: that.searchName,
          lng: this.longitude,
          lat: this.latitude,
          sort: "1,2"
        },
        this.token,
        true
      )
        .then(function(res) {
          that.acitivities = res.data;
          that.loadingShow = false;
          for (var i = 0; i < that.acitivities.length; i++) {
            that.activity_start_at.push(
              changeTime(that.acitivities[i].activity_start_at, 16, 5)
            );
            that.activity_expire_at.push(
              changeTime(that.acitivities[i].activity_expire_at, 16, 5)
            );
          }
        })
        .catch(error => {
          that.loadingShow = false;
        });
    } else if (this.id == 2) {
      var longitude = wx.getStorageSync("longitude");
      var latitude = wx.getStorageSync("latitude");
      orgs(
        {
          pagesize: 20,
          page: 1,
          keyword: that.searchName,
          lng: longitude,
          lat: latitude,
          sort: "1,2"
        },
        this.token,
        true
      )
        .then(function(res) {
          that.loadingShow = false;
          that.clubs = res.data;
        })
        .catch(error => {
          that.loadingShow = false;
        });
    }
  },
  methods: {
    more() {
      var that = this;
      this.page += 1;
      if (this.id == 1) {
        this.longitude = wx.getStorageSync("longitude");
        this.latitude = wx.getStorageSync("latitude");
        activitiesList({
          page: this.page,
          pagesize: 20,
          keyword: this.searchName,
          lng: this.longitude,
          lat: this.latitude,
          sort: "1,2"
        }).then(function(res) {
          for (var i = 0; i < 20; i++) {
            if (res.data[i]) {
              that.acitivities.push(res.data[i]);
              that.activity_start_at.push(
                changeTime(that.acitivities[i].activity_start_at, 16, 5)
              );
              that.activity_expire_at.push(
                changeTime(that.acitivities[i].activity_expire_at, 16, 5)
              );
            } else {
              that.pShow = true;
            }
          }
        });
      } else if (this.id == 2) {
        var longitude = wx.getStorageSync("longitude");
        var latitude = wx.getStorageSync("latitude");
        orgs({
          page: this.page,
          pagesize: 20,
          keyword: this.searchName,
          lng: longitude,
          lat: latitude,
          sort: "1,2"
        }).then(function(res) {
          for (var i = 0; i < 20; i++) {
            if (res.data[i]) {
              that.clubs.push(res.data[i]);
            } else {
              that.pShow = true;
            }
          }
        });
      }
    },
    searchFocu() {
      this.searchFocus = false;
    },
    searchBlu() {
      this.searchName == ""
        ? (this.searchFocus = true)
        : (this.searchFocus = false);
    },
    toSearch() {
      var that = this;
      this.page = 1;
      if (this.id == 1) {
        that.acitivities = [];
        this.longitude = wx.getStorageSync("longitude");
        this.latitude = wx.getStorageSync("latitude");
        activitiesList({
          page: this.page,
          pagesize: 20,
          keyword: this.searchName,
          lng: this.longitude,
          lat: this.latitude,
          sort: "1,2"
        }).then(function(res) {
          for (var i = 0; i < 20; i++) {
            if (res.data[i]) {
              that.acitivities.push(res.data[i]);
            } else {
              that.pShow = true;
            }
          }
        });
      } else if (this.id == 2) {
        that.clubs = [];
        var longitude = wx.getStorageSync("longitude");
        var latitude = wx.getStorageSync("latitude");
        orgs({
          page: this.page,
          pagesize: 20,
          keyword: this.searchName,
          lng: longitude,
          lat: latitude,
          sort: "1,2"
        }).then(function(res) {
          for (var i = 0; i < 20; i++) {
            if (res.data[i]) {
              that.clubs.push(res.data[i]);
            } else {
              that.pShow = true;
            }
          }
        });
      }
    },
    toAct(e) {
      var id = e.currentTarget.dataset.id;
      var url = "../../activity/detail/detail?act_id=";
      wx.navigateTo({
        url: url + id
      });
    },
    toClub(e) {
      var id = e.currentTarget.dataset.id;
      var url = "../../club/index?org_id=" + id;
      wx.navigateTo({
        url: url
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
.input {
  width: 670rpx;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
  margin: 66rpx 40rpx 0;
}
.in {
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  color: #ccc7b8;
  padding-left: 40rpx;
  font-size: 28rpx;
}
.searchNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
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
.club .activity-item .item_left img {
  width: 156rpx;
  height: 156rpx;
  border-radius: 20rpx;
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
.activity-item .item_right p:last-child span {
  padding: 4rpx 15rpx;
  font-size: 22rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 85, 92, 1);
  border-radius: 8rpx;
}
.activity-item .item_right p:last-child span.green {
  background: #ccb166;
}
.activity-item .item_right h1 {
  color: #ff4c5b;
  font-size: 42rpx;
  line-height: 42rpx;
}
.activity-item .item_right h1 img {
  width: 28rpx;
  height: 32rpx;
  margin-right: 16rpx;
}
.more p {
  font-size: 28rpx;
  line-height: 88rpx;
  text-align: center;
}
</style>


