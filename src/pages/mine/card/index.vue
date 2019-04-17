<template>
  <div>
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <div class="card_wrap" :style="{backgroundImage:'url('+cardBg+')'}">
      <header>
        <div class="title">
          <img :src="cardImg" alt="" :key="cardImg">
        </div>
      </header>
      <main>
        <div class="main_wrap" :style="{backgroundImage:'url('+mainBg+')'}">
          <div class="main_top">
            <img :src="org_logo" alt="">
            <p>{{org_name}}</p>
          </div>
          <div class="main_center">
            <p>已加入奇集<span class="red">{{days}} </span>天</p>
            <p><span class="red">{{activity_number}} </span>个活动 | <span class="red">{{fans_number}} </span>个粉丝</p>
            <p>有<span class="red">{{activity_people}} </span>人参与了TA的活动</p>
          </div>
          <div class="main_bottom">
            <img :src="qrcode" alt="">
            <p>扫码来奇集了解更多</p>
          </div>
        </div>
      </main>

      <footer>
        <div class="btn_wrap">
          <button open-type="share">发送给好友</button>
          <button @click="saveImg">海报分享</button>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import { orgCardDetail, orgCard } from "@/utils/api";
import common from "@/utils/common";
import loading from "@/components/loading";
export default {
  data() {
    return {
      loadingShow: true,
      url: common.url,
      cardBg: common.url + "/img/home/bg@2x.png",
      mainBg: common.url + "/img/home/baibg@2x.png",
      posterUrl:"",
      org_id: "",
      org_logo: "",
      org_name: "",
      days: "",
      activity_number: "",
      fans_number: "",
      activity_people: "",
      qrcode: "",
      cardImg: common.url+'/img/home/slogan@2x.png'
    };
  },
  components: {
    loading
  },
  onLoad() {
    this.loadingShow = true;
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        let orgDetail = await orgCardDetail({}, true);
        this.org_logo = orgDetail.org_logo;
        this.org_name = orgDetail.org_name;
        this.org_id = orgDetail.org_id;
        this.days = orgDetail.days;
        this.activity_number = orgDetail.activity_number;
        this.fans_number = orgDetail.fans_number;
        this.activity_people = orgDetail.activity_people;
        this.qrcode = orgDetail.qrcode;
        this.loadingShow = false;
      } catch (e) {
        this.loadingShow = false;
      }
    },
    saveImg() {
      orgCard()
        .then(res => {
          var path = this.url + res.path;
          this.posterUrl = path
          this.downLoadImg(path);
        })
        .catch(err => {
          console.log(err);
        });
    },
    downLoadImg(path) {
      var that = this;
      wx.downloadFile({
        url: this.posterUrl,
        success: function(res) {
          console.log(res);
          //图片保存到本地
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(data) {
              wx.showToast({
                title: "保存成功",
                icon: "success",
                duration: 2000
              });
            },
            fail: function(err) {
              console.log(err);
              that.openSet();
            },
            complete(res) {
              console.log(res);
            }
          });
        }
      });
    },
    openSet() {
      wx.openSetting({
        success(settingdata) {
          console.log(1111, settingdata);
          if (settingdata.authSetting["scope.writePhotosAlbum"]) {
            console.log("获取权限成功，给出再次点击图片保存到相册的提示。");
          } else {
            console.log("获取权限失败，给出不给权限就无法正常使用的提示");
          }
        }
      });
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: this.org_name,
      path: "/pages/index/index?org_id=" + this.org_id
      // imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
.card_wrap {
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  overflow: hidden;
}
header .title img {
  width: 574rpx;
  height: 95rpx;
  display: block;
  margin: 90rpx auto 0;
}

.main_wrap {
  width: 677rpx;
  height: 798rpx;
  background-size: 100% 100%;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 44rpx;
  text-align: center;
}
.main_top {
  margin: 68rpx auto 0;
  overflow: hidden;
  width: 520rpx;
}
.main_top img {
  width: 116rpx;
  height: 116rpx;
  float: left;
}
.main_top p {
  text-align: left;
  margin-left: 24rpx;
  width: 380rpx;
  font-size: 38rpx;
  color: #333333;
  font-weight: bold;
  float: left;
  margin-top: 8rpx;
}

.red {
  color: #fa5846;
  font-size: 30rpx;
}
.main_center {
  font-size: 26rpx;
  color: #333333;
  margin-top: 48rpx;
}
.main_center p {
  margin-top: 12rpx;
}

.main_bottom {
  border-top: 1px solid #f4f4f4;
  width: 570rpx;
  margin: 76rpx auto 0;
  padding-top: 40rpx;
}
.main_bottom img {
  width: 180rpx;
  height: 180rpx;
}
.main_bottom p {
  font-size: 24rpx;
  color: #666666;
  margin-top: 2rpx;
}

footer .btn_wrap {
  position: fixed;
  bottom: 0rpx;
  width: 750rpx;
  height: 148rpx;
  line-height: 148rpx;
  padding: 30rpx 40rpx;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: space-around;
}
footer .btn_wrap button {
  width: 320rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 8rpx;
  text-align: center;
  font-size: 30rpx;
  color: #332503;
  box-sizing: border-box;
  font-weight: bold;
}
footer .btn_wrap button:first-child {
  background: #ffb90c;
}
footer .btn_wrap button:nth-child(2) {
  background: #f5f5f5;
  margin-left: 30rpx;
}
footer .btn_wrap button::after {
  border: none;
}
</style>
