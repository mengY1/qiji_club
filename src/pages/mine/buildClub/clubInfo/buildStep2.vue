<template>
  <div>
    <main>
      <div class="main-item">
        <div class="main-title">
          <span style="display:none"></span>
          <span>社团公众号</span>
        </div>
        <div class="main-input">
          <input type="text" placeholder="请输入社团公众号" v-model="official_accounts" :value="official_accounts">
          <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" v-show="official_accounts" @click="clear('official_accounts')">
        </div>
      </div>
      <div class="main-item">
        <div class="main-title">
          <span style="display:none"></span>
          <span>社团联系方式</span>
        </div>
        <div class="main-input">
          <input type="number" placeholder="请输入社团联系方式" v-model="phone" :value="phone">
          <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" v-show="phone" @click="clear('phone')">
        </div>
      </div>
      <div class="main-item">
        <div class="main-title">
          <span></span>
          <span>社团照片</span>
        </div>
        <p class="tips">上传真实的活动照片会更容易的通过我们的审核哦</p>
        <div class="upload">
          <div class="uploadBox" v-for="(item,index) in getPhoto" :key="index">
            <img :src="url+item">
            <img class="deleteIcon" :src="url+'/img/default/delete.png'" @click="deleteImg1" :data-id="index">
          </div>
          <div class="uploadBox" v-for="(item,index) in upPhoto" :key="index">
            <img :src="item" alt="">
            <img class="deleteIcon" :src="url+'/img/default/delete.png'" @click="deleteImg2" :data-id="index">
          </div>
          <div class="addBtn" @click="listShow" v-show="upload_length<8">
            <span class="addIcon">+</span>
            <i class="upload_length">{{upload_length}}/8</i>
          </div>
        </div>
        <p class="warning" v-show="photoTips">请上传社团照片</p>
      </div>
      <div class="main-item">
        <div class="main-title">
          <span></span>
          <span>社团证件</span>
          <p class="tips">上传你的社团工作证或者个人学生证，以便审核</p>
        </div>
        <div class="paper">
          <div class="upload">
            <div class="addBtn" @click="paperLoad" v-show="!paper">
              <span class="addIcon" style="top:60rpx">+</span>
            </div>
          </div>
          <p class="warning" v-show="paperTips">请上传证件照</p>
          <img :src="paper" @click="paperLoad">
        </div>
      </div>
    </main>

    <footer>
      <form @submit="submit" report-submit='true'>
        <div>
          <button class="submit" form-type="submit" :class="btnBg">提交审核</button>
        </div>
      </form>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import { claims, userInfo } from "@/utils/api";
