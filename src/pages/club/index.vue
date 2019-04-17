<template>
  <div class="club">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>

    <!-- 认领时候的提示框 -->
    <div class="showModal_wrap" v-show="modalShow">
      <div class="showModal">
        <img :src="url+'/img/home/pop_guanbi@2x.png'" class="closeIcon" @click="close">
        <div class="content">
          <p>{{msg}}</p>
        </div>
        <div class="btn">
          <p @click="iKnow">{{btnMsg}}</p>
        </div>
      </div>
    </div>

    <header>
      <div class="header_wrap">
        <div class="logo">
          <img v-if="logo" :src="url+logo+logoUrl" @click="toPreview(logo)">
          <img v-else :src="url+'/img/default/org_logo.jpg'">
        </div>
        <p class="clubTitle">{{name}}</p>
        <p class="school">{{cms_school_name}}</p>
      </div>
    </header>

    <main>
      <div class="tab">
        <div class="tab_item" @click="tabIndexSelect(0)">
          <span :class="{'navbar_selectedTitle':activeIndex === 0}">社团详情</span>
        </div>
        <div class="tab_item" @click="tabIndexSelect(1)">
          <span :class="{'navbar_selectedTitle':activeIndex === 1}">社团活动({{contain.length}})</span>
        </div>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
      </div>

      <div class="clubDetail" v-show="activeIndex===0">
        <div class="club-item">
          <div class="baseInfo">
            <p>社团口号:{{summary?summary:"未填写"}}</p>
            <p>社团公众号:{{official_accounts?official_accounts:'未填写'}}</p>
            <p v-if="org_status===20">社长:{{realname}}</p>
            <p v-if="org_status===30">社长：暂无</p>
            <p>社团联系方式：{{phone}}</p>
          </div>
        </div>
        <div class="club-item">
          <div class="title">
            <span>社团简介</span>
            <span class="underline"></span>
          </div>
          <div class="contain">
            <p v-if="introduction">{{introduction}}</p>
            <p v-else>这位社长很懒什么都没有留下</p>
          </div>
        </div>
        <div class="club-item">
          <div class="title">
            <span>社团照片</span>
            <span class="underline"></span>
          </div>
          <div class="contain">
            <div class="photos" v-if="photos.length>0">
              <img v-for="(item,index) in photos" :key="index" :src="url+item+logoUrl" @click="toPreview(0,index)">
            </div>
            <div v-else class="default">
              <img :src="url+'/img/default/pageDefault.png'">
              <p>暂无照片</p>
            </div>
          </div>
        </div>
      </div>
      <div class="clubAct" v-if="activeIndex===1">
        <div class="act-item" v-for="(item,index) in contain" :key="index" @click="toDetail(item.act_id)">
          <div class="item_left">
            <img :src="url+item.cover+otherUrl" alt="">
          </div>
          <div class="item_right">
            <div class="title">
              <p>{{item.title}}</p>
            </div>
            <p class="time">
              {{item.activity_start_at}}
            </p>
            <div class="address">
              <p>{{item.cms_school_name}} | {{name}}</p>
            </div>
          </div>
        </div>
        <div v-if="contain.length===0" class="default">
          <img :src="url+'/img/default/pageDefault.png'" alt="">
          <p>暂无活动</p>
        </div>
        <div class="more" v-if="contain!=''" @click='more'>
          <a href="##" v-if="moreShow">查看更多活动</a>
          <a href="##" v-else>已无更多活动</a>
        </div>
      </div>
    </main>

    <sharePicker :pickerShow="pickerShow" v-on:childByValue="childByValue"></sharePicker>
    <footer>
      <div v-if="is_chief==1" style="height:148rpx">
        <div class="bottomFixed">
          <div class="item_left" @click="toRemove">
            <text href="##">移交新社长</text>
          </div>
          <div class="item_right attention" @click="toChange">
            <text>修改资料</text>
          </div>
        </div>
      </div>
      <div v-else-if="org_status==30||org_status==10" style="height:148rpx">
        <div class="bottomFixed" v-if="org_status==30">
          <form @submit="inviteAction" report-submit="true">
            <button style="width:316rpx;height:88rpx;background:#ffb90c;margin-left:0rpx" open-type="share" form-type="submit">邀请好友来认领</button>
          </form>
          <form @submit="toBuildClub" report-submit="true">
            <button style="width:316rpx;height:88rpx;background:#f5f5f5" form-type="submit">我要认领</button>
          </form>
        </div>
        <div class="bottomFixed" v-else-if="org_status==10">
          <i>社团已被认领，正在审核中</i>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import changeTime from "@/utils/changeTime";
