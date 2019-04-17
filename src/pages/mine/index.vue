<template>
  <div class="mine">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>

    <div style="padding:20rpx 35rpx 28rpx 40rpx">
      <div class="userInfo" @click="toClubDetail">
        <div class="userInfo_top">
          <img :src="avatar">
          <div class="userTxt">
            <div style="overflow:hidden">
              <div class="president" v-if="audit_status==20">
                <span>社长</span>
              </div>
              <p class="userName">{{userName}}</p>
            </div>
            <span v-show="schoolName">{{schoolName}}</span>
            <span v-if="audit_status == 10" class="inReview"><span style="color:#99958a"> | </span>审核中</span>
            <span class="fail" v-if="audit_status == 30 ">
              <span style="color:#99958a"> |</span> 审核失败</span>
            <span class="clubName" v-if="audit_status==20"> | {{clubName}}</span>
          </div>
        </div>
        <img src="http://54qj.54qn.cn/Public/images/club/detailsIcon.png" class="more">
        <!-- <img class="QRcode" @click="toCard" v-if="audit_status==20" :src="url+'/img/home/icon_QR code.png'" alt=""> -->
      </div>
    </div>

    <!-- 社团审核通知提示 -->
    <!-- <div class='shadow' v-if="isShowTips"></div>
    <div class='successTips' v-if="isShowTips">
      <img class="mainImg" v-if="audit_status==20" :src="url+'/img/home/shenghetongguo.png'" alt="">
      <img class="mainImg" v-if="audit_status==30" :src="url+'/img/home/shengheshibai.png'" alt="">
      <div class="close_wrap" @click="changeIsShowTips">
        <img :src="url+'/img/home/pop_guanbi@2x.png'" class="closeImg">
      </div>
      <div class="content">
        <p>审核通知</p>
        <p v-if="audit_status==20">你创建的{{clubName}}社团通过了审核</p>
        <p v-if="audit_status==30">你创建的{{clubName}}社团审核失败了</p>
      </div>
      <div class="btn">
        <p @click="changTo" v-if="audit_status==20">去发活动</p>
        <p @click="toFail" v-if="audit_status==30">查看原因</p>
      </div>
    </div> -->
    <main>
      <!-- 个人用户列表 -->
      <div class="personal">
        <button class="mine-item" @click="toHistory" v-if="audit_status==10||audit_status==30">
          <img :src="url+'/img/orgapp/1.0.0/mine/icon/schedule.png'" class="icon" v-if="url">
          <text>审核记录</text>
          <img src="http://54qj.54qn.cn/Public/images/club/detailsIcon.png" class="more">
        </button>
        <button class="mine-item" v-for="(item,index) in main" :key="index" :data-id="index" @click="toMore" :open-type="index===2?'contact':''">
          <img :src="item.img" class="icon">
          <text>{{item.title}}</text>
          <div class="waiToSee" v-if="index==1&&unread_message>0">
            <text>你有{{unread_message}}条待读消息</text>
          </div>
          <div class="redDot" v-if="index==1&&unread_message>0"></div>
          <!-- <div class="redDot" v-if="index==0"></div> -->
          <img src="http://54qj.54qn.cn/Public/images/club/detailsIcon.png" class="more">
        </button>
      </div>
    </main>

    <footer>
      <div class="userInfo_bottom" v-if="audit_status == 10 ">
        <div class="perfectBtn">
          <form @submit="toSchedule" report-submit="true">
            <button form-type="submit">查看审核进度</button>
          </form>
        </div>
      </div>
      <div class="userInfo_bottom" v-else-if="audit_status==20">
        <div class="perfectBtn">
          <form @submit="toPublish" report-submit="true">
            <button form-type="submit">发活动</button>
          </form>
        </div>
      </div>
      <div class="userInfo_bottom" v-else-if="audit_status==30">
        <div class="perfectBtn">
          <form @submit="toSchedule" report-submit="true">
            <button form-type="submit">重新提交审核</button>
          </form>
        </div>
      </div>
      <div class="userInfo_bottom" v-else @click="toBuildClub">
        <div class="perfectBtn">
          <button>创建社团</button>
        </div>
      </div>
    </footer>
  </div>

