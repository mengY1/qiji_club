<template>
  <!-- 新社长页面 -->
  <div>
    <header>
      <!-- 新社长扫码后提示 -->
      <div class="tips_wrap" v-if="page_status===10">
        <div class="text">
          <p>请谨慎操作，确认操作不可撤回，确认接受移交在移交过程</p>
          <p>请勿退出此页面，取消移交请点击右上角关闭按钮退出小程序</p>
        </div>
      </div>
    </header>
    <main>
      <!-- 移交社长确认 -->
      <block v-if="page_status===10">
        <img class="confirm_bg" :src="url+'/img/orgapp/1.0.0/mine/confirm.png'" alt="">
        <div class="text">
          <h1>移交社长确认</h1>
          <p>{{old_userName}}正在将{{org_name}}转移给你</p>
          <p>你确定成为{{org_name}}的社长吗？</p>
        </div>
      </block>
      <!-- 移交成功 -->
      <block v-if="page_status===20">
        <img class="success_bg" :src="url+'/img/orgapp/1.0.0/mine/remove.png'" alt="">
        <div class="text">
          <h1>移交成功</h1>
          <p>你已成功成为{{org_name}}的社长啦 </p>
        </div>
      </block>
      <!-- 移交失败提示 -->
      <block v-if="page_status===30">
        <img class="success_bg" :src="url+'/img/orgapp/1.0.0/mine/have_club.png'" alt="">
        <div class="text">
          <p>{{errMsg}}</p>
        </div>
      </block>
      <!-- 完善信息提示 -->
      <block v-if="page_status===40">
        <img class="success_bg" :src="url+'/img/orgapp/1.0.0/mine/visitor.png'" alt="">
        <div class="text">
          <p>你还未在奇集完善信息</p>
          <p>请先完善信息再继续提交</p>
        </div>
      </block>
    </main>
    <footer>
      <div class="bottomFixed">
        <form @submit="toSure" v-if="page_status===10" report-submit="true">
          <button form-type="submit">确认</button>
        </form>
        <form @submit="toIndex" v-if="page_status===20||page_status===30" report-submit="true">
          <button form-type="submit">返回奇集社团</button>
        </form>
        <form @submit="toRegister" v-if="page_status===40" report-submit="true">
          <button form-type="submit">完善信息</button>
        </form>
      </div>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import { remove_key, toConfirm } from "@/utils/api";
export default {
  data() {
    return {
      url: common.url,
      page_status: 10, //10是移交社长确认，20是移交成功，30是移交失败提示，40是完善信息提示
      key: "",
      old_userName: "",
      org_name: "",
      errMsg: "" //错误提醒
    };
  },
  onLoad(options) {
    this.key = options.key;
  },
  onShow() {
    this.getRemoveInfo();
  },
  methods: {
    getRemoveInfo() {
      if (wx.getStorageSync("silentlogin").token) {
        remove_key(this.key)
          .then(res => {
            this.page_status = 10;
            this.org_name = res.data.org_name;
            this.old_userName = res.data.original_chief_info.realname;
          })
          .catch(err => {
            this.page_status = 40;
          });
      } else {
        this.page_status = 40;
      }
    },
    // 确认接盘成为社长
    toSure(e) {
      formId(e);
      if (wx.getStorageSync("silentlogin").token) {
        toConfirm(this.key)
          .then(res => {
            this.page_status = 20;
          })
          .catch(err => {
            this.page_status = 30;
            this.errMsg = err.message;
          });
      } else {
        this.page_status = 40;
      }
    },
    toRegister(e) {
      formId(e);
      wx.navigateTo({
        url: "/pages/login/register/index?key=" + this.key
      });
    },
    toIndex(e) {
      formId(e);
      wx.switchTab({
        url: "/pages/club/all/all"
      });
    }
  }
};
</script>
<style>
.tips_wrap {
  width: 750rpx;
  height: 120rpx;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  font-size: 26rpx;
  text-align: center;
  overflow: hidden;
}
.tips_wrap .text {
  margin-top: 22rpx;
  line-height: 40rpx;
}

.confirm_bg {
  width: 466rpx;
  height: 342rpx;
  display: block;
  margin: 34rpx auto 0;
}
.success_bg {
  width: 466rpx;
  height: 362rpx;
  display: block;
  margin: 134rpx auto 0;
}
main .text {
  width: 100%;
  font-size: 30rpx;
  color: #333333;
  text-align: center;
  margin-top: 38rpx;
}
main .text h1 {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
main .text p {
  width: 510rpx;
  margin: 0 auto;
}

.bottomFixed {
  width: 670rpx;
  height: 118rpx;
  background: #ffffff;
  padding: 30rpx 40rpx 0;
  /* display: flex;
  flex-direction: row; */
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  box-shadow: 0px -15px 15px -15px rgba(0, 0, 0, 0.12);
}
.bottomFixed button:after {
  border: 0;
}
.bottomFixed button {
  background: #ffb90c;
  border-radius: 8rpx;
  color: #331900;
  font-size: 30rpx;
  height: 88rpx;
  line-height: 88rpx;
}
</style>

