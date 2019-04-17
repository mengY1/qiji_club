<template>
  <div class="changePage">
    <div class="changeContent">
      <textarea @input="bindContent" maxlength="666" v-model="desc" :value="desc" placeholder="目前只支持活动简介的修改，请输入要修改的简介内容">
            </textarea>
      <span>{{changeLength}}/666</span>
    </div>
    <div class="submitBut">
      <button @click="change">提交</button>
    </div>
  </div>
</template>
<script>
import { actIntroduction } from "@/utils/api";
export default {
  data() {
    return {
      changeLength: 0,
      desc: "",
      token: "",
      act_id: ""
    };
  },
  onLoad(options) {
    this.act_id = options.act_id;
    this.desc = "";
  },
  mounted() {
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
  },
  methods: {
    bindContent() {
      this.changeLength = this.desc.length;
    },
    change() {
      if (this.changeLength > 0) {
        actIntroduction(this.act_id, { introduction: this.desc }, this.token)
          .then(res => {
            setTimeout(() => {
              wx.redirectTo({
                url: "../published"
              });
            }, 1000);
          })
          .catch(err => {});
      } else {
        wx.showToast({
          title: "输入内容为空"
        });
      }
    }
  }
};
</script>
<style scoped>
.changePage {
  padding: 40rpx;
}
.changePage .changeContent {
  position: relative;
  font-size: 26rpx;
  color: #99958a;
}
.changePage .changeContent textarea {
  width: 670rpx;
  height: 408rpx;
  box-sizing: border-box;
  background: #f5f5f5;
  border-radius: 8rpx;
  padding:0 40rpx;
  padding-top:34rpx;
}
.changePage .changeContent span {
  position: absolute;
  bottom: 40rpx;
  right: 26rpx;
}
.changePage .submitBut {
  height: 88rpx;
  background: rgba(255, 185, 12, 1);
  border-radius: 44rpx;
  position: fixed;
  bottom: 40rpx;
  width: 670rpx;
}
.changePage .submitBut > button {
  background-color: transparent;
  text-align: center;
  line-height: 88rpx;
  color: #332503;
  font-size: 30rpx;
  border-radius: 44rpx;
  /* margin-top: 65vh; */
}
</style>

