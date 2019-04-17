<template>
  <div class="buildClub">
    <introtips></introtips>
    <main>
      <div class="logo">
        <img :src="url+'/img/orgapp/1.0.0/complete/clublogo@2x.png'" alt="">
      </div>
      <div class="input">
        <input type="text" class="in" @focus="buildClubFocu" @blur="buildClubBlu" v-model="buildClubName" @confirm="toClaim" confirm-type="search" maxlength="15">
        <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" v-show="buildClubName" @click="clear">
        <div class="buildClubNumber" v-show="buildClubFocus">
          <text class="buildClubText">请输入你要创建的社团名称</text>
        </div>
        <!-- <p @click="toHistory">查看创建历史</p> -->
      </div>

      <form @submit="toClaim" report-submit="true">
        <button class="next" :class="btnBg" form-type="submit">下一步</button>
      </form>

      <div class="or_btn" v-if="complete">
        <p>or</p>
        <button @click="toLook">去奇集看看</button>
      </div>

    </main>
    <div class="agree" v-if="complete">
      <p>点击下一步即视为同意<span @click="toProtocol">《奇集用户协议》</span></p>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
import { orgs, userInfo, claimsGet } from "@/utils/api";
import { mapState, mapMutations } from "vuex";
import { formId } from "@/utils/common";
import introtips from "@/components/tips/introduceTips";
export default {
  data() {
    return {
      url: common.url,
      buildClubFocus: true,
      buildClubName: "",
      token: "",
      cms_school_id: "",
      complete: false //(true表示)已注册，入口为首页
    };
  },
  components:{
    introtips
  },
  computed: mapState({
    ...mapState(["clubOrgs", "clubName"])
  }),
  computed: {
    btnBg() {
      if (this.buildClubName) {
        return "";
      } else {
        return "btnBg";
      }
    }
  },
  onLoad(options) {
    if (options.complete) {
      this.complete = true;
    }
  },
  onShow() {
    this.buildClubName = "";
    this.cms_school_id = wx.getStorageSync("cms_school_id");
  },
  methods: {
    ...mapMutations(["searchInfo", "searchName"]),
    buildClubFocu() {
      this.buildClubFocus = false;
    },
    buildClubBlu() {
      this.buildClubName == ""
        ? (this.buildClubFocus = true)
        : (this.buildClubFocus = false);
    },
    clear() {
      this.buildClubName = "";
    },
    toClaim(e) {
      formId(e);
      if (common.status === "dev") {
        wx.reportAnalytics("create_org_click", {
          step: "搜索社团下一步"
        });
      }
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      userInfo({}, token).then(res => {
        console.log(res);
        if (res.orgs) {
          wx.showModal({
            title: "提示",
            content: "您已拥有社团，无法创建"
          });
        } else if (
          res.last_org_claim &&
          res.last_org_claim.audit_status == 10
        ) {
          wx.showModal({
            title: "提示",
            content: "您的社团正在审核中"
          });
        } else {
          var cms_school_id = wx.getStorageSync("cms_school_id");
          var that = this;
          this.buildClubName = this.buildClubName.replace(/\s+/g, "");
          var reg = new RegExp("^[0-9]*$");
          var reg2 = new RegExp("^[A-Za-z]+$");
          var reg3 = new RegExp(
            "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
          );
          if (
            reg.test(this.buildClubName) ||
            reg2.test(this.buildClubName) ||
            reg3.test(this.buildClubName)
          ) {
            wx.showModal({
              title: "提示",
              content: "请输入正确的社团名字"
            });
          } else if (this.buildClubName.length > 0) {
            let data = {
              keyword: that.buildClubName,
              cms_school_id: cms_school_id
            };
            orgs(data).then(function(res) {
              wx.showToast({
                title: "查询成功"
              });
              console.log(res);
              // that.searchName(that.buildClubName);
              if (res.data == "") {
                that.getHistory();
                // wx.navigateTo({
                //   // url: "./claim/claim"
                //   url: "./clubInfo/buildStep1?org_name=" + that.buildClubName
                // });
              } else {
                wx.navigateTo({
                  url:
                    "./claim/insist/insist?keyword=" +
                    that.buildClubName +
                    "&cms_school_id=" +
                    cms_school_id
                });
              }
            });
          }
        }
      });
    },
    getHistory() {
      claimsGet({
        keyword: this.buildClubName,
        cms_school_id: this.cms_school_id,
        audit_status: 10
        // user_id: wx.getStorageSync("silentlogin").user_id
      }).then(res => {
        if (res.data == "") {
          console.log(res.data, "113");
          wx.navigateTo({
            // url: "./claim/claim"
            url: "./clubInfo/buildStep1?org_name=" + this.buildClubName
          });
        } else {
          wx.navigateTo({
            url:
              "./claim/insist/insist?keyword=" +
              this.buildClubName +
              "&cms_school_id=" +
              this.cms_school_id
          });
        }
      });
    },
    toLook() {
      if (common.status === "dev") {
        wx.reportAnalytics("create_org_click", {
          step: "去奇集看看"
        });
      }
      wx.navigateToMiniProgram({
        appId: "wx99418b7b5cdcc4d4",
        path: "pages/index/index?id=123",
        extraData: {},
        envVersion: "develop",
        success(res) {
          // 打开成功
        }
      });
    },
    toProtocol() {
      wx.navigateTo({
        url: "/pages/login/register/protocol"
      });
    },
    toHistory() {
      wx.navigateTo({
        url: "./history/history"
      });
    }
  }
};
</script>
<style>
main {
  padding: 0rpx 40rpx;
}
.buildClub .logo img {
  width: 200rpx;
  height: 200rpx;
  margin: 0 auto;
  display: block;
}
.buildClub .input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
  margin-top: 52rpx;
}
.buildClub .closeIcon {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  width: 26rpx;
  height: 26rpx;
  z-index: 20;
}
.buildClub .input p {
  margin-top: 38rpx;
  font-size: 28rpx;
  color: #331900;
  text-align: center;
  font-family: PingFang-SC -Medium;
}
.buildClub .in {
  /* width: 100%; */
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  /* color: #ccc7b8; */
  padding-left: 40rpx;
  font-size: 28rpx;
  padding-right: 100rpx;
}
.buildClub .buildClubNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}
.next {
  margin-top: 60rpx;
  width: 670rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #ffb90c;
  text-align: center;
  line-height: 88rpx;
  font-size: 28rpx;
  color: #331900;
}
.btnBg {
  opacity: 0.3;
}

.or_btn {
  margin-top: 34rpx;
  font-size: 30rpx;
  color: #666666;
  text-align: center;
}
.or_btn button:after {
  border: none;
  padding: 0;
}
.or_btn button {
  color: #ffb90c;
  background: #fff;
  padding: 0;
  line-height: 30rpx;
  font-size: 30rpx;
  margin-top: 30rpx;
}
.agree {
  width: 100%;
  position: fixed;
  bottom: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #999999;
  margin: 0 auto;
}
.agree span {
  color: #576b95;
}
</style>

