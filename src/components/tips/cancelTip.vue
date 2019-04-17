
<template>
  <!-- 取消订阅的提示框 -->
  <div>
    <div class="bg"></div>
    <div class="cancel_wrap">
      <div class="cancelBox">
        <img :src="url+'/img/home/pop_guanbi@2x.png'" class="close" @click="close">
        <img :src="url+'/img/competitions/pop_baoming@2x.png'" class="bgImg">
        <div class="tips">
          <p>确认取消发布活动吗？</p>
        </div>
        <div class="btn">
          <span @click="cancelAction">取消</span>
          <span @click="close">再想想</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import common from "@/utils/common";
export default {
  data() {
    return {
      url: common.url
    };
  },
  methods: {
    close() {
      this.$emit("tipsHide", "");
    },
    cancelAction() {
      this.$emit("cancelAction", "");
    }
  }
};
</script>
<style scoped>
.bg {
  width: 100%;
  height: 100vh;
  background: rgba(51, 25, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 100;
}
.cancel_wrap {
  position: fixed;
  top: 200rpx;
  z-index: 100;
  width: 100%;
}
.cancelBox {
  width: 590rpx;
  height: 646rpx;
  background: #fff;
  margin: 0 auto;
  border-radius: 8rpx;
  position: relative;
  overflow: hidden;
}
.close {
  width: 22rpx;
  height: 22rpx;
  position: absolute;
  top: 30rpx;
  right: 30rpx;
}
.bgImg {
  width: 348rpx;
  height: 202rpx;
  display: block;
  margin: 116rpx auto 0;
}
.tips p:first-child {
  font-size: 32rpx;
  color: #333333;
  font-weight: bold;
  text-align: center;
  margin-top: 60rpx;
}
.tips p:nth-child(2) {
  font-size: 24rpx;
  color: #999999;
  text-align: center;
}
.btn {
  margin-top: 56rpx;
  display: flex;
  padding: 0 50rpx;
  justify-content: space-between;
}
.btn span {
  display: block;
  box-sizing: border-box;
  width: 230rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  text-align: center;
  font-size: 28rpx;
  color: #333333;
}
.btn span:first-child {
  background: #f5f5f5;
}
.btn span:nth-child(2) {
  background: #ffb90c;
}
</style>