</template>
<script>
import common from "@/utils/common";
import { claimsGet, userInfo, silentlogin, claims_id } from "@/utils/api";
import tabBarMsg from "@/utils/tabBarMsg";
import loading from "@/components/loading";
import { formId } from "@/utils/common";
export default {
  data() {
    return {
      loadingShow: true,
      isShowTips: "",
      url: common.url,
      org_claim_id: "",
      org_id: "",
      filterBgShow: false,
      userName: "用户名最大字数限制11字",
      schoolName: "",
      clubName: "",
      userInfoList: {},
      is_full: 0,
      code: "",
      iv: "",
      encryptedData: "",
      money: "",
      audit_status: "", //创建社团审核状态
      unread_message: 0,
      avatar: "http://54qj.54qn.cn/Public/images/mine/noComplete.jpg",
      main: [
        {
          img: common.url + "/img/orgapp/1.0.0/mine/icon/my_activity.png",
          title: "我的活动"
        },
        {
          img: common.url + "/img/orgapp/1.0.0/mine/icon/message.png",
          title: "消息通知"
        },
        {
          img: common.url + "/img/orgapp/1.0.0/mine/icon/link.png",
          title: "联系客服"
        },
        {
          img: common.url + "/img/orgapp/1.0.0/mine/icon/communication.png",
          title: "奇集社长交流群"
        }
      ]
    };
  },
  components: {
    loading
  },
  onShow() {
    //如果没有获取到openid就去授权页面
    if (wx.getStorageSync("silentlogin").token) {
      this.loadingShow = true;
      this.getInfo();
    } else {
      this.loadingShow = false;
    }
    if (!wx.getStorageSync("silentlogin").openid) {
      wx.navigateTo({
        url: "/pages/login/shouquan/shouquan"
      });
    }
    var wechatInfo = wx.getStorageSync("silentlogin");
    this.userName = wechatInfo.nickname;
    this.avatar = this.url + wechatInfo.avatar;
    if (this.userInfoList.is_full) {
      this.is_full = this.userInfoList.is_full;
      console.log(this.is_full, "is_full");
    }
    if (this.userInfoList.orgs != undefined) {
      this.clubName = this.userInfoList.orgs.name;
    }
  },
  updated() {
    if (this.userInfoList.realname) {
      this.userName = this.userInfoList.realname;
    }
    this.schoolName = this.userInfoList.cms_school_name;
    this.unread_message = this.userInfoList.unread_message;
    wx.setStorageSync("cms_school_id", this.userInfoList.cms_school_id);
    if (this.userInfoList.is_full) {
      this.is_full = this.userInfoList.is_full;
      console.log(this.is_full, "is_full");
    }
    if (this.userInfoList.orgs != undefined) {
      this.clubName = this.userInfoList.orgs.name;
      wx.setStorageSync("org_id", this.userInfoList.orgs.org_id);
    }
    this.unread_message = this.userInfoList.unread_message;
    // 设置消息条数显示
    tabBarMsg(this.unread_message);
  },
  methods: {
    async getInfo() {
      var token = " ";
      if (wx.getStorageSync("token")) {
        token += wx.getStorageSync("token");
      } else {
        token += wx.getStorageSync("silentlogin").token;
      }
      try {
        var userInfoList = await userInfo({}, token, true);
      } catch (e) {
        //重启小程序会刷新token，以防用户在token刷新过程中切换到该页面，导致token失效，故在失效的时候catch错误并重新执行方法拿最新的token进行数据请求，直至成功
        this.getInfo();
        // wx.navigateTo({
        //   url: "/pages/login/shouquan/shouquan"
        // });
      }
      setTimeout(() => {
        this.loadingShow = false;
      }, 200);
      this.userInfoList = userInfoList;
      this.is_full = userInfoList.is_full;

      if (this.is_full == 1) {
        var wechatInfo = wx.getStorageSync("silentlogin");
        this.userName = this.userInfoList.realname;
        this.schoolName = this.userInfoList.cms_school_name;
        this.avatar = this.url + wechatInfo.avatar;
      }
      console.log(wechatInfo, this.avatar);
      if (userInfoList.orgs) {
        console.log("有社团");
        this.audit_status = 20;
      } else if (userInfoList.last_org_claim) {
        if (userInfoList.last_org_claim.audit_status != 20) {
          this.audit_status = userInfoList.last_org_claim.audit_status;
        }
        let id = userInfoList.last_org_claim.org_claim_id; //社团认领/创建id
        this.org_claim_id = id;
      } else {
        this.audit_status = "";
        this.org_claim_id = "";
      }
      if (this.audit_status == 20) {
        if (wx.getStorageSync("isShowTips") != "success") {
          this.isShowTips = true;
        } else {
          this.isShowTips = false;
        }
      } else if (this.audit_status == 30) {
        if (wx.getStorageSync("isShowTips") != "fail") {
          this.isShowTips = true;
        } else {
          this.isShowTips = false;
        }
      } else {
        this.isShowTips = false;
      }
      console.log(111111111111111);
      console.log(this.isShowTips);
      if (userInfoList.orgs) {
        var org_id = userInfoList.orgs.org_id; //我的社团id
        this.org_id = org_id;
      } else {
        this.org_id = "";
      }
      wx.setStorageSync("org_claim_id", id);
      if (this.org_id) {
        wx.setStorageSync("org_id", this.org_id);
      }
      this.money = userInfoList.orgs.wallet_amount;
    },
    toClubDetail() {
      if (this.audit_status === 20) {
        // 审核成功
        this.toManage();
      } else if (this.audit_status === 10 || this.audit_status === 30) {
        // 审核失败或者审核中
        this.toSchedule();
      }
    },
    toCard() {
      wx.navigateTo({
        url: "/pages/mine/card/index"
      });
    },
    toSchedule(e) {
      if (e) {
        formId(e);
      }
      wx.navigateTo({
        url: "/pages/club/fail/index?org_claim_id=" + this.org_claim_id
      });
    },
    toManage() {
      // 去我的社团
      wx.setStorageSync("org_id", this.org_id);
      var url = "../club/index?org_id=" + this.org_id;
      wx.navigateTo({
        url: url
      });
    },
    toMore(e) {
      var id = e.currentTarget.dataset.id;
      if (id == 0) {
        // 我的活动
        wx.navigateTo({
          url: "../activity/published/published"
        });
      } else if (id == 1) {
        // 消息通知
        wx.navigateTo({
          url: "./message/message"
        });
      } else if (id == 2) {
        // 联系客服
      } else if (id == 3) {
        // 奇集社长交流群
        wx.navigateTo({
          url: "/pages/mine/communication/index"
        });
        if (common.status == "dev") {
          wx.reportAnalytics("qiji_chief_group_click", {
            nickname: wx.getStorageSync("silentlogin").nickname
          });
        }
      }
    },
    toHistory() {
      wx.navigateTo({
        url: "/pages/mine/buildClub/history/history"
      });
    },
    changTo() {
      this.isShowTips = 1;
      wx.setStorageSync("isShowTips", "success");
      wx.navigateTo({
        url: "./publish/publish"
      });
    },
    toFail() {
      this.isShowTips = 1;
      wx.setStorageSync("isShowTips", "fail");
      wx.navigateTo({
        url: "/pages/club/fail/index?org_claim_id=" + this.org_claim_id
      });
    },
    toPublish(e) {
      formId(e);
      wx.navigateTo({
        url: "./publish/publish"
      });
    },
    toBuildClub() {
      wx.navigateTo({
        url: "/pages/mine/buildClub/index"
      });
    },
    changeIsShowTips() {
      this.isShowTips = false;
      if (this.audit_status == 20) {
        wx.setStorageSync("isShowTips", "success");
      } else if (this.audit_status == 30) {
        wx.setStorageSync("isShowTips", "fail");
      }
    },
    childByValue: function(filterBgShow) {
      this.filterBgShow = filterBgShow;
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
.shadow {
  z-index: 2;
  width: 1000rpx;
  height: 2000rpx;
  background: rgba(51, 25, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.userInfo {
  background: rgba(255, 255, 255, 0.7);
  position: relative;
}
.userInfo .more {
  position: absolute;
  width: 16rpx;
  height: 28rpx;
  top: 56rpx;
  right: 4rpx;
}
.userInfo .QRcode {
  position: absolute;
  top: 48rpx;
  right: 20rpx;
  width: 44rpx;
  height: 44rpx;
}
.userInfo .president {
  width: 80rpx;
  height: 36rpx;
  line-height: 36rpx;
  text-align: center;
  color: #fff;
  border-radius: 8rpx;
  background: #ccb166;
  font-size: 22rpx;
  float: left;
  margin-top: 19rpx;
  margin-left: 20rpx;
}
.userInfo .userInfo_top {
  overflow: hidden;
  padding-bottom: 40rpx;
}
.userInfo .userInfo_top img {
  width: 120rpx;
  height: 120rpx;
  float: left;
  border-radius: 20rpx;
}
.userInfo .userInfo_top .userTxt {
  width: 466rpx;
  float: left;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.userInfo .userInfo_top .userTxt p {
  float: left;
  margin-left: 20rpx;
  line-height: 68rpx;
}
.userInfo .userInfo_top .userTxt .userName {
  font-size: 40rpx;
  font-weight: bold;
  color: #331900;
  width: 280rpx;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.userInfo .userInfo_top .userTxt span:nth-child(2) {
  font-size: 26rpx;
  color: #99958a;
  margin-left: 20rpx;
}
.userInfo .userInfo_top .userTxt .clubName {
  color: #99958a;
  font-size: 26rpx;
  display: inline;
}
.userInfo .userInfo_top .userTxt .build {
  font-size: 26rpx;
  color: #4c79ff;
  margin-left: 12rpx;
}
.userInfo .userInfo_top .userTxt .inReview {
  font-size: 26rpx;
  color: #576b95;
}
.userInfo .userInfo_top .userTxt .fail {
  color: #ff4c5b;
  font-size: 26rpx;
}
.successTips {
  position: fixed;
  top: 15%;
  left: 11%;
  width: 590rpx;
  height: 700rpx;
  background: rgba(255, 255, 255, 1);
  border-radius: 8rpx;
  z-index: 3;
  text-align: center;
}
.successTips .mainImg {
  width: 350rpx;
  height: 256rpx;
  margin-top: 90rpx;
}
.successTips .close_wrap {
  width: 100rpx;
  height: 100rpx;
  position: absolute;
  top: 12rpx;
  right: -8rpx;
}
.successTips .closeImg {
  width: 22rpx;
  height: 22rpx;
}
.successTips .content p:first-child {
  font-size: 32rpx;
  color: #333333;
  font-weight: bold;
  margin-top: 24rpx;
}
.successTips .content p:nth-child(2) {
  color: #999999;
  font-size: 28rpx;
  margin-top: 4rpx;
}
.successTips .btn p {
  width: 230rpx;
  height: 88rpx;
  background: rgba(255, 185, 12, 1);
  border-radius: 44rpx;
  font-size: 28rpx;
  color: #331900;
  line-height: 88rpx;
  text-align: center;
  margin: 52rpx auto 0;
}
main {
  padding: 0 40rpx;
}
main .president .presidentBox {
  display: flex;
  flex-direction: initial;
  justify-content: space-between;
  padding: 0 22rpx;
}
main .president .presidentBox .president-item {
  width: 128rpx;
  height: 192rpx;
  box-sizing: border-box;
  text-align: center;
}
main .president .presidentBox .president-item img {
  width: 120rpx;
  height: 120rpx;
}
main .president .presidentBox .president-item p {
  font-size: 32rpx;
  color: #333333;
  margin-top: -20rpx;
}
main .commonBox {
  padding: 0 20rpx;
}
main .commonBox .common-item {
  border-top: 1px solid #d9d9d9;
  line-height: 96rpx;
  font-size: 28rpx;
  color: #333333;
  position: relative;
  overflow: hidden;
}
main .commonBox .common-item span {
  float: left;
}
main .commonBox .common-item .waiToSee {
  font-size: 28rpx;
  color: #cccccc;
  float: left;
  margin-left: 260rpx;
}
main .commonBox .common-item .redDot {
  position: absolute;
  top: 44rpx;
  right: 278rpx;
  width: 14rpx;
  height: 14rpx;
  background: #ff4c5b;
  border-radius: 50%;
}
main .commonBox .common-item .more {
  width: 16rpx;
  height: 28rpx;
  position: absolute;
  right: 0rpx;
  top: 32rpx;
}
button:after {
  border: none;
}
.mine-item {
  height: 140rpx;
  border-bottom: 2rpx solid #e6e6e6;
  position: relative;
  line-height: 140rpx;
  background: #fff;
  padding: 0;
}
.mine-item:last-child {
  border: none;
}
.mine-item .toMore {
  float: right;
  position: absolute;
  width: 50rpx;
  height: 50rpx;
  top: 44rpx;
  left: 610rpx;
  z-index: 20;
}
.mine-item .icon {
  width: 120rpx;
  height: 120rpx;
  margin-top: 0rpx;
  position: absolute;
  top: 15rpx;
  left: 4rpx;
}
.mine-item text {
  float: left;
  font-size: 34rpx;
  color: #99958a;
  margin-left: 128rpx;
}
.mine-item .waiToSee {
  float: left;
  /* margin-left: 45rpx; */
  overflow: hidden;
}
.mine-item .waiToSee text {
  font-size: 26rpx;
}
.mine-item .redDot {
  position: absolute;
  top: 64rpx;
  right: 290rpx;
  width: 14rpx;
  height: 14rpx;
  background: #ff4c5b;
  border-radius: 50%;
}
.mine-item .more {
  position: absolute;
  width: 16rpx;
  height: 28rpx;
  top: 58rpx;
  left: 624rpx;
}
.userInfo_bottom {
  margin-top: 60rpx;
  margin-bottom: 40rpx;
}
.userInfo_bottom .perfectBtn button {
  width: 590rpx;
  height: 88rpx;
  background: #ffb90c;
  border-radius: 44rpx;
  line-height: 88rpx;
  text-align: center;
  font-size: 28rpx;
  color: #331900;
}
.publish {
  overflow: hidden;
  position: fixed;
  bottom: 20rpx;
  right: 20rpx;
  float: right;
}
.publish img {
  width: 120rpx;
  height: 120rpx;
}
</style>

