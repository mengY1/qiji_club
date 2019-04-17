<template>
  <div class="club">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <header>
      <div class="shadow" v-show="bgShow">
        <div class="modal">
          <img :src="url+'/img/default/common/pop_guanbi@2x.png'" alt="" @click="cancelBgShow">
          <p v-if="audit_status==30&&remaining_create_times>0">你还有{{remaining_create_times}}次机会重新提交本社团进行审核</p>
          <p v-else-if="audit_status==10">你的社团正在审核中</p>
          <p v-else-if="remaining_create_times==0">你已没有机会创建该社团</p>
          <span @click="sure">确定</span>
        </div>
      </div>
      <div class="failTips">
        <p v-if="audit_status==30" style="padding-left:40rpx">审核失败:{{audit_remark}}</p>
        <block v-else-if="audit_status==10">
          <p v-if="hour">社团审核中:请耐心等待奇集将会在{{hour}}小时内完成审核</p>
          <p v-else>社团审核中,奇集会尽快通知审核结果</p>
        </block>
      </div>
    </header>
    <main>
      <div class="header_wrap">
        <div class="logo">
          <img :src="url+logo+logoUrl" @click="toPreview(logo)">
        </div>
        <p class="clubTitle">{{name}}</p>
        <p class="school">{{cms_school_name}}</p>
      </div>
      <div class="clubDetail">
        <div class="club-item">
          <div class="baseInfo">
            <p>社团口号：{{summary?summary:"未填写"}}</p>
            <p>社团公众号：{{official_accounts?official_accounts:'未填写'}}</p>
            <p>社团社长：{{realname}}</p>
            <p>社长联系方式：{{phone}}</p>
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
            <span>社团证件</span>
            <span class="underline"></span>
          </div>
          <div class="contain">
            <img :src="url+certificate" alt="">
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

    </main>
    <footer v-if="audit_status==30" style="height:144rpx">
      <div class="reset">
        <span @click="reset">{{remaining_create_times==0&&audit_status==30?"重新创建":"重新提交"}}</span>
      </div>
    </footer>
  </div>
