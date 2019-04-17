<template>
  <!-- 旧社长页面 -->
  <div>
    <main>
      <img class="bg" :src="url+'/img/orgapp/1.0.0/mine/old_success.png'" alt="">
      <div class="tips">
        <p>{{userName}}已成功扫码并确认</p>
        <p>{{org_name}}</p>
        <p>已成功转移给TA</p>
      </div>
    </main>
    <footer>
      <div class="bottomFixed">
        <form @submit="toIndex" report-submit="true">
          <button form-type="submit">返回奇集</button>
        </form>
      </div>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import { remove_key } from "@/utils/api";
export default {
  data() {
    return {
      url: common.url,
      key: "",
      org_id: "",
      userName: "",
      org_name: ""
    };
  },
  onLoad(options) {
    this.key = options.key;
    this.getRemoveInfo(options.key);
  },
  methods: {
    getRemoveInfo(key) {
      remove_key(key).then(res => {
        this.org_name = res.data.org_name;
        this.userName = res.data.original_chief_info.realname;
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
.bg {
  width: 408rpx;
  height: 364rpx;
  display: block;
  margin: 212rpx auto 0;
}
.tips {
  text-align: center;
  font-size: 30rpx;
  color: #333333;
  line-height: 36rpx;
  margin-top: 54rpx;
}
.tips p:nth-child(2) {
  color: #576b95;
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

