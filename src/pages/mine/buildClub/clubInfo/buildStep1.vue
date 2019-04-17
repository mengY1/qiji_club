<template>
  <div>
    <div class="logo">
      <img :src="logo" @click="logoUpload">
      <div class="title">
        <span></span>
        <span>社团logo</span>
      </div>
    </div>
    <main>
      <div class="main-item" v-if="title">
        <div class="main-title">
          <span></span>
          <span>社团名称(同一学校不允许出现同名社团，不可修改)</span>
        </div>
        <div class="main-input">
          <!-- <input type="text" v-model="name" :value="name"> -->
          <text class="txt" style="background:#ccc7b8" v-model="name">{{name}}</text>
        </div>
      </div>
      <div class="main-item" v-else-if="status=='xiugai'||status=='woyao'">
        <div class="main-title">
          <span></span>
          <span>社团名称(不可修改)</span>
        </div>
        <div class="main-input">
          <!-- <input type="text" v-model="name" :value="name"> -->
          <text class="txt" style="background:#ccc7b8" v-model="name">{{name}}</text>
        </div>
      </div>
      <div class="main-item" v-else>
        <div class="main-title">
          <span></span>
          <span>社团名称(不可修改)</span>
        </div>
        <div class="main-input">
          <!-- <input type="text" v-model="name" :value="name"> -->
          <text class="txt" style="background:#ccc7b8">{{name}}</text>
        </div>
      </div>

      <div class="main-item">
        <div class="main-title">
          <span></span>
          <span>社团类型</span>
        </div>
        <div class="main-input">
          <picker :range="typeArr" :value="type" @change="bindPickerChange">
            <text class="inputPicker">{{typeStr}}</text>
            <span class="placeHolder" v-if="!typeStr">请选择社团类型</span>
            <img :src="url+'/img/home/but_gengduo@2x.png'" alt="" class="more">
          </picker>
          <p v-show="typeTips">请选择社团类型</p>
        </div>
      </div>

      <div class="main-item">
        <div class="main-title">
          <span style="display:none"></span>
          <span>社团口号</span>
        </div>
        <div class="main-input">
          <input type="text" maxlength="25" placeholder="25字以内" v-model="summary" :value="summary">
          <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" v-show="summary" @click="clear">
        </div>
      </div>
      <div class="main-item">
        <div class="main-title">
          <span></span>
          <span>社团简介</span>
        </div>
        <div class="main-input">
          <textarea class="introduce" type="text" maxlength="500" placeholder="500字以内" v-model="introduction" :value="introduction"></textarea>
          <p v-show="introductionTips">请输入社团简介</p>
        </div>
      </div>
    </main>

    <footer>
      <form @submit="submit" report-submit='true'>
        <div>
          <button class="submit" form-type="submit" :class="btnBg">下一步</button>
        </div>
      </form>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import { types, claims_id, clubDetails } from "@/utils/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      url: common.url,
      status: "", //reset为重新提交状态
      name: "",
      logo: common.url + "img/home/shangchuanlogo@2x.jpg",
      logoStr: "", //上传的logo(相对路径)
      type: "",
      typeArr: "", //社团类型数组
      typeStr: "", //用户选择的社团类型名字
      typeTips: false, //社团类型的提醒
      summary: "", //社团口号
      introduction: "", //社团简介
      introductionTips: false, //社团简介提示
      org_claim_id: "",
      org_id: ""
    };
  },
  onLoad(options) {
    this.name = options.org_name ? options.org_name : "";
    this.logo = this.url + "img/home/shangchuanlogo.png";
    this.logoStr = "";
    this.type = "";
    this.typeTips = false;
    this.summary = "";
    this.introduction = "";
    this.introductionTips = false;
    this.getType();
    this.status = options.status ? options.status : "";
    if (this.status == "reset") {
      this.org_claim_id = options.org_claim_id;
      this.getResetInfo();
    } else if (this.status == "woyao") {
      this.org_id = options.org_id;
      this.getClaimInfo();
    }
  },
  computed: {
    btnBg() {
      if (this.name && this.type >= 0 && this.introduction && this.logoStr) {
        return "";
      } else {
        return "btnBg";
      }
    },
    test() {
      if (this.introduction.length > 0) {
        this.introductionTips = false;
      }
    }
  },
  methods: {
    clear() {
      this.summary = "";
    },
    //logo上传
    logoUpload() {
      var that = this;
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      // if (this.status == "xiugai") {}
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // wx.showToast({
          //   title: "正在上传", //提示的内容,
          //   mask: true, //显示透明蒙层，防止触摸穿透,
          //   duration: 100000000,
          //   image: "/static/images/test.gif",
          //   success: res => {}
          // });
          wx.showLoading({
            title: "正在上传", //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          that.logo = res.tempFilePaths[0];
          that.logoStr = res.tempFilePaths[0];
          wx.uploadFile({
            url: common.testInterface + "upload/img",
            filePath: that.logo,
            name: "image",
            header: {
              Authorization: "Bearer" + token,
              "X-Requested-With": "XMLHttpRequest" // 默认值
            },
            success: function(res) {
              wx.hideLoading();
              if (res.statusCode == 422) {
                that.logoStr = "";
                that.logo = that.url + "img/home/shangchuanlogo.png";
                wx.showModal({
                  title: "提示",
                  content: "图片只支持 jpg/png/jpeg 格式，请检查重新上传"
                });
              } else {
                that.logo = that.url + res.data;
                that.logoStr = res.data;
              }
              console.log(111, that.logo);

              // that.$emit("logoUpload", that.logo);
              // that.logo = that.url + that.logo;
            }
          });
        },
        fail: function(res) {
          wx.hideLoading();
        }
      });
    },
    //获取社团类型
    getType() {
      types().then(res => {
        this.typeArr = [];
        for (var i = 0; i < res.data.length; i++) {
          this.typeArr.push(res.data[i].name);
        }
        this.typeStr = this.typeArr[this.type - 1];
        console.log(this.typeStr);
      });
    },
    //选择社团类型
    bindPickerChange(e) {
      this.type = Number(e.target.value);
      this.typeStr = this.typeArr[this.type];
      this.typeTips = false;
      console.log(this.type, "社团类型");
    },
    //获取重新提交的信息
    getResetInfo() {
      claims_id(this.org_claim_id).then(res => {
        wx.setStorageSync("getResetData", res);
        this.name = res.name;
        this.type = res.type - 1;
        this.typeStr = this.typeArr[this.type];
        this.summary = res.summary;
        this.introduction = res.introduction;
        this.logo = this.url + res.logo;
        this.logoStr = res.logo;
      });
    },
    //获取认领的信息
    getClaimInfo() {
      clubDetails(this.org_id).then(res => {
        wx.setStorageSync("getClaimData", res);
        this.name = res.name;
        this.type = res.org_type - 1;
        this.typeStr = this.typeArr[this.type];
        this.summary = res.summary;
        this.introduction = res.introduction;
        if (res.logo) {
          this.logo = this.url + res.logo;
          this.logoStr = res.logo;
        }
      });
    },
    submit(e) {
      formId(e);
      if (common.status === "dev") {
        wx.reportAnalytics("create_org_click", {
          step: "创建社团第一步"
        });
      }
      if (typeof this.type != "number") {
        this.typeTips = true;
      }
      if (!this.introduction) {
        this.introductionTips = true;
      }
      if (this.type >= 0 && this.introduction && this.logoStr) {
        var buildData = {
          name: this.name,
          logo: this.logoStr,
          type: Number(this.type) + 1,
          summary: this.summary,
          introduction: this.introduction
        };
        wx.setStorageSync("buildData", buildData);
        wx.navigateTo({
          url:
            this.status == "reset"
              ? "./buildStep2?status=reset"
              : this.status == "woyao"
                ? "./buildStep2?status=woyao&org_id=" + this.org_id
                : "./buildStep2"
        });
      }
    }
  }
};
</script>
<style scoped>
.logo {
  padding: 40rpx 254rpx 0;
}
.logo img {
  width: 242rpx;
  height: 242rpx;
  border-radius: 20rpx;
}