</template>
<script>
import { formId } from "@/utils/common";
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import otherUrl from "@/utils/common";
import { countTime } from "@/utils/changeTime";
// import sharePicker from "./sharePicker";
import { claims_id, userInfo } from "@/utils/api";
import loading from "@/components/loading";
export default {
  data() {
    return {
      loadingShow: true,
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      bgShow: false,
      token: "",
      audit_remark: "",
      name: "",
      phone: "",
      photos: "",
      logo: "",
      cms_school_name: "",
      introduction: "",
      summary: "",
      qq: "",
      official_accounts: "",
      realname: "",
      certificate: "",
      org_claim_id: "",
      org_id: "",
      type: "",
      remaining_create_times: "",
      audit_status: "",
      hour: "" //剩余小时
    };
  },
  components: {
    loading
  },
  onLoad(options) {
    this.token = " ";
    this.loadingShow = true;
    this.token += wx.getStorageSync("silentlogin").token;
    this.org_claim_id = options.org_claim_id;
    this.getInfo();
    this.getUserInfo();
    this.bgShow = false;
    // this.sure = false;
  },
  methods: {
    getUserInfo() {
      userInfo({}, this.token, true).then(res => {
        this.loadingShow = false;
        this.audit_status = res.last_org_claim.audit_status;
      });
    },
    getInfo() {
      claims_id(this.org_claim_id, {}, this.token, true).then(res => {
        this.audit_remark = res.audit_remark;
        this.photos = res.photos;
        this.phone = res.phone;
        this.logo = res.logo;
        this.cms_school_name = res.cms_school_name;
        this.summary = res.summary;
        this.introduction = res.introduction;
        this.name = res.name;
        this.qq = res.qq;
        this.official_accounts = res.official_accounts;
        this.realname = res.chief.realname;
        this.certificate = res.certificate;
        this.org_id = res.org_id;
        this.type = res.type;
        this.remaining_create_times = res.remaining_create_times;
        this.hour = countTime(res.created_at);
      });
    },
    cancelBgShow() {
      this.bgShow = false;
    },
    sure() {
      this.bgShow = false;
      if (
        this.org_id > 0 &&
        this.audit_status == 30 &&
        this.remaining_create_times > 0
      ) {
        this.toBuild();
      } else if (
        this.org_claim_id &&
        this.remaining_create_times > 0 &&
        this.audit_status == 30
      ) {
        this.toClaim();
      } else if (this.remaining_create_times == 0 && this.audit_status == 30) {
        wx.navigateTo({
          url: "/pages/mine/buildClub/index"
        });
      }
    },
    //重新去认领(有org_id)
    toBuild() {
      wx.setStorageSync("org_id", this.org_id);
      wx.navigateTo({
        url:
          "/pages/mine/buildClub/clubInfo/buildStep1?status=woyao&type=" +
          this.type +
          "&org_id=" +
          this.org_id +
          "&title=claim"
      });
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
    //重新提交创建
    toClaim() {
      wx.navigateTo({
        url:
          "/pages/mine/buildClub/clubInfo/buildStep1?status=reset&type=" +
          this.type +
          "&org_claim_id=" +
          this.org_claim_id
      });
    },
    reset() {
      // 有org_id则是重新认领
      this.bgShow = true;
    }
  }
};
</script>
<style>
.shadow {
  z-index: 10;
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}
.shadow img {
  width: 21rpx;
  height: 21rpx;
  position: absolute;
  top: 30rpx;
  right: 30rpx;
}
.shadow .modal {
  width: 590rpx;
  height: 330rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
  background: #fff;
  position: fixed;
  top: 358rpx;
  left: 80rpx;
  text-align: center;
  padding: 86rpx 110rpx;
}
.shadow .modal p {
  font-size: 32rpx;
  color: #333333;
  line-height: 40rpx;
  width: 350rpx;
}
.shadow .modal span {
  display: block;
  width: 230rpx;
  height: 88rpx;
  box-sizing: border-box;
  border-radius: 44rpx;
  background: #ffb90c;
  text-align: center;
  line-height: 88rpx;
  font-size: 28rpx;
  color: #331900;
  position: absolute;
  left: 180rpx;
  top: 192rpx;
}
.failTips {
  width: 750rpx;
  position: absolute;
  z-index: 5;
  top: 0rpx;
  line-height: 88rpx;
  /* padding-left: 40rpx; */
  color: #fff;
  font-size: 26rpx;
  background: rgba(0, 0, 0, 0.8);
  overflow: hidden;
}
.failTips p {
  padding-left: 40rpx;
}

.header_wrap {
  padding: 24rpx 0 40rpx;
  background: #fff;
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

main {
  width: 100%;
  overflow: hidden;
}

.clubDetail {
  overflow: hidden;
  border-top: 20rpx solid #f5f5f5;
}
.clubDetail .club-item {
  padding: 0 40rpx 42rpx;
  border-bottom: 20rpx solid #f5f5f5;
}
.clubDetail .club-item .baseInfo {
  margin-top: 24rpx;
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
.clubDetail .club-item .contain {
  margin-top: 40rpx;
}
.clubDetail .club-item .contain img {
  width: 160rpx;
  height: 160rpx;
  border: 1px solid #e6e6e6;
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
.bottomFixed p.huise {
  background: rgba(204, 199, 184, 1);
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
  background: #f5f5f5;
}
.bottomFixed .attention {
  background: #ffb90c;
}
.bottomFixed .cancel {
  background: #ccc7b8;
}

footer .reset {
  position: fixed;
  bottom: 0rpx;
  width: 750rpx;
  height: 144rpx;
  background: #fff;
  box-shadow: -3rpx 0rpx 30rpx 0rpx rgba(0, 0, 0, 0.12);
}
footer .reset span {
  display: block;
  box-sizing: border-box;
  width: 670rpx;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #ffb90c;
  color: #332503;
  font-size: 30rpx;
  font-weight: bold;
  margin: 30rpx 40rpx 0;
  border-radius: 8rpx;
}
</style>
