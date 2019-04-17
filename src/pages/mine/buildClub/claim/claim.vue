<template>
    <div class="claim">
        <div class="input">
            <!-- <input type="text" class="in" @focus="claimFocu" @blur="claimBlu" v-model="claimName" :value="claimName"> -->
            <text class="in">{{clubName}}</text>
        </div>

        <div class="tips">
            <p>没有找到你搜索的社团,快去创建吧</p>
        </div>

        <div class="next" @click="toClubInfo" :class="btnBg">
            <span>创建社团</span>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex"
export default {
  data() {
    return {
      claimFocus: true,
      claimName: "音乐社",
      tipsShow: false
    };
  },
  computed: {
    ...mapState(["clubName"]),
    btnBg() {
      if (this.claimName == "") {
        return "btnBg";
      } else {
        return "btn";
      }
    }
  },
  methods: {
    claimFocu() {
      this.claimFocus = false;
    },
    claimBlu() {
      this.claimName == ""
        ? (this.claimFocus = true)
        : (this.claimFocus = false);
    },
    toClubInfo() {
      if (this.claimName) {
        wx.navigateTo({
          url: "./../clubInfo/clubInfo"
        });
      }
    }
  }
};
</script>
<style>
.claim {
  padding: 60rpx 40rpx 0;
}
.claim .input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
}
.claim .in {
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  color: #ccc7b8;
  padding-left: 40rpx;
  font-size: 28rpx;
  display: block;
  line-height: 88rpx;
}
.claim .claimNumber {
  position: absolute;
  height: 27rpx;
  top: 42%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}

.tips {
  margin-top: 30rpx;
  color: #99958a;
  font-size: 22rpx;
  margin-left: 40rpx;
}

.next {
  position: fixed;
  bottom: 98rpx;
  width: 670rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #ffb90c;
  text-align: center;
  line-height: 88rpx;
}
.next span {
  font-size: 28rpx;
  color: #331900;
}

.btnBg {
  opacity: 0.2;
}
</style>

