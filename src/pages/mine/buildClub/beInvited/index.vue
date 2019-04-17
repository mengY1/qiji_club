<template>
  <!-- 被邀请认领 -->
  <div>
    <header>
      <div class="header_bg" :style="{backgroundImage: 'url(' + coverImgUrl + ')', backgroundSize:'100% 100%'}">
        <div class="userInfo">
          <div class="avatar">
            <img :src="url+avatar" v-if="avatar">
          </div>
          <div class="content">
            <p class="userName">{{userName}}</p>
            <p>邀请你认领</p>
            <p class="clubName">{{clubInfo.name}}</p>
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="main_wrap">
        <div class="info_top">
          <img class="logo" :src="url+clubInfo.logo" alt="">
          <div class="title">
            <p>{{clubInfo.name}}</p>
            <p>{{clubInfo.cms_school_name}}</p>
          </div>
        </div>
        <div class="info_main">
          <div class="main-item">
            <span class="item_title">社团口号：</span>
            <span class="item_main">{{clubInfo.summary}}</span>
          </div>
          <div class="main-item">
            <span class="item_title">社团公众号：</span>
            <span class="item_main">{{clubInfo.official_accounts}}</span>
          </div>
          <div class="main-item">
            <span class="item_title">社团社长：</span>
            <span class="item_main">{{clubInfo.chief_nickname?clubInfo.chief_nickname:""}}</span>
          </div>
          <div class="intro">
            <h1>社团简介：</h1>
            <p>
              {{clubInfo.introduction}}
            </p>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="toClaim">
        <button @click="toClaimAction">去认领</button>
      </div>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { clubDetails, userInfo, check, silentlogin } from "@/utils/api";
export default {
  data() {
    return {
      url: common.url,
      coverImgUrl: common.url + "/img/orgapp/1.0.0/mine/nobody.png",
      avatar: "",
      userName: "",
      org_id: "",
      clubInfo: "",
      nickName:""
    };
  },
  onLoad(options) {
    this.avatar = options.avatar;
    this.userName = options.userName;
    this.org_id = options.org_id;
    this.getClubInfo();
  },
  methods: {
    getClubInfo() {
      clubDetails(this.org_id).then(res => {
        this.clubInfo = res;
      });
    },
    toClaimAction() {
      this.getUserInfo();
    },
    // 判断用户是否已完善信息
    getUserInfo() {
      if (wx.getStorageSync("silentlogin").token) {
        userInfo().then(res => {
          if (res.is_full != 1) {
            // 去完善信息
            wx.navigateTo({
              url:
                "/pages/login/register/index?org_id=" +
                this.org_id +
                "&userName=" +
                this.userName +
                "&avatar=" +
                this.avatar
            });
          } else {
            check({ org_id: this.org_id }).then(res => {
              wx.navigateTo({
                url:
                  "/pages/mine/buildClub/clubInfo/buildStep1?status=woyao&type=" +
                  this.clubInfo.org_type +
                  "&org_id=" +
                  this.org_id
              });
            });
          }
        });
      } else {
        wx.navigateTo({
          url:
            "/pages/login/register/index?org_id=" +
            this.org_id +
            "&userName=" +
            this.userName +
            "&avatar=" +
            this.avatar
        });
      }
    }
  }
};
</script>
<style>
.header_bg {
  width: 100%;
  height: 360rpx;
  overflow: hidden;
}
.userInfo .avatar {
  width: 88rpx;
  height: 88rpx;
  margin-top: 110rpx;
  margin-left: 40rpx;
  float: left;
}
.userInfo .avatar img {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
}
.userInfo .content {
  float: left;
  margin-top: 106rpx;
  margin-left: 20rpx;
  font-size: 28rpx;
  line-height: 48rpx;
}
.userInfo .content .userName {
  font-weight: bold;
}
.userInfo .content .clubName {
  width: 366rpx;
}

.main_wrap {
  padding: 0 40rpx;
}
.info_top {
  height: 128rpx;
}
.info_top .logo {
  width: 128rpx;
  height: 128rpx;
  border-radius: 50%;
  float: left;
}
.info_top .title {
  color: #333333;
  margin-left: 20rpx;
  float: left;
  margin-top: 18rpx;
}
.info_top .title p:first-child {
  font-size: 32rpx;
  font-weight: bold;
}
.info_top .title p:nth-child(2) {
  margin-top: 8rpx;
  font-size: 28rpx;
}
.info_main {
  margin-top: 52rpx;
  padding-bottom: 150rpx;
}
.info_main .main-item {
  font-size: 28rpx;
  color: #333333;
  line-height: 42rpx;
}
.info_main .intro {
  font-size: 28rpx;
  color: #333333;
  margin-top: 44rpx;
  line-height: 42rpx;
}
.info_main h1 {
  font-weight: bold;
}

.toClaim {
  position: fixed;
  bottom: 0rpx;
  width: 100%;
  height: 150rpx;
  background: #fff;
}
.toClaim button {
  width: 670rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #ffb90c;
  border-radius: 8rpx;
  color: #331900;
  font-size: 30rpx;
}
.toClaim button:after {
  border: 0;
}
</style>