.logo .title {
  position: relative;
}
.logo .title span:first-child {
  display: inline-block;
  width: 10rpx;
  height: 10rpx;
  background: #ff4c5b;
  border-radius: 50%;
  position: absolute;
  top: 26rpx;
  left: 50rpx;
}
.logo .title span:nth-child(2) {
  font-size: 26rpx;
  color: #331900;
  padding-left: 74rpx;
}

main {
  padding: 40rpx;
}
.main-item {
  padding-top: 30rpx;
}
.main-item .main-title {
  margin-top: 30rpx;
  position: relative;
}
.main-item .main-title span:first-child {
  display: inline-block;
  width: 10rpx;
  height: 10rpx;
  background: #ff4c5b;
  border-radius: 50%;
  position: absolute;
  top: 26rpx;
  left: 0;
}
.main-item .main-title span:nth-child(2) {
  margin-left: 24rpx;
  color: #331900;
  font-size: 26rpx;
}
.main-item .main-input {
  margin-top: 30rpx;
  position: relative;
}
.main-item .main-input .placeHolder {
  position: absolute;
  top: 0rpx;
  left: 38rpx;
  line-height: 88rpx;
  color: #818181;
  font-size: 26rpx;
}
.main-item .main-input .txt {
  display: block;
  line-height: 88rpx;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  font-size: 26rpx;
  color: #331900;
  padding-left: 44rpx;
}
.main-item .main-input input {
  background: #f5f5f5;
  height: 88rpx;
  border-radius: 44rpx;
  line-height: 88rpx;
  font-size: 26rpx;
  color: #331900;
  padding-left: 40rpx;
  padding-right: 100rpx;
}
.main-item .main-input picker {
  position: relative;
}
.main-item .main-input picker .more {
  position: absolute;
  width: 14rpx;
  height: 26rpx;
  right: 40rpx;
  top: 30rpx;
}
.main-item .main-input .inputPicker {
  background: #f5f5f5;
  height: 88rpx;
  display: block;
  border-radius: 44rpx;
  line-height: 88rpx;
  font-size: 26rpx;
  color: #331900;
  padding-left: 40rpx;
}
.main-item .main-input p {
  font-size: 22rpx;
  margin-top: 8rpx;
  color: #ff4c5b;
  padding-left: 40rpx;
}
.main-item .main-input .closeIcon {
  position: absolute;
  top: 30rpx;
  right: 40rpx;
  width: 26rpx;
  height: 26rpx;
  z-index: 5;
}
.main-item .main-input .introduce {
  height: 270rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  width: 590rpx;
  padding: 31rpx 40rpx;
  font-size: 26rpx;
}

.main-item:nth-child(5) .main-title span:first-child {
  display: none;
}
.main-item:nth-child(5) .main-title span:nth-child(2) {
  margin-left: 0;
}
.main-item:nth-child(6) .main-title span:first-child {
  display: none;
}
.main-item:nth-child(6) .main-title span:nth-child(2) {
  margin-left: 0;
}
.main-item .tips {
  font-size: 22rpx;
  color: #ccc7b8;
  margin-left: 24rpx;
}
.main-item:nth-child(8) .main-title span:first-child {
  display: none;
}
.main-item:nth-child(8) .main-title span:nth-child(2) {
  margin-left: 0;
}
.main-item:nth-child(8) .tips {
  margin: 0;
}

footer {
  padding: 0rpx 40rpx 40rpx;
}
footer .submit {
  background: #ffb90c;
  text-align: center;
  line-height: 88rpx;
  font-size: 28rpx;
  color: #331900;
  border-radius: 44rpx;
}
.btnBg {
  opacity: 0.3;
}
.showBox {
  text-align: center;
  width: 100%;
  position: fixed;
  top: 600rpx;
}
</style>

