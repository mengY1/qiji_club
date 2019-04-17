<template>
  <div class="all">

    <block>
      <!-- 奇集社团介绍弹窗 -->
      <introtips v-if="introtipsShow"></introtips>
    </block>

    <header>
      <div class="navbar">
        <div class="loading" v-show="loadingShow">
          <loading></loading>
        </div>
        <block v-for="(item,index) in tabs" :index="index" :key="index">
          <div :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick">
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
        <school v-on:showLoading="showLoadingAction" :getSchoolInfo="activeIndex" :updateIndex="updateIndex"></school>
      </div>
      <div :hidden="activeIndex != 1">
        <city v-on:showLoading="showLoadingAction" :getCityInfo="activeIndex" :updateIndex="updateIndex"></city>
      </div>
      <div :hidden="activeIndex != 2">
        <country v-on:showLoading="showLoadingAction" :getCountryInfo="activeIndex" :updateIndex="updateIndex"></country>
      </div>
    </main>
  </div>
</template>
<script>
import common from "@/utils/common";
import { toSharePage } from "@/utils/toSharePage";
import { formId } from "@/utils/common";
import school from "./school/school";
import city from "./city/city";
import country from "./country/country";
import { silentlogin, userInfo } from "@/utils/api";
import loading from "@/components/loading";
import introtips from "@/components/tips/introduceTips";
export default {
  data() {
    return {
      options: "",
      url: common.url,
      loadingShow: true,
      tabs: [
        {
          name: "本校"
        },
        {
          name: "同城"
        },
        {
          name: "全国"
        }
      ],
      activeIndex: 0,
      updateIndex: "", //刷新的tab
      introtipsShow: false
    };
  },
  components: {
    school,
    city,
    country,
    loading,
    introtips
  },
  onPullDownRefresh() {
    this.loadingShow = true;
    this.page = 1;
    this.moreShow = true;
    this.activeIndex = this.activeIndex;
    this.updateIndex = this.activeIndex;
    wx.stopPullDownRefresh();
    // 传值到子组件后初始化数据
    setTimeout(() => {
      this.updateIndex = "莫得了";
    }, 100);
  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return "navbar_slider_0";
      }
      if (this.activeIndex == 1) {
        return "navbar_slider_1";
      }
      if (this.activeIndex == 2) {
        return "navbar_slider_2";
      }
    },
    navbarSelectedTitle() {
      if (this.activeIndex == 0) {
        return "navbar_selectedTitle";
      }
      if (this.activeIndex == 1) {
        return "navbar_selectedTitle";
      }
      if (this.activeIndex == 2) {
        return "navbar_selectedTitle";
      }
    }
  },
  onLoad(options) {
    this.loadingShow = true;
    this.options = options;
    if (common.status == "dev") {
      wx.reportAnalytics("org_index_school_click", {});
    }
  },
  onShow() {
    this.getSilentloginInfo();
  },
  methods: {
    // 调用静默登录接口判断用户是否已注册手机号，刷新token缓存
    getSilentloginInfo() {
      if (wx.getStorageSync("silentlogin")) {
        // 已授权用户调用静默接口
        wx.login({
          success: res => {
            var code = res.code;
            wx.getUserInfo({
              lang: "zh_CN",
              success: res => {
                silentlogin(
                  {
                    code: code,
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  },
                  true
                ).then(res => {
                  this.introtipsShow = true;
                  if (JSON.stringify(this.options) != "{}") {
                    // 判断有options参数，先跳去指定的分享页面或者扫码进来的页面
                    toSharePage(this.options);
                    setTimeout(() => {
                      // 清空options，分享到指定页面返回到该页面的时候能执行onShow里的静默请求
                      this.options = {};
                    }, 100);
                  } else {
                    // 没有options参数，走完善信息或者创建社团的流程
                    this.toComplete(res);
                  }
                });
              }
            });
          }
        });
      } else {
        // 如果有options参数，未授权用户，先去分享的指定页面
        toSharePage(this.options);
        setTimeout(() => {
          // 清空options，分享到指定页面返回到该页面的时候能执行onShow里的静默请求
          this.options = {};
        }, 100);
      }
    },
    // 通过user接口判断用户是否需要完善信息或者创建社团
    toComplete(res) {
      if (res.auth) {
        var msg = wx.getStorageSync("silentlogin");
        msg.token = res.auth.access_token;
        msg.refresh_token = res.auth.refresh_token;
        wx.setStorageSync("silentlogin", msg);
        userInfo("", "", true).then(res => {
          if (res.is_full === 0) {
            // 未完善信息
            wx.reLaunch({
              url: "/pages/login/register/index"
            });
          } else if (!res.orgs && !res.last_org_claim) {
            //未创建社团(已完善信息)
            wx.reLaunch({
              url: "/pages/mine/buildClub/index?complete=1"
            });
          }
        });
      } else {
        // 没有token跳转去完善信息步骤
        wx.reLaunch({
          url: "/pages/login/register/index"
        });
      }
    },
    showLoadingAction() {
      this.loadingShow = false;
    },
    tabClick(e) {
      this.activeIndex = e.currentTarget.id;
      this.loadingShow = true;
      if (common.status == "dev") {
        if (this.activeIndex == 2) {
          wx.reportAnalytics("org_index_country_click", {});
        } else if (this.activeIndex == 0) {
          wx.reportAnalytics("org_index_school_click", {});
        }
      }
    },
    submit(e) {
      formId(e);
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: "校园生活很无趣?社团活动上奇集!",
      path: "/pages/club/all/all",
      imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
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
  border: 0rpx solid;
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
  left: 86rpx;
  transform: translateX(0);
}
.navbar_slider_1 {
  left: 86rpx;
  transform: translateX(250rpx);
}
.navbar_slider_2 {
  left: 86rpx;
  transform: translateX(500rpx);
}
main {
  margin-top: 120rpx;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
