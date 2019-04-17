<template>

     <div v-show="pickerShow"> 
        <div class="shade" ></div>
        <div class="sharePicker" @click="pShow">
            <div class="save">
                <button class="btn1" open-type="share">分享给好友</button>
                <span class="btn1" @click="paint">海报分享</span>
                <span class="btn1">取消</span>
            </div>
        </div>
    </div>
</template>
<script>
import { clubPoster } from "@/utils/api";
import url from "@/utils/common";
export default {
  data() {
    return {
      pickerShow: false,
      url: url.url,
      org_claim_id: "",
      posterImg: []
    };
  },
  props: {
    pickerShow: Boolean
  },
  mounted() {
    this.org_claim_id = wx.getStorageSync("org_claim_id");
    this.org_id = wx.getStorageSync("org_id");
  },
  methods: {
    pShow() {
      this.pickerShow = false;
      this.$emit("childByValue", this.pickerShow);
      console.log(this.pickerShow);
    },
    paint() {
      console.log(1);
      this.pickerShow = false;
      console.log(this.org_claim_id, 3333333);
      clubPoster(this.org_id)
        .then(res => {
          this.posterImg.push(this.url + res.path);
          wx.previewImage({
            urls: this.posterImg,
            success: res => {
              console.log("成功");
              console.log(res);
            },
            fail: res => {
              console.log(res);
              wx.showToast({
                title: res,
                duration: 2000
              });
            }
          });
        })
        .catch(err => {});
    }
  }
};
</script>
<style scoped>
.shade {
  background: #000;
  opacity: 0;
  width: 750rpx;
  height: 1450rpx;
  position: fixed;
  top: 0;
}

.sharePicker {
  position: fixed;
  z-index: 888;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0rpx;
  right: 0;
  background: rgba(0, 0, 0, 0.2);
}
.save {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 36rpx;
  background: #fff;
  color: #333;
  left: 0;
}
.btn1,
.btn2 {
  height: 100rpx;
  line-height: 100rpx;
  color: #000;
  display: block;
}
button::after{
  border:none
}
.btn1 {
  border-bottom: 10rpx solid #eee;
  background: #fff;
}
</style>

