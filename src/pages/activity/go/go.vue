<template>
  <!-- 已对好的接口 -->
  <div class="go">
    <!-- <scroll-view @scrolltolower="more" scroll-y="true" style="height:1230rpx"> -->
    <div class="go-item" v-for="(item,index) in main" :key="index" @click="toDetail(item.act_id)" :data-id="item.act_id">
      <img :src="url+item.cover+otherUrl">
      <div class="itemText">
        <p>{{item.title}}</p>
        <span>{{item.cms_school_name}} | {{item.org_name}}</span>
        <p> {{activity_start_at[index]}}--{{activity_expire_at[index]}}</p>
      </div>
      <div class="itemBottom">
        <img class="logo" :src="url+item.org_logo+logoUrl">
        <text>{{item.org_name}}</text>
        <span>{{item.members}}人已参加</span>
      </div>
    </div>
    <footer v-if="main.length>0">
      <p @click='more' v-if="moreShow">查看更多内容</p>
      <p v-else>已无更多内容</p>
    </footer>
    <!-- </scroll-view> -->

  </div>
</template>
<script>
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import otherUrl from "@/utils/common";
import changeTime from "@/utils/changeTime";
import { activitiesList } from "@/utils/api";
export default {
  data() {
    return {
      main: [],
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      activity_start_at: [],
      activity_expire_at: [],
      infoArr: [],
      page: 1,
      token: " ",
      moreShow: true,
      cms_school_id: "",
      longitude: "",
      latitude: ""
    };
  },
  props: ["activeIndex", "refreshStatus"],
  watch: {
    refreshStatus(n, o) {
      if (n == 20) {
        this.getInfo();
      }
    }
  },
  onReachBottom() {
    if (this.activeIndex == 0) {
      this.more();
    }
  },
  methods: {
    toDetail(id) {
      var url = "./detail/detail?act_id=" + id;
      wx.navigateTo({
        url
      });
    },
    getInfo() {
      var that = this;
      that.token = " ";
      that.token += wx.getStorageSync("silentlogin").token;
      this.longitude = wx.getStorageSync("longitude");
      this.latitude = wx.getStorageSync("latitude");
      activitiesList(
        { status: 20, lng: this.longitude, lat: this.latitude, sort: "1,3" },
        that.token,
        true
      )
        .then(res => {
          this.$emit("goLoading");
          this.$emit("refreshAction")
          this.main = res.data;
          for (var i = 0; i < this.main.length; i++) {
            if (this.main[i].status == 20) {
              this.activity_start_at.push(
                changeTime(this.main[i].activity_start_at, 16)
              );
              this.activity_expire_at.push(
                changeTime(this.main[i].activity_expire_at, 16)
              );
            }
          }
        })
        .catch(err => {
          this.$emit("goLoading");
        });
    },
    more() {
      if (this.moreShow) {
        this.page += 1;
        var that = this;
        that.token = " ";
        that.token += wx.getStorageSync("silentlogin").token;
        activitiesList(
          {
            page: this.page,
            status: 20,
            lng: this.longitude,
            lat: this.latitude,
            sort: "1,3"
          },
          that.token
        ).then(function(res) {
          for (var i = 0; i < 6; i++) {
            if (res.data[i]) {
              that.main.push(res.data[i]);
              that.activity_start_at.push(
                changeTime(res.data[i].activity_start_at, 16)
              );
              that.activity_expire_at.push(
                changeTime(res.data[i].activity_expire_at, 16)
              );
            } else {
              that.moreShow = false;
            }
          }
        });
      }
    }
  },
  onLoad() {
    this.getInfo();
  },
  onShow() {
    // this.page = 1;
    // this.moreShow = true;
    // this.longitude = wx.getStorageSync("longitude");
    // this.latitude = wx.getStorageSync("latitude");
    // activitiesList(
    //   { status: 20, lng: this.longitude, lat: this.latitude, sort: "1,3" },
    //   this.token,
    //   true
    // )
    //   .then(res => {
    //     this.$emit("goLoading");
    //     this.main = [];
    //     this.main = res.data;
    //     for (var i = 0; i < this.main.length; i++) {
    //       if (this.main[i].status == 20) {
    //         this.activity_start_at.push(
    //           changeTime(this.main[i].activity_start_at, 16)
    //         );
    //         this.activity_expire_at.push(
    //           changeTime(this.main[i].activity_expire_at, 16)
    //         );
    //       }
    //     }
    //   })
    //   .catch(err => {
    //     this.$emit("goLoading");
    //   });
  }
};
</script>
<style scoped>
.go-item {
  padding: 40rpx;
  border-bottom: 1px solid #e5e5e5;
}
.go-item img {
  width: 670rpx;
  height: 376rpx;
  border-radius: 20rpx;
}
.go-item .itemText {
  text-align: left;
}
.go-item .itemText span {
  font-size: 22rpx;
  color: #99958a;
}
.go-item .itemText p {
  font-size: 22rpx;
  color: #99958a;
}
.go-item .itemText p:first-child {
  font-size: 34rpx;
  width: 601rpx;
  color: #331900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 22rpx;
}
.go-item .itemText p:nth-child(2) {
  padding-top: 12rpx;
}
.itemBottom {
  margin-top: 16rpx;
}
.itemBottom .logo {
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  /* vertical-align: middle; */
}
.itemBottom text {
  font-size: 26rpx;
  color: #331900;
  margin-left: 20rpx;
  display: inline-block;
  width: 300rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.itemBottom span {
  float: right;
  font-size: 22rpx;
  color: #99958a;
  margin-top: 12rpx;
}

footer p {
  display: block;
  width: 670rpx;
  margin: 0 auto;
  border-top: 1px solid #e6e6e6;
  text-align: center;
  line-height: 100rpx;
  font-size: 26rpx;
  color: #99958a;
}
</style>