export default {
  data() {
    return {
      url: common.url,
      token: "",
      status: "", //reset为重新提交状态
      buildData: "", //第一步的创建信息
      official_accounts: "", //社团公众号id
      phone: "", //社团联系方式
      upPhoto: [], //要上传的相册
      photosArr: [], //要提交给后台的相册
      photoTips: false, //照片未上传的提示
      paper: "", //要上传的证件照
      paperStr: "", //要提交给后台的证件照
      paperTips: false, //证件照未上传的提示
      upload_length: 0,
      org_claim_id: "", //重新提交的id
      getPhoto: [], //修改时候获取到的之前的图片
      allPhoto: [], //修改时候要提交给后台的相册
      org_id: ""
    };
  },
  onLoad(options) {
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    this.buildData = wx.getStorageSync("buildData");
    this.phone = "";
    this.upPhoto = [];
    this.photosArr = [];
    this.getPhoto = [];
    this.allPhoto = [];
    this.paper = "";
    this.paperStr = "";
    this.official_accounts = "";
    console.log(this.buildData);
    this.status = options.status ? options.status : "";
    this.getPhone();
    console.log(this.status);
    if (this.status == "reset") {
      this.getResetInfo();
    } else if (this.status == "woyao") {
      this.org_id = options.org_id;
      this.getClaimInfo();
    }
    this.upload_length = this.upPhoto.length + this.getPhoto.length; //相册长度等于要上传的图片长度加获取到的相册长度，放在获取信息后
  },
  computed: {
    btnBg() {
      if (
        (this.upPhoto.length > 0 || this.allPhoto.length > 0) &&
        this.paperStr
      ) {
        return "";
      } else {
        return "btnBg";
      }
    }
  },
  methods: {
    clear(name) {
      console.log(name);
      if (name == "phone") {
        this.phone = "";
      } else if (name == "official_accounts") {
        this.official_accounts = "";
      }
    },
    //   图片上传
    listShow() {
      var that = this;
      var token = this.token;
      // wx.showActionSheet({
      // itemList: ["上传图片"],
      // success: function(res) {
      // if (res.tapIndex == 0) {
      wx.chooseImage({
        count: 8 - that.upload_length, // 默认9
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          var imgs = that.upPhoto;
          for (var i = 0; i < tempFilePaths.length; i++) {
            if (tempFilePaths.length >= 9 - that.upload_length) {
              that.upPhoto = imgs;
              wx.showToast({
                title: "您的上传数量达到上限",
                icon: "none"
              });
              return false;
            } else {
              imgs.push(tempFilePaths[i]);
            }
          }
          that.photosArr = []; //把要提交给后台的arr先清空，再把所有imgs里的照片push到arr
          for (var i = 0; i < imgs.length; i++) {
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
            wx.uploadFile({
              url: common.testInterface + "upload/img",
              filePath: that.upPhoto[i],
              name: "image",
              header: {
                Authorization: "Bearer" + token,
                "X-Requested-With": "XMLHttpRequest" // 默认值
              },
              success: function(res) {
                console.log(imgs, "上传的图片");
                that.photosArr.push(res.data);
                console.log(that.photosArr.length, that.upPhoto.length);
                if (that.photosArr.length == that.upPhoto.length) {
                  wx.hideLoading();
                  that.photoTips = false;
                }
                console.log(that.photosArr);
              }
            });
          }
          that.upPhoto = imgs;
          that.upload_length = that.upPhoto.length + that.getPhoto.length;
        }
      });
      //   }
      // }
      // });
    },
    deleteImg1: function(e) {
      var imgs = this.getPhoto;
      var index = e.currentTarget.dataset.id;
      imgs.splice(index, 1);
      this.getPhoto = imgs;
      console.log(this.getPhoto, "get");
      this.upload_length = this.upPhoto.length + this.getPhoto.length;
    },
    deleteImg2: function(e) {
      var imgs = this.upPhoto;
      var index = e.currentTarget.dataset.id;
      imgs.splice(index, 1);
      this.photosArr.splice(index, 1);
      this.upPhoto = imgs;
      console.log(this.upPhoto, "up");
      console.log(this.photosArr, "要提交给后台的相册");
      this.upload_length = this.upPhoto.length + this.getPhoto.length;
    },
    //上传证件照
    paperLoad() {
      var that = this;

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
          that.paper = res.tempFilePaths[0];
          wx.uploadFile({
            url: common.testInterface + "upload/img",
            filePath: that.paper,
            name: "image",
            header: {
              Authorization: "Bearer",
              "X-Requested-With": "XMLHttpRequest" // 默认值
            },
            success: function(res) {
              wx.hideLoading();
              if (res.statusCode == 422) {
                that.paper = "";
                that.paperStr = "";
                wx.showModal({
                  title: "提示",
                  content: "图片只支持 jpg/png/jpeg 格式，请检查重新上传"
                });
              } else {
                that.paper = that.url + res.data;
                that.paperStr = res.data;
                that.paperTips = false;
              }
            }
          });
        },
        fail: function(res) {
          wx.hideLoading();
        }
      });
    },
    // 获取手机号码
    getPhone() {
      userInfo({}, this.token).then(res => {
        this.phone = res.account;
      });
    },
    //获取重新提交的信息
    getResetInfo() {
      var data = wx.getStorageSync("getResetData");
      console.log(data);
      this.official_accounts = data.official_accounts;
      this.org_claim_id = data.org_claim_id;
      this.phone = data.phone;
      this.getPhoto = data.photos;
      this.allPhoto = this.getPhoto;
      this.paperStr = data.certificate;
      this.paper = this.url + data.certificate;
    },
    //获取认领社团的信息
    getClaimInfo() {
      var data = wx.getStorageSync("getClaimData");
      console.log(data);
      this.official_accounts = data.official_accounts;
      this.org_claim_id = data.org_claim_id;
      this.phone = data.phone;
      this.getPhoto = data.photos;
      this.allPhoto = this.getPhoto;
      if (data.certificate) {
        this.paperStr = data.certificate;
        this.paper = this.url + data.certificate;
      }
    },
    //创建社团
    toBuild(e) {
      this.buildData.photos = this.photosArr;
      this.buildData.certificate = this.paperStr;
      this.buildData.phone = this.phone;
      this.buildData.official_accounts = this.official_accounts;
      console.log(this.buildData);
      claims(this.buildData, this.token)
        .then(res => {
          wx.setStorageSync("buildData", "");
          wx.setStorageSync("org_claim_id", res.org_claim_id);
          var url = "../apply/apply?id=";
          this.upPhoto = [];
          wx.reLaunch({
            url: url + res.org_claim_id
          });
        })
        .catch(error => {});
    },
    //重新提交
    toReset(e) {
      this.buildData.photos = this.allPhoto;
      this.buildData.certificate = this.paperStr;
      this.buildData.official_accounts = this.official_accounts;
      this.buildData.phone = this.phone;
      console.log(this.allPhoto);
      console.log(this.buildData);
      claims(this.buildData, this.token).then(res => {
        wx.setStorageSync("buildData", "");
        wx.setStorageSync("org_claim_id", res.org_claim_id);
        this.upPhoto = [];
        this.allPhoto = [];
        wx.reLaunch({
          url: "../apply/apply?id=" + res.org_claim_id
        });
      });
    },
    //认领社团
    toClaim(e) {
      this.buildData.photos = this.allPhoto;
      this.buildData.certificate = this.paperStr;
      this.buildData.official_accounts = this.official_accounts;
      this.buildData.phone = this.phone;
      this.buildData.org_id = this.org_id;
      console.log(this.allPhoto);
      console.log(this.buildData, this.org_id);
      claims(this.buildData, this.token).then(res => {
        wx.setStorageSync("buildData", "");
        wx.setStorageSync("org_claim_id", res.org_claim_id);
        this.upPhoto = [];
        this.allPhoto = [];
        wx.reLaunch({
          url: "../apply/apply?id=" + res.org_claim_id
        });
      });
    },
    submit(e) {
      formId(e);
      if (common.status === "dev") {
        wx.reportAnalytics("create_org_click", {
          step: "创建社团第二步"
        });
      }
      this.paperTips = this.paper ? false : true;
      this.photoTips =
        this.photosArr.length > 0 || this.allPhoto.length > 0 ? false : true;
      if (this.status == "reset") {
        this.allPhoto = this.getPhoto.concat(this.photosArr);
        console.log(this.paperStr, this.allPhoto.length);
        if (this.paperStr && this.allPhoto.length > 0) {
          this.toReset(e);
        }
      } else if (this.status == "woyao") {
        this.allPhoto = this.getPhoto.concat(this.photosArr);
        if (this.paperStr && this.allPhoto.length > 0) {
          this.toClaim(e);
        }
      } else {
        if (this.upPhoto.length > 0 && this.paperStr) {
          this.toBuild(e);
        }
      }
    }
  }
};
</script>
<style scoped>
main {
  padding: 40rpx;
}
.main-item {
  padding-top: 30rpx;
}
.main-item:first-child {
  padding: 0;
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
.closeIcon {
  position: absolute;
  top: 30rpx;
  right: 40rpx;
  width: 26rpx;
  height: 26rpx;
  z-index: 5;
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
.main-item .main-input .introduce {
  height: 270rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  width: 590rpx;
  padding: 31rpx 40rpx;
  font-size: 26rpx;
}
.main-item .warning {
  font-size: 22rpx;
  color: #ff4c5b;
  margin-top: 12rpx;
  padding-left: 15rpx;
}
.main-item .paper {
  width: 160rpx;
  height: 160rpx;
  margin-top: 30rpx;
}
.main-item .paper img {
  width: 160rpx;
  height: 160rpx;
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
.upload {
  margin-top: 55rpx;
  overflow: hidden;
}
.upload .uploadBox {
  float: left;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
  position: relative;
}
.upload .uploadBox .deleteIcon {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  background: #ffb90c;
  line-height: 29rpx;
  text-align: center;
  font-size: 30rpx;
  font-weight: bold;
}
.upload .uploadBox:nth-child(4n) {
  margin-right: 0;
}
.upload img {
  width: 160rpx;
  height: 160rpx;
}
.upload video {
  width: 160rpx;
  height: 160rpx;
}
.upload .addBtn {
  width: 160rpx;
  height: 160rpx;
  background: #f5f5f5;
  float: left;
  position: relative;
}
.upload .addBtn .addIcon {
  position: absolute;
  display: block;
  width: 34rpx;
  height: 34rpx;
  border-radius: 50%;
  border: 1px solid #99958a;
  color: #99958a;
  line-height: 31rpx;
  text-align: center;
  left: 63rpx;
  top: 44rpx;
}
.upload .addBtn .upload_length {
  position: absolute;
  top: 92rpx;
  left: 60rpx;
  font-size: 26rpx;
  color: #99958a;
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
  margin-top: 20rpx;
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


