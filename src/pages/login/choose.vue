<template>
    <div>
        <div class="title">
            <p>选择你的身份</p>
        </div>
        <main>
            <div class="chooseBox_wrap">
                <div class="chooseBox" style="margin-right:160rpx" @click="chooseAction" :data-id="1">
                    <img :src="url+'/img/home/shezhangyonghu(2).png'" :class="{'chooseImg':id == 1}">
                    <div class="bottom_wrap">
                        <img :src="url+'/img/home/xuanzhe.png'" v-show="id==1">
                        <span>社长用户</span>
                    </div>
                </div>
                <div class="chooseBox" @click="chooseAction" :data-id="2">
                    <img :src="url+'/img/home/gerenyonghu (2).png'" :class="{'chooseImg':id == 2}">
                    <div class="bottom_wrap">
                        <img :src="url+'/img/home/xuanzhe.png'" v-show="id==2">
                        <span>个人用户</span>
                    </div>
                </div>
            </div>

            <div class="next">
                <span @click="next">下一步</span>
            </div>
        </main>
    </div>
</template>
<script>
import url from "@/utils/common";
export default {
  data() {
    return {
      url: url.url,
      id: 1 //1默认选择社长，2选择个人
    };
  },
  onLoad() {
    //如果选择了身份就直接跳到注册页面
    // if (wx.getStorageSync("registerStatus")) {
    //   wx.redirectTo({
    //     url: "/pages/login/register/index"
    //   });
    // }
  },
  computed: {
    chooseImg() {
      if (this.id == 1) {
        return "chooseImg";
      } else if (this.id == 2) {
        return "chooseImg";
      }
    }
  },
  methods: {
    chooseAction(e) {
      var id = e.currentTarget.dataset.id;
      this.id = id;
      console.log(this.id);
    },
    next() {
      if (this.id == 1) {
        wx.setStorageSync("registerStatus", "president");
        wx.navigateTo({
          url: "/pages/login/register/index"
        });
      } else {
        wx.setStorageSync("registerStatus", "personal");
        wx.navigateTo({
          url: "/pages/login/register/index"
        });
      }
    }
  }
};
</script>
<style scoped>
.title p {
  margin-top: 30rpx;
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
  text-align: center;
}

main .chooseBox_wrap {
  margin-top: 134rpx;
  box-sizing: border-box;
  padding: 0 152rpx;
  overflow: hidden;
}
main .chooseBox_wrap .chooseBox {
  float: left;
}
main .chooseBox_wrap .chooseBox > img {
  width: 142rpx;
  height: 200rpx;
  opacity: 0.4;
}
main .chooseBox_wrap .chooseBox .chooseImg {
  opacity: 1;
}
main .chooseBox_wrap .chooseBox .bottom_wrap {
  margin-top: 22rpx;
  font-size: 28rpx;
  color: #333333;
  font-weight: bold;
}
main .chooseBox_wrap .chooseBox .bottom_wrap img {
  width: 20rpx;
  height: 15rpx;
}
main .chooseBox_wrap .chooseBox .bottom_wrap span {
  margin-left: 10rpx;
}
main .next {
  margin-top: 84rpx;
}
main .next span {
  display: block;
  width: 670rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  background: #ffb90c;
  font-size: 28rpx;
  color: #331900;
  text-align: center;
  margin: 0 auto;
}
</style>