import sharePicker from "./sharePicker";
import loading from "@/components/loading";
import {
  clubDetails,
  members,
  pv,
  cancel,
  clubActivities,
  userInfo,
  chaif_replaces,
  check
} from "@/utils/api";
export default {
  onLoad(options) {
    this.loadingShow = true;
    this.moreShow = true;
    this.activeIndex = 0;
    this.org_id = options.org_id;
    var token = " ";
    token += wx.getStorageSync("silentlogin").token;
    this.token = token;
    if (options.channel) {
      this.channel = options.channel;
    }
    // this.audit_status = wx.getStorageSync("audit_status");
  },
  onShow() {
    this.loadingShow = true;
    this.getInfo();
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
        return "navbar_selectedTitle";
      }
    }
  },
  data() {
    return {
      modalShow: false, //点击成为社长按钮的提示框
      loadingShow: true,
      activeIndex: 0,
      url: common.url,
      logoUrl: common.logoUrl,
      otherUrl: common.otherUrl,
      attentionShow: "",
      org_id: "",
      cms_school_name: "",
      introduction: "",
      is_chief: "",
      logo: "",
      name: "",
      official_accounts: "",
      org_follow_id: "",
      org_id: "",
      org_status: "",
      follows: "",
      org_status_name: "",
      photos: [],
      popularity: "",
      summary: "",
      token: "",
      realname: "",
      avatar: "",
      membersData: "",
      banner: "",
      contain: "",
      pickerShow: false,
      type: "",
      page: 1,
      moreShow: true,
      orgs: "",
      phone: "",
      msg: "",
      btnMsg: "我知道了",
      audit_status: "",
      cms_school_id: "", //这个社团所属的学校id
      user_school_id: "",
      is_full: "", //是否完善信息
      channel: "list" //进入页面的渠道
    };
  },
  mounted() {},
  components: {
    sharePicker,
    loading
  },
  methods: {
    async getInfo() {
      var org_id = this.org_id; //获取org_id
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      this.token = token;
      let contain = await clubDetails(org_id, {}, token, true);
      this.cms_school_id = contain.cms_school_id;
      this.cms_school_name = contain.cms_school_name;
      this.follows = contain.follows;
      this.introduction = contain.introduction;
      this.is_chief = contain.is_chief;
      this.logo = contain.logo;
      this.name = contain.name;
      this.phone = contain.phone;
      this.official_accounts = contain.official_accounts;
      this.org_follow_id = contain.org_follow_id;
      // this.org_id = contain.org_id;
      this.org_status = contain.org_status;
      this.org_status_name = contain.org_status_name;
      this.photos = contain.photos;
      this.popularity = contain.popularity;
      this.summary = contain.summary;
      this.type = contain.org_type;
      let membersData = await members(this.org_id, {}, "", true);
      this.membersData = membersData.data;
      if (this.is_chief === 1) {
        wx.setNavigationBarTitle({
          title: "我的社团"
        });
      }
      if (common.status == "dev") {
        wx.reportAnalytics("orgs_show_enterpage", {
          org_id: this.org_id,
          org_name: this.name,
          channel: this.channel
        });
      }
      if (this.membersData.length == 0) {
        this.realname = "";
        this.avatar = "";
      } else {
        this.realname = membersData.data[0].realname;
        this.avatar = membersData.data[0].avatar;
      }
      userInfo({}, this.token, true).then(res => {
        this.orgs = res.orgs;
        this.is_full = res.is_full;
        if (res.last_org_claim) {
          this.audit_status = res.last_org_claim.audit_status;
        }
        if (this.orgs) {
          this.orgs = res.orgs;
          this.msg = "你的社团已创建成功，无法继续认领";
          if (this.audit_status == 10) {
            this.msg = "你的社团正在审核中，暂时无法认领";
          }
          if (this.audit_status == 30) {
            this.msg = "认领社团";
          }
        }
        this.user_school_id = res.cms_school_id;
      });
      if (this.audit_status == 20 || this.audit_status == 50) {
        pv(org_id, {}, token, true);
      }
      let activities = await clubActivities(
        this.org_id,
        { status: "20,50" },
        token,
        true
      );
      setTimeout(() => {
        this.loadingShow = false;
      }, 500);
      this.contain = activities.data;
      for (var i = 0; i < activities.data.length; i++) {
        this.contain[i].activity_start_at = changeTime(
          this.contain[i].activity_start_at,
          16
        );
        this.contain[i].activity_expire_at = changeTime(
          this.contain[i].activity_expire_at,
          16
        );
      }
    },
    tabIndexSelect(index) {
      this.activeIndex = index;
      if (common.status === "dev") {
        wx.reportAnalytics("org_show_tab_click", {
          tab_switch: this.activeIndex === 1 ? "社团活动" : "社团详情",
          org_name: this.name
        });
      }
    },
    close() {
      this.modalShow = false;
    },
    toPreview(img, index) {
      if (img) {
        wx.previewImage({
          urls: [this.url + img]
        });
      } else {
        var photos = [];
        for (var i of this.photos) {
          i = this.url + i;
          photos.push(i);
        }
        wx.previewImage({
          current: photos[index],
          urls: photos
        });
      }
    },
    iKnow() {
      if (this.btnMsg == "去完善") {
        this.modalShow = false;
        wx.navigateTo({
          url: "/pages/login/choose"
        });
      } else {
        this.modalShow = false;
      }
    },
    more() {
      this.page += 1;
      var that = this;
      if (this.moreShow) {
        clubActivities(
          this.org_id,
          { status: "20,50", page: this.page },
          this.token
        ).then(function(res) {
          for (var i = 0; i < 8; i++) {
            if (res.data[i]) {
              that.contain.push(res.data[i]);
            } else {
              that.moreShow = false;
            }
          }
        });
      }
    },
    cancelAction(e) {
      formId(e);
      cancel(this.org_id, this.org_follow_id, {}, this.token).then(function(
        res
      ) {
        wx.showToast({
          title: "取消关注成功"
        });
      });
      this.org_follow_id = 0;
      this.attentionShow = false;
    },
    toBuildClub(e) {
      formId(e);
      if (common.status == "dev") {
        wx.reportAnalytics("org_show_action", {
          org_id: this.org_id,
          org_name: this.name,
          action: "我要认领"
        });
      }
      if (!wx.getStorageSync("silentlogin").token || this.is_full == 0) {
        this.modalShow = true;
        this.msg = "还未完善信息";
        this.btnMsg = "去完善";
      } else if (this.orgs) {
        this.modalShow = true;
        this.msg = "你已经有社团了,不能重复申请创建";
        this.btnMsg = "我知道了";
      } else if (this.audit_status == 10) {
        this.modalShow = true;
        this.msg = "你的社团正在审核中，暂时无法申请成为该社团社长";
        this.btnMsg = "我知道了";
      } else if (this.org_status == 30) {
        if (this.cms_school_id == this.user_school_id) {
          check({ org_id: this.org_id }, this.token).then(res => {
            var url =
              "../mine/buildClub/clubInfo/buildStep1?status=woyao&type=" +
              this.type +
              "&org_id=" +
              this.org_id;
            wx.navigateTo({
              url: url
            });
          });
        } else {
          this.modalShow = true;
          this.msg = "不是本校学生,无法申请成为该社团社长";
          this.btnMsg = "我知道了";
        }
      }
    },
    inviteAction(e) {
      formId(e);
      if (common.status == "dev") {
        wx.reportAnalytics("org_show_action", {
          org_id: this.org_id,
          org_name: this.name,
          action: "邀请好友来认领"
        });
      }
    },
    toDetail(id) {
      var url = "../activity/detail/detail?act_id=" + id;
      wx.navigateTo({
        url
      });
    },
    toPublish() {
      wx.navigateTo({
        url: "../mine/publish/publish"
      });
    },
    toChange() {
      var url =
        "../mine/buildClub/clubInfo/clubInfo?status=" +
        "xiugai&type=" +
        this.type;
      wx.navigateTo({
        url: url
      });
    },
    toRemove() {
      // wx.showToast({
      //   title: "功能开发中"
      // });
      wx.navigateTo({
        url: "/pages/club/remove/index?org_id=" + this.org_id
      });
    },
    childByValue: function(childByValue) {
      this.pickerShow = childByValue;
    },
    share() {
      this.pickerShow = false;
      this.pickerShow = true;
    },
    shareImg() {
      this.pickerShow = childByValue;
    }
  },
  onShareAppMessage: function(res) {
    // org_status为30的时候表示改社团可认领，分享即为邀请好友
    return {
      title:
        this.org_status == 30
          ? wx.getStorageSync("silentlogin").nickname +
            "邀请你来认领" +
            this.cms_school_name +
            this.name
          : this.cms_school_name + this.name + "在奇集等你来关注",
      path:
        this.org_status == 30
          ? "/pages/club/all/all?toClaim=1&org_id=" +
            this.org_id +
            "&userName=" +
            wx.getStorageSync("silentlogin").nickname +
            "&avatar=" +
            wx.getStorageSync("silentlogin").avatar
          : "/pages/club/all/all?org_id=" + this.org_id
      // imageUrl: this.url+"/img/share/org.jpg"
      // imageUrl:
      //   this.photos.length > 0
      //     ? this.url + this.photos[0]
      //     : this.url + "/img/share/org.jpg"
    };
  }
};
</script>
<style>
.showModal_wrap {
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100vh;
  z-index: 100;
}
.showModal_wrap .showModal {
  width: 590rpx;
  height: 330rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #fff;
  margin: 0 auto;
  margin-top: 340rpx;
  overflow: hidden;
  position: relative;
}
.showModal_wrap .closeIcon {
  position: absolute;
  width: 26rpx;
  height: 26rpx;
  top: 40rpx;
  right: 40rpx;
}
.showModal_wrap .showModal .content {
  margin-top: 90rpx;
}
.showModal_wrap .showModal .content p {
  height: 70rpx;
  font-size: 30rpx;
  width: 418rpx;
  text-align: center;
  color: #000000;
  margin: 0 auto;
}
.showModal_wrap .showModal .btn {
  width: 230rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #ffb90c;
  border-radius: 44rpx;
  text-align: center;
  margin: 24rpx auto 0rpx;
  font-size: 28rpx;
  color: #331900;
}
header .header_wrap {
  padding: 24rpx 0 40rpx;
}
.logo {
  margin: 0 auto;
  width: 156rpx;
  overflow: hidden;
}
.logo img {
  width: 156rpx;
  height: 156rpx;
  border-radius: 4rpx;
}
.clubTitle {
  font-size: 36rpx;
  font-weight: bold;
  color: #332503;
  margin-top: 12rpx;
  text-align: center;
}
.school {
  font-size: 26rpx;
  text-align: center;
  color: #99958a;
  margin-top: 10rpx;
}

