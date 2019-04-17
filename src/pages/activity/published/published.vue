<template>
  <div>
    <header>
      <div class="navbar">
        <div class="loading" v-show="loadingShow">
          <loading></loading>
        </div>
        <block v-for="(item,index) in tabs" :index="index" :key="index">
          <div :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick(item.name,index)">
            <!-- <div class="navbar_title" :class="{'navbar_selectedTitle':activeIndex == index}">{{item.name}}</div> -->
            <form @submit="submit" report-submit='true'>
              <button form-type="submit" class="navbar_title" :class="{'navbar_selectedTitle':activeIndex == index}">{{item.name}}</button>
            </form>
          </div>
        </block>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
      </div>
    </header>
    <main>
      <div :hidden="activeIndex != 0">
        <go :activeIndex="activeIndex" :goInfo="goInfo" v-on:showLoading="showLoading"></go>
      </div>
      <div :hidden="activeIndex != 1">
        <review :activeIndex="activeIndex"></review>
      </div>
      <div :hidden="activeIndex != 2">
        <cancel :activeIndex="activeIndex"></cancel>
      </div>
      <div :hidden="activeIndex != 3">
        <end :activeIndex="activeIndex"></end>
      </div>
    </main>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import go from "./go/go";
import review from "./review/review";
import cancel from "./cancel/cancel";
import end from "./end/end";
import { clubActivities } from "@/utils/api";
import loading from "@/components/loading";
export default {
  data() {
    return {
      loadingShow: true,
      url: common.url,
      tabs: [
        {
          name: "进行中"
        },
        {
          name: "审核中"
        },
        {
          name: "已取消"
        },
        {
          name: "已结束"
        }
      ],
      activeIndex: 0
    };
  },
  components: {
    go,
    review,
    cancel,
    end,
    loading
  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return "navbar_slider_0";
      } else if (this.activeIndex == 1) {
        return "navbar_slider_1";
      } else if (this.activeIndex == 2) {
        return "navbar_slider_2";
      } else if (this.activeIndex == 3) {
        return "navbar_slider_3";
      }
    },
    navbarSelectedTitle() {
      if (this.activeIndex == 0) {
        return "navbar_selectedTitle";
      }
      if (this.activeIndex == 1) {
        return "navbar_selectedTitle";
      }
    }
  },
  methods: {
    showLoading() {
      setTimeout(() => {
        this.loadingShow = false;
      }, 500);
    },
    submit(e) {
      formId(e);
    },
    tabClick(tabName, index) {
      this.activeIndex = index;
      if (common.status === "dev") {
        wx.reportAnalytics("my_act_tab_click", {
          type: tabName
        });
      }
    },
    getInfo() {
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      var org_id = wx.getStorageSync("org_id");
    }
  },
  onLoad() {
    this.loadingShow = true;
    this.getInfo();
  },
  onUnload() {
    wx.reLaunch({
      url: "/pages/mine/index"
    });
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
<style>
.navbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  position: fixed;
  top: 0;
  height: 120rpx;
  width: 100%;
  border-bottom: 1rpx solid #e6e6e6;
  background: #ffffff;
  z-index: 5;
}
.navbar_item {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding: 13px 0;
  text-align: center;
  font-size: 0;
}
.navbar_title {
  background: #fff;
  color: #ccc7b8;
  font-weight: bold;
  display: inline-block;
  font-size: 34rpx;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
button::after {
  border: none;
}

.navbar_selectedTitle {
  color: #331900;
}
.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  bottom: 0;
  width: 80rpx;
  height: 6rpx;
  background-color: #ff890c;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}
.navbar_slider_0 {
  left: 53rpx;
  transform: translateX(0);
}
.navbar_slider_1 {
  left: 53rpx;
  transform: translateX(190rpx);
}
.navbar_slider_2 {
  left: 53rpx;
  transform: translateX(376rpx);
}
.navbar_slider_3 {
  left: 53rpx;
  transform: translateX(566rpx);
}

main {
  margin-top: 120rpx;
}

.item_wrap {
  padding: 0 30rpx;
}
.list-item {
  border-bottom: 1px solid #e5e5e5;
  padding: 40rpx 0;
  overflow: hidden;
}
.list-item .item_left {
  float: left;
}
.list-item .logo {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
}
.list-item .item_right {
  margin-left: 20rpx;
  float: left;
}
.list-item .item_right .title {
  font-size: 28rpx;
  width: 474rpx;
  color: #333333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.list-item .item_right .time,
.address {
  font-size: 24rpx;
  color: #999999;
  line-height: 48rpx;
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