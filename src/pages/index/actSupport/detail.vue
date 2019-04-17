<template>
  <div>
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <header>
      <div class="header_wrap">
        <div class="header_left">
          <img :src="url+content.avatar" v-if="content" alt="">
        </div>
        <div class="header_right">
          <p class="title">
            {{content.company_name}}
          </p>
          <p class="money">赞助金额：¥{{content.funds}}</p>
          <p class="address">{{content.address}}</p>
        </div>
      </div>
    </header>
    <main>
      <div class="main_wrap">
        <div class="supDetail">
          <div class="title">
            <span>赞助详情</span>
            <span class="underline"></span>
          </div>
          <div class="sup-content">
            <div v-if="txt" v-html="txt">
              {{txt}}
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="btn_wrap">
        <!-- <button @click="makePhone">立马联系</button> -->
        <form @submit="makePhone" report-submit="true">
          <button form-type="submit">立马联系</button>
        </form>
        <!-- <button open-type="share">分享给好友</button> -->
        <form @submit="toShare" report-submit="true">
          <button form-type="submit" open-type="share">分享给好友</button>
        </form>
      </div>
    </footer>
  </div>
</template>
<script>
import loading from "@/components/loading";
import { toShouquan } from "@/utils/common";
import { supDetail } from "@/utils/api";
import { formId } from "@/utils/common";
import common from "@/utils/common";
export default {
  data() {
    return {
      content: "",
      loadingShow: true,
      url: common.url,
      sponsor_id: "",
      txt: "",
      channel: "",
      company_name: ""
    };
  },
  components: {
    loading
  },
  onLoad(options) {
    this.txt = "";
    this.loadingShow = true;
    this.sponsor_id = options.sponsor_id;
    this.getInfo(options.sponsor_id);
    this.channel = options.channel;
  },
  methods: {
    async getInfo(id) {
      console.log(id);
      try {
        let content = await supDetail(id, "", true);
        this.content = content.data;
        this.txt = content.data.content;
        this.company_name = content.data.company_name;
        this.loadingShow = false;
        if (common.status == "dev") {
          wx.reportAnalytics("sponsor_show_enterpage", {
            company_name: this.company_name,
            channel: this.channel
          });
        }
      } catch (e) {
        this.loadingShow = false;
      }
    },
    makePhone(e) {
      formId(e);
      if (common.status == "dev") {
        wx.reportAnalytics("sponsor_show_contact", {
          company_name: this.company_name,
          channel: this.channel
        });
      }
      wx.makePhoneCall({
        phoneNumber: this.content.company_phone
      });
    },
    toShare(e) {
      formId(e);
    }
  },
  onShareAppMessage: function(res) {
    if (common.status == "dev") {
      wx.reportAnalytics("sponsor_show_share_firends", {
        company_name: this.company_name,
        channel: this.channel
      });
    }
    return {
      title: this.content.company_name + "在奇集发赞助",
      path: "/pages/club/all/all?sponsor_id=" + this.sponsor_id
      // imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
.header_wrap {
  padding: 36rpx 40rpx 40rpx;
  overflow: hidden;
  border-bottom: 20rpx solid #f5f5f5;
}
.header_left {
  float: left;
}
.header_left img {
  width: 124rpx;
  height: 124rpx;
}
.header_right {
  float: left;
  margin-left: 18rpx;
  width: 500rpx;
}
.header_right .title {
  font-size: 32rpx;
  width: 284rpx;
  color: #333333;
  margin-top: -6rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.header_right .money {
  font-size: 28rpx;
  color: #576b95;
  margin-top: 8rpx;
}
.header_right .address {
  font-size: 28rpx;
  color: #999999;
  margin-top: 6rpx;
}

main {
  padding-bottom: 162rpx;
}
.main_wrap {
  padding: 0 40rpx;
}
.main_wrap .title {
  margin-top: 28rpx;
  font-size: 34rpx;
  position: relative;
  color: #332503;
  font-weight: bold;
}
.main_wrap .underline {
  position: absolute;
  display: block;
  bottom: 4rpx;
  width: 136rpx;
  height: 8rpx;
  background: #ffb90c;
  left: 0rpx;
  z-index: -1;
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
footer .btn_wrap form:first-child button {
  background: #ffb90c;
}
footer .btn_wrap form:nth-child(2) button {
  background: #f5f5f5;
  margin-left: 30rpx;
}
footer .btn_wrap button::after {
  border: none;
}
</style>