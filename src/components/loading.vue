<template>
<!-- 全局页面加载组件 -->
  <div class="loading">
    <div class="loadingBox">
      <img src="/static/images/test.gif" alt="">
      <p>正在加载</p>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 50;
  background: #fff;
  text-align: center;
  padding: 0 auto;
  top: 0;
}
.loadingBox {
  margin: 444rpx 260rpx 0;
  width: 220rpx;
  height: 220rpx;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20rpx;
  color: #fff;
  box-sizing: border-box;
  text-align: center;
}
.loadingBox img {
  width: 72rpx;
  height: 72rpx;
  margin: 50rpx 0rpx 0;
}
.loadingBox p {
  font-size: 28rpx;
  margin-top: 2rpx;
}
</style>
