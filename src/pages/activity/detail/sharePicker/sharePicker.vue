<template>
  <div v-show="pickerShow">
    <div class="shade"></div>
    <div class="sharePicker" @click="pShow">
      <div class="save" @click="pShow">
        <button class="btn1" open-type="share">分享给好友</button>
        <span class="btn1" @click="paint">海报分享</span>
        <span class="btn1">取消</span>
      </div>
    </div>
  </div>
</template>
<script>
import { actPoster, shareAct } from "@/utils/api";
import url from "@/utils/common";
export default {
  data() {
    return {
      pickerShow: "",
      url: url.url,
      act_id: "",
      img: []
    };
  },
  props: {
    pickerShow: Boolean,
    posterImg: Array
  },
  mounted() {},
  onLoad() {},
  methods: {
    pShow() {
      this.pickerShow = false;
      this.$emit("bgHide",this.pickerShow)
    },
    paint() {
      var that = this;
      this.img = [];
      var act_id = wx.getStorageSync("act_id");
      this.act_id = act_id;
      actPoster(act_id).then(function(res) {
        that.img.push(that.url + res.path);
        wx.previewImage({
          urls: that.img,
          success: res => {
            shareAct(that.act_id);
          },
          fail: res => {
            wx.showToast({
              title: res,
              duration: 2000
            });
          }
        });
      });
    }
  }
};
</script>
<style scoped>
.shade {
  background: #000;
  opacity: 0.1;
  width: 750rpx;
  height: 1450rpx;
  position: fixed;
  top: 0;
}

.sharePicker {
  position: fixed;
  z-index: 888;
  width: 100%;
  height: 1124rpx;
  left: 0;
  bottom: 323rpx;
  right: 0;
  background: rgba(0, 0, 0, 0.1);
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
.btn1 {
  border-bottom: 10rpx solid #eee;
  background: #fff;
}
</style>