.tab {
  width: 750rpx;
  height: 120rpx;
  display: flex;
  justify-content: space-around;
  position: relative;
  border-bottom: 1px solid #e6e6e6;
}
.tab .tab_item {
  font-size: 32rpx;
  color: #ccc7b8;
  line-height: 120rpx;
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
  left: 134rpx;
  transform: translateX(0);
}
.navbar_slider_1 {
  left: 147rpx;
  transform: translateX(354rpx);
}
.navbar_selectedTitle {
  color: #331900;
  font-weight: bold;
}

.clubDetail .club-item {
  padding: 0 40rpx 42rpx;
  border-bottom: 20rpx solid #f5f5f5;
}
.clubDetail .club-item:last-child {
  border: 0;
}
.clubDetail .club-item .baseInfo {
  margin-top: 70rpx;
}
.clubDetail .club-item .baseInfo p {
  font-size: 26rpx;
  color: #99958a;
  line-height: 40rpx;
}
.clubDetail .club-item .title {
  position: relative;
  margin-top: 22rpx;
}
.clubDetail .club-item .title > span:first-child {
  font-size: 34rpx;
  font-weight: bold;
  color: #332503;
}
.clubDetail .club-item .title .underline {
  position: absolute;
  display: block;
  bottom: 4rpx;
  width: 136rpx;
  height: 8rpx;
  background: #ffb90c;
  left: 0rpx;
  z-index: -1;
}
.clubDetail .club-item .contain > p {
  margin-top: 20rpx;
  font-size: 26rpx;
  color: #99958a;
  line-height: 40rpx;
}
.clubDetail .club-item .contain .photos {
  margin-top: 16rpx;
}
.clubDetail .club-item .contain .photos img {
  width: 160rpx;
  height: 160rpx;
  margin-right: 10rpx;
}
.clubDetail .club-item .contain .photos img:nth-child(4n + 4) {
  margin-right: 0rpx;
}
.clubDetail .club-item .default {
  margin-top: 74rpx;
  width: 100%;
  text-align: center;
}
.clubDetail .club-item .default img {
  width: 300rpx;
  height: 300rpx;
  margin: 0 auto;
}
.clubDetail .club-item .default p {
  font-size: 32rpx;
  color: #999999;
  margin-top: 20rpx;
  text-align: center;
}

