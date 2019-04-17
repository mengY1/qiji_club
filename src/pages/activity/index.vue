<template>
  <div class="activity">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <filter v-on:statusAction="statusArr"></filter>
    <main>
      <div class="main_wrap">
        <div class="actList">
          <div class="act-item" v-for="(item,index) in actList" :key="index" @click="toDetail(item.act_id)">
            <div class="item_left">
              <img :src="url+item.cover+logoUrl">
            </div>
            <!-- 社团活动 -->
            <div class="item_right" v-if="actType===1">
              <p class="title">{{item.title}}</p>
              <p class="time">活动时间：{{activity_start_at[index]}}</p>
              <p class="address">主办社团：{{item.cms_school_name}} | {{item.org_name}}</p>
            </div>
            <!-- 竞赛活动 -->
            <div class="item_right" v-if="actType===4">
              <p class="title">{{item.title}}</p>
              <p class="time">活动时间：{{activity_start_at[index]}}</p>
              <p class="address">竞赛级别：{{item.contest_type_name}}</p>
            </div>
            <!-- 招聘活动,学术活动 -->
            <div class="item_right" v-if="actType===2||actType===3">
              <p class="title">{{item.title}}</p>
              <p class="time">活动时间：{{activity_start_at[index]}}</p>
              <p class="address">活动地点：{{item.cms_school_name}} | {{item.address}}</p>
            </div>
            <!-- 考研活动 -->
            <div class="item_right" v-if="actType===5">
              <p class="title">{{item.title}}</p>
              <p class="time">活动时间：{{activity_start_at[index]}}</p>
              <p class="address">活动地点：{{item.address}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="default" v-if="actList.length===0">
        <img :src="url+'/img/default/pageDefault.png'" alt>
        <p>暂无数据</p>
      </div>
    </main>
    <footer v-if="actList.length>0">
      <p @click="more" v-if="moreShow">查看更多内容</p>
      <p v-else>已无更多内容</p>
    </footer>
  </div>
</template>
<script scoped>
import common from "@/utils/common";
import filter from "./components/filter";
import { formId } from "@/utils/common";
import changeTime from "@/utils/changeTime";
import { activitiesList } from "@/utils/api";
import url from "@/utils/common";
import loading from "@/components/loading";
export default {
  data() {
    return {
      token: "",
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      loadingShow: true,
      actList: "",
      page: 1,
      moreShow: true,
      activity_start_at: [],
      getActStatus: ["", 0, "city"], //筛选器上选择的状态
      actType: 1, //活动的类型
      lng: "",
      lat: "",
      sort: "2,4" //排序规则
    };
  },
  components: {
    loading,
    filter
  },
  onPullDownRefresh() {
    this.loadingShow = true;
    this.page = 1;
    this.moreShow = true;
    if (this.actType === 4) {
      this.getCompetition();
    } else {
      this.getActList();
    }
    wx.stopPullDownRefresh();
  },
  // 加载更多
  onReachBottom() {
    if (this.moreShow) {
      this.moreAction();
    }
  },
  onLoad() {
    this.getActList();
    if (common.status === "dev") {
      wx.reportAnalytics("activity_enterpage", {
        act_type_select: "社团活动",
        time_range: "全部时间",
        contest_type: "",
        act_status: "全部",
        area: "同城"
      });
    }
  },
  onShow() {
    if (common.status == "dev") {
      wx.reportAnalytics("index_activity_tab_click", {});
    }
    wx.setStorageSync("act_refresh", true); //进入该页面设置缓存，若缓存存在，红点消失
    // 隐藏红点
    wx.hideTabBarRedDot({
      index: 1
    });
  },
  methods: {
    statusArr(data) {
      this.loadingShow = true;
      this.getActStatus = data[0];
      this.actType = Number(data[1]) + 1;
      if (this.actType === 4) {
        this.getCompetition();
        var [act_status, time_range, contest_type] = data[2]; //竞赛活动没有区域范围只有级别范围所以另外判断赋值请求数据
      } else {
        //除了竞赛活动以外的请求
        this.getActList();
        var [act_status, time_range, area] = data[2];
      }
      var act_type = "";
      if (this.actType === 1) {
        act_type = "社团活动";
      } else if (this.actType === 2) {
        act_type = "招聘活动";
      } else if (this.actType === 3) {
        act_type = "学术活动";
      } else if (this.actType === 4) {
        act_type = "竞赛活动";
      } else if (this.actType === 5) {
        act_type = "考验活动";
      }
      wx.reportAnalytics("activity_enterpage", {
        act_type_select: act_type, //活动类型
        time_range: time_range, //时间范围
        contest_type: contest_type ? contest_type : "", //活动级别
        act_status: act_status, //活动状态
        area: area ? area : "" //区域范围
      });
    },
    getActList() {
      this.page = 1;
      this.moreShow = true;
      this.actList = [];
      this.activity_start_at = [];
      if (
        typeof this.getActStatus[2] === "number" &&
        this.getActStatus[2] > 0
      ) {
        this.getActStatus[2] = wx.getStorageSync("user_school_id");
        this.lng = "";
        this.lat = "";
        this.sort = "2,4";
      }
      if (this.getActStatus[2] === "school") {
        this.getActStatus[2] = wx.getStorageSync("user_school_id");
        this.lng = "";
        this.lat = "";
        this.sort = "2,4";
      }
      if (this.getActStatus[2] === "all") {
        this.getActStatus[2] = 0;
        this.lng = "";
        this.lat = "";
        this.sort = "2,4";
      }
      if (this.getActStatus[2] === "city") {
        this.getActStatus[2] = "";
        this.sort = "1,2,4";
        this.lng = wx.getStorageSync("longitude");
        this.lat = wx.getStorageSync("latitude");
      }
      activitiesList(
        {
          status: this.getActStatus[0],
          cms_school_id: this.getActStatus[2],
          lat: this.lat,
          lng: this.lng,
          time_type: this.getActStatus[1],
          sort: this.sort,
          act_type: this.actType
        },
        "",
        true
      )
        .then(res => {
          this.actList = res.data;
          for (var i = 0; i < this.actList.length; i++) {
            this.activity_start_at.push(
              changeTime(this.actList[i].activity_start_at, 16)
            );
          }
          this.loadingShow = false;
          if (!res.data[5]) {
            this.moreShow = false;
          }
        })
        .catch(err => {
          this.loadingShow = false;
        });
    },
    getCompetition() {
      this.page = 1;
      this.moreShow = true;
      this.actList = [];
      this.activity_start_at = [];
      activitiesList(
        {
          status: this.getActStatus[0],
          time_type: this.getActStatus[1],
          sort: "1,2,4",
          act_type: this.actType,
          contest_type: this.getActStatus[2]
        },
        "",
        true
      )
        .then(res => {
          this.actList = res.data;
          for (var i = 0; i < this.actList.length; i++) {
            this.activity_start_at.push(
              changeTime(this.actList[i].activity_start_at, 16)
            );
          }
          this.loadingShow = false;
          if (!res.data[5]) {
            this.moreShow = false;
          }
        })
        .catch(err => {
          this.loadingShow = false;
        });
    },
    moreAction() {
      if (this.moreShow) {
        this.page += 1;
        if (
          this.actType === 1 ||
          this.actType === 2 ||
          this.actType === 3 ||
          this.actType === 5
        ) {
          this.actMore();
        } else if (this.actType === 4) {
          this.compActMore();
        }
      }
    },
    actMore() {
      activitiesList({
        page: this.page,
        status: this.getActStatus[0],
        cms_school_id: this.getActStatus[2],
        lat: this.lat,
        lng: this.lng,
        time_type: this.getActStatus[1],
        act_type: this.actType,
        sort: this.sort
      }).then(res => {
        for (var i = 0; i < 6; i++) {
          if (res.data[i]) {
            this.actList.push(res.data[i]);
            this.activity_start_at.push(
              changeTime(res.data[i].activity_start_at, 16)
            );
          } else {
            this.moreShow = false;
          }
        }
      });
    },
    compActMore() {
      activitiesList({
        page: this.page,
        status: this.getActStatus[0],
        time_type: this.getActStatus[1],
        sort: "1,2,4",
        act_type: this.actType,
        contest_type: this.getActStatus[2]
      }).then(res => {
        for (var i = 0; i < 6; i++) {
          if (res.data[i]) {
            this.actList.push(res.data[i]);
            this.activity_start_at.push(
              changeTime(res.data[i].activity_start_at, 16)
            );
          } else {
            this.moreShow = false;
          }
        }
      });
    },
    toDetail(id) {
      if (this.actType === 1) {
        var url = "./detail/detail?act_id=" + id;
        wx.navigateTo({
          url
        });
      } else if (this.actType === 2) {
        wx.navigateTo({
          url:
            "/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=" +
            id
        });
      } else if (this.actType === 3) {
        wx.navigateTo({
          url: "/packageA/activity/academicEvents/academicDetails?act_id=" + id
        });
      } else if (this.actType === 4) {
        wx.navigateTo({
          url:
            "/packageA/activity/competitionActivity/competitionDetails?act_id=" +
            id
        });
      } else if (this.actType === 5) {
        wx.navigateTo({
          url: "/packageA/activity/graduate/graduate?act_id=" + id
        });
      }
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: "校园生活很无趣?社团活动上奇集!",
      path: "/pages/activity/index",
      imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
main {
  margin-top: 186rpx;
}
.main_wrap {
  padding: 0 30rpx;
}
.act-item {
  overflow: hidden;
  padding: 34rpx 0;
  border-bottom: 1px solid #e6e6e6;
}
.act-item .item_left {
  margin-top: 4rpx;
  float: left;
  overflow: hidden;
}

.act-item .item_left img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
}
.act-item .item_right {
  width: 474rpx;
  margin-left: 20rpx;
  float: left;
}
.act-item .item_right .title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 28rpx;
  color: #333333;
}
.act-item .item_right .time {
  font-size: 24rpx;
  color: #999999;
  margin-top: 6rpx;
}
.act-item .item_right .address {
  font-size: 24rpx;
  color: #999999;
  margin-top: 10rpx;
  line-height: 34rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
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
.default {
  text-align: center;
  margin-top: 280rpx;
}
.default img {
  width: 300rpx;
  height: 300rpx;
}
.default p {
  font-size: 26rpx;
  color: #999999;
  margin-top: 10rpx;
}
</style>

