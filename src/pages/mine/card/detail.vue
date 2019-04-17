<template>
  <div>
    <header>
      <div class="header_wrap">
        <div class="logo">
          <img src="http://thyrsi.com/t6/632/1544778507x2890174459.jpg" alt="">
        </div>
        <div class="title">
          <p>计算机管理协会计算机管理协会计算机管理协会计算机管理</p>
        </div>
        <div class="achievement">
          <div class="ach-item">
            <p>900天</p>
            <p>已加入奇集</p>
          </div>
          <div class="ach-item">
            <p>10个</p>
            <p>发布活动</p>
          </div>
          <div class="ach-item">
            <p>909人</p>
            <p>参与了TA的活动</p>
          </div>
          <div class="ach-item">
            <p>900个</p>
            <p>获得粉丝</p>
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="main_wrap">
        <div class="main-item">
          <div class="title">
            <span>社团照片</span>
            <span class="underline"></span>
          </div>
          <div class="content">
            <img v-for="(item,index) in photos" :src="item" :key="index">
          </div>
        </div>
        <div class="main-item">
          <div class="title">
            <span>社团详情</span>
            <span class="underline"></span>
          </div>
          <div class="detail">
            <p>计算机协会成立于2004年10月10日，是学院最具潜力的学生社团之一，也是学院唯一一个科技类社团。协会是由广大的电脑爱好者自发组成，以“学习计算机知识，提高自身素质，相互帮助。</p>
          </div>
        </div>
        <div class="main-item">
          <div class="title">
            <span>社团活动</span>
            <span class="underline"></span>
          </div>
          <div class="act_wrap">
            <div class="act-item" v-for="(item,index) in act" :key="index">
              <img :src="item.img" alt="">
              <div class="act_txt">
                <p>{{item.title}}</p>
                <p>{{item.total}}人已参加</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      photos: ["http://thyrsi.com/t6/632/1544778507x2890174459.jpg"],
      act: [
        {
          img: "http://thyrsi.com/t6/632/1544778507x2890174459.jpg",
          title: "防守端来开发技术大佬开飞机水电费",
          total: 200
        },
        {
          img: "http://thyrsi.com/t6/632/1544778507x2890174459.jpg",
          title: "防守端来开发技术大佬开飞机水电费",
          total: 200
        },
        {
          img: "http://thyrsi.com/t6/632/1544778507x2890174459.jpg",
          title: "防守端来开发技术大佬开飞机水电费",
          total: 200
        }
      ]
    };
  }
};
</script>
<style scoped>
.header_wrap {
  padding: 0 40rpx 24rpx;
  border-bottom: 20rpx solid #f5f5f5;
}
.header_wrap .logo {
  width: 156rpx;
  height: 156rpx;
  margin: 24rpx auto 0;
}
.header_wrap .logo img {
  width: 156rpx;
  height: 156rpx;
}
.header_wrap .title {
  text-align: center;
  margin-top: 18rpx;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 16rpx;
}
.header_wrap .title p {
  font-size: 36rpx;
  color: #332503;
  line-height: 60rpx;
  width: 646rpx;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.header_wrap .achievement {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.header_wrap .achievement .ach-item p:nth-child(1) {
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
  line-height: 60rpx;
}
.header_wrap .achievement .ach-item p:nth-child(2) {
  font-size: 22rpx;
  color: #999999;
  margin-top: -8rpx;
}

.main_wrap .main-item {
  border-bottom: 20rpx solid #f5f5f5;
  padding: 0 40rpx;
}
.main_wrap .main-item:last-child {
  border: 0;
}
.main_wrap .main-item .title {
  position: relative;
  margin-top: 24rpx;
}
.main_wrap .main-item .title > span {
  font-size: 34rpx;
  color: #331900;
  font-weight: bold;
}
.main_wrap .main-item .title .underline {
  position: absolute;
  display: block;
  bottom: 4rpx;
  width: 138rpx;
  height: 8rpx;
  background: #ffb90c;
  left: 0rpx;
  z-index: -1;
}
.main_wrap .main-item .content {
  margin-top: 16rpx;
  padding-bottom: 36rpx;
}
.main_wrap .main-item .content img {
  width: 160rpx;
  height: 160rpx;
  margin-right: 10rpx;
  margin-top: 0rpx;
}
.main_wrap .main-item .content img:nth-child(4n + 4) {
  margin-right: 0;
}
.main_wrap .main-item .detail {
  margin-top: 26rpx;
  font-size: 26rpx;
  color: #99958a;
  line-height: 40rpx;
  padding-bottom: 34rpx;
}
.main_wrap .main-item .act_wrap {
  margin-top: 36rpx;
}
.main_wrap .main-item .act_wrap img {
  width: 670rpx;
  height: 376rpx;
  border-radius: 20rpx;
}
.main_wrap .main-item .act_wrap .act-item {
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 26rpx;
  margin-bottom: 40rpx;
}
.main_wrap .main-item .act_wrap .act-item:last-child {
  border: 0;
  margin-bottom: 0;
}
.main_wrap .main-item .act_wrap .act-item .act_txt p:nth-child(1) {
  font-size: 34rpx;
  color: #331900;
  margin-top: 14rpx;
}
.main_wrap .main-item .act_wrap .act-item .act_txt p:nth-child(2) {
  font-size: 22rpx;
  color: #99958a;
  margin-top: 18rpx;
}
</style>

