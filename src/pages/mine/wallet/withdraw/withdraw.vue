<template>
    <div class="withdraw">
        <div class="withdraw_box">
            <div class="money">
                <!-- <p>提现金额，默认进入微信零钱账户</p> -->
                <div class="input">
                    <span>¥ </span><input type="digit" :value="inputValue" v-on:input = "inputFunc">
                </div>
            </div>
            <div class="tips">
                <i v-show="tipsShow">提现金额超过了账户余额</i>
                <p v-show="!tipsShow">账户余额 {{money}}，<span @click="all">全部提现</span></p>
            </div>
            <div class="btn" @click="withdraw" :class="btnBg">
                <text>提现</text>
            </div>
        </div>
    </div>
</template>
<script>
import { withDraw } from "@/utils/api";
export default {
  data() {
    return {
      money: "",
      inputValue: "",
      tipsShow: false
    };
  },
  onLoad(options) {
    this.money = options.money;
  },
  watch: {
    inputValue(n, o) {
      console.log(n);
      this.$nextTick(() => {
        this.inputValue = String(n).match(
          /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/
        )
          ? n
          : this.inputValue == "" ? "" : o;
      });
    }
  },
  onShow() {
    this.inputValue = "";
    console.log(this.inputValue);
  },
  computed: {
    btnBg() {
      if (this.tipsShow || this.inputValue == 0) {
        return "btnBg";
      } else {
        return "btn";
      }
    }
  },
  methods: {
    all() {
      this.inputValue = this.money;
    },
    inputFunc(e) {
      var value = e.target.value;
      this.inputValue = value;
      if (value < Number(this.money) + 0.01) {
        this.tipsShow = false;
      } else {
        this.tipsShow = true;
      }
    },
    withdraw() {
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      if (!this.tipsShow && this.inputValue > 0) {
        var id = wx.getStorageSync("org_id");
        if (this.inputValue < 100) {
          wx.showModal({
            title:"提示",
            content: "提现金额最小为100元"
          });
        } else if (this.inputValue > 1000) {
          wx.showModal({
            title:"提示",
            content: "提现金额最大为1000元"
          });
        } else {
          withDraw(id, { amount: this.inputValue }, token);
          wx.navigateTo({
            url: "./apply/apply"
          });
        }
      }
    }
  }
};
</script>
<style scoped>
.withdraw_box {
  width: 670rpx;
  /* height: 494rpx; */
  border: 1px solid #e6e6e6;
  border-radius: 20rpx;
  box-sizing: border-box;
  margin: 20rpx 40rpx 0;
  padding: 40rpx 40rpx 60rpx;
}
.withdraw_box .money {
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 30rpx;
}
.withdraw_box .money .input {
  height: 88rpx;
  line-height: 88rpx;
  position: relative;
}
.withdraw_box .money input {
  width: 400rpx;
  display: inline-block;
  height: 88rpx;
  font-size: 66rpx;
  line-height: 88rpx;
  margin-left: 70rpx;
}
.withdraw_box .money p {
  margin-bottom: 50rpx;
  font-size: 26rpx;
  color: #331900;
}
.withdraw_box .money span {
  font-size: 66rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  line-height: 88rpx;
  position: absolute;
  top: 1rpx;
}
.withdraw_box .tips {
  margin-top: 42rpx;
  font-size: 26rpx;
  color: #99958a;
}
.withdraw_box .tips span {
  color: #ccb166;
}
.withdraw_box .tips i {
  color: #ff4c5b;
}
.withdraw_box .btn {
  width: 590rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #ffb90c;
  border-radius: 20rpx;
  box-sizing: border-box;
  text-align: center;
  font-size: 34rpx;
  color: #331900;
  margin-top: 45rpx;
}
.btnBg {
  opacity: 0.3;
}
</style>