.clubAct {
  padding: 0 30rpx;
}
.clubAct .default img {
  display: block;
  width: 300rpx;
  height: 300rpx;
  margin: 100rpx auto 0;
}
.clubAct .default p {
  color: #999999;
  font-size: 32rpx;
  margin-top: 27rpx;
  text-align: center;
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

.more {
  margin-top: 20rpx;
  line-height: 70rpx;
}
.more a {
  display: block;
  width: 670rpx;
  margin: 0 auto;
  text-align: center;
  font-size: 26rpx;
  color: #99958a;
}

.bottomFixed {
  width: 670rpx;
  height: 118rpx;
  background: #ffffff;
  padding: 30rpx 40rpx 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  box-shadow: 0px -15px 15px -15px rgba(0, 0, 0, 0.12);
}
.bottomFixed p {
  background: #ffb90c;
  width: 100%;
  line-height: 88rpx;
  text-align: center;
  display: block;
  height: 88rpx;
  border-radius: 8rpx;
  font-size: 30rpx;
  color: #332503;
  font-weight: bold;
}
.bottomFixed i {
  background: #ccc7b8;
  display: block;
  font-weight: bold;
  color: #332503;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 8rpx;
  width: 100%;
  text-align: center;
}
.bottomFixed div {
  /* padding: 25rpx 0rpx 30rpx 100rpx; */
  padding: 25rpx 0 30rpx;
  width: 320rpx;
  /* width: 670rpx; */
  text-align: center;
  font-size: 30rpx;
  color: #332503;
  height: 88rpx;
  box-sizing: border-box;
  font-weight: bold;
  border-radius: 8rpx;
}
.bottomFixed button {
  /* padding: 25rpx 0rpx 30rpx 100rpx; */
  padding: 25rpx 0 30rpx;
  /* width: 320rpx; */
  text-align: center;
  font-size: 30rpx;
  color: #332503;
  height: 88rpx;
  box-sizing: border-box;
  font-weight: bold;
  border-radius: 8rpx;
  line-height: 44rpx;
}
.bottomFixed div:first-child {
  background: #ffb90c;
}
.bottomFixed .attention {
  background: #f5f5f5;
}
.bottomFixed .cancel {
  background: #ffb90c;
}
.bottomFixed button:after {
  border: none;
}
</style>
