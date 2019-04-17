<template>
    <div>
        <div class="header">
            
        </div>
        <div class="content">
            <span>申请获取以下权限</span>
            <span>获取你的公开信息(头像，昵称等)</span>
        </div>
        <button class="bottom" type="primary" open-type="getUserInfo" lang="zh_CN" @click="bindGetUserInfo"></button>
    </div>
</template>
<script>
export default {
  mounted() {
    this.testAction();
  },
  methods: {
    testAction() {
      wx.getUserInfo({
        success: function(res) {
          console.log(res);
          wx.setStorageSync("login", {
            encryptedData: res.encryptedData,
            iv: res.iv
          });
        }
      });
    }
  }
};
</script>
<style>
.content {
  margin-left: 50rpx;
  margin-bottom: 90rpx;
}
.content span {
  display: block;
  color: #9d9d9d;
  margin-top: 40rpx;
}
.bottom {
  border-radius: 80rpx;
  margin: 70rpx 50rpx;
  font-size: 35rpx;
}
</style>

