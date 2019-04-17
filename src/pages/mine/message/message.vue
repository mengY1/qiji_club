<template>
  <div>
    <header>
      <div class="navbar">
        <div class="loading" v-show="loadingShow">
          <loading></loading>
        </div>
        <block v-for="(item,index) in tabs" :index="index" :key="index">
          <div :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick">
            <div class="navbar_title" :class="{'navbar_selectedTitle':activeIndex == index}">{{item.name}}</div>
          </div>
        </block>
        <span class="span1" v-if="isShow"></span>
        <span class="span2" v-if="isShow2"></span>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
      </div>
    </header>
    <main>
      <div :hidden="activeIndex != 0">
        <trends :trendsMsg="trendsMsg"></trends>
      </div>
      <div :hidden="activeIndex != 1">
        <system :systemMsg="systemMsg"></system>
      </div>
    </main>
  </div>
</template>
<script>
import url from "@/utils/common";
import trends from "./trends/trends";
import system from "./system/system";
import { yidu, userInfo } from "@/utils/api";
import loading from "@/components/loading";
export default {
  data() {
    return {
      url: url.url,
      loadingShow: true,
      tabs: [
        {
          name: "动态消息",
          type: "1",
          checked: true
        },
        {
          name: "系统消息",
          type: "2",
          checked: true
        }
      ],
      activeIndex: 0,
      trendsMsg: [],
      systemMsg: [],
      isShow: false,
      isShow2: false
    };
  },
  components: {
    trends,
    system,
    loading
  },
  onShow() {
    this.loadingShow = true;
    this.activeIndex = 0;
    var token = " ";
    if (wx.getStorageSync("token")) {
      token += wx.getStorageSync("token");
    } else {
      token += wx.getStorageSync("silentlogin").token;
    }
    userInfo({}, token, true)
      .then(res => {
        setTimeout(() => {
          this.loadingShow = false;
        }, 500);
        console.log(res);
        console.log(res.unread_messages_count);
        console.log(res.unread_notifications_count);
        if (res.unread_messages_count != 0) {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
        if (res.unread_notifications_count != 0) {
          this.isShow2 = true;
        } else {
          this.isShow2 = false;
        }
      })
      .catch(err => {
        setTimeout(() => {
          this.loadingShow = false;
        }, 500);
      });
  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return "navbar_slider_0";
      }
      if (this.activeIndex == 1) {
        return "navbar_slider_1";
      }
    },
    navbarSelectedTitle() {
      if (this.activeIndex == 0) {
        return "navbar_selectedTitle";
      }
      if (this.activeIndex == 1) {
        this.putMsg();
        return "navbar_selectedTitle";
      }
    }
  },
  methods: {
    tabClick(e) {
      this.activeIndex = e.currentTarget.id;
      if (this.activeIndex == 0) {
        this.isShow = false;
      }
      if (this.activeIndex == 1) {
        this.isShow2 = false;
      }
    },
    putMsg(e) {
      // var index = e.currentTarget.dataset.index;
      let data = {
        is_total: 1
      };
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      yidu(data, token, true);
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
<style>
.navbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  position: fixed;
  top: 0;
  height: 120rpx;
  width: 100%;
  background: #ffffff;
}
.navbar .span1 {
  width: 20rpx;
  height: 20rpx;
  display: block;
  border-radius: 50%;
  background: red;
  position: absolute;
  top: 42rpx;
  left: 37%;
}
.navbar .span2 {
  width: 20rpx;
  height: 20rpx;
  display: block;
  border-radius: 50%;
  background: red;
  position: absolute;
  top: 42rpx;
  right: 10%;
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
  left: 147rpx;
  transform: translateX(0);
}
.navbar_slider_1 {
  left: 147rpx;
  transform: translateX(378rpx);
}
main {
  margin-top: 160rpx;
}
</style>

