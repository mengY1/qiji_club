<template>
  <div class="clubInfo">
    <div class="logo">
      <img :src="logo" @click="upload">
      <div class="main-title">
        <span></span>
        <span>社团logo</span>
      </div>
    </div>
    <main>
      <!-- <div class="main-item" v-if="title">
        <div class="main-title">
          <span></span>
          <span>社团名称(同一学校不允许出现同名社团，不可修改)</span>
        </div>
        <div class="main-input">
          <text class="txt" style="background:#ccc7b8" v-model="name">{{name}}</text>
        </div>
      </div>
      <div class="main-item" v-else-if="status=='xiugai'||status=='woyao'">
        <div class="main-title">
          <span></span>
          <span>社团名称(不可修改)</span>
        </div>
        <div class="main-input">
          <text class="txt" style="background:#ccc7b8" v-model="name">{{name}}</text>
        </div>
      </div>
      <div class="main-item" v-else>
        <div class="main-title">
          <span></span>
          <span>社团名称(不可修改)</span>
        </div>
        <div class="main-input">
          <text class="txt" style="background:#ccc7b8">{{name}}</text>
        </div>
      </div> -->

      <!-- <div class="main-item" v-if="status=='xiugai'||status=='woyao'">
        <div class="main-title">
          <span></span>
          <span>社团类型(不可修改)</span>
        </div>
        <div class="main-input">
          <picker :range="typeArr" :value="type" @change="bindPickerChange">
            <text class="inputPicker" style="background:#ccc7b8">{{typeStr}}</text>
            <img :src="url+'/img/home/but_gengduo@2x.png'" alt="" class="more">
          </picker>
        </div>
      </div>
      <div class="main-item" v-else>
        <div class="main-title">
          <span></span>
          <span>社团类型</span>
        </div>
        <div class="main-input">
          <picker :range="typeArr" :value="type" @change="bindPickerChange">
            <text class="inputPicker">{{typeStr}}</text>
            <img :src="url+'/img/home/but_gengduo@2x.png'" alt="" class="more">
          </picker>
        </div>
      </div> -->

      <div class="main-item">
        <div class="main-title">
          <span style="display:none"></span>
          <span>社团口号</span>
        </div>
        <div class="main-input">
          <input type="text" maxlength="25" placeholder="25字以内" v-model="summary" :value="summary">
          <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" v-show="summary" @click="clear('summary')">
        </div>
      </div>

      <div class="main-item">
        <div class="main-title">
          <span></span>
          <span>社团公众号</span>
        </div>
        <div class="main-input">
          <input type="text" placeholder="请输入社团公众号" v-model="official_accounts" :value="official_accounts">
          <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" v-show="official_accounts" @click="clear('official_accounts')">
        </div>
      </div>

      <div class="main-item">
        <div class="main-title">
          <span></span>
          <span>社团联系方式</span>
        </div>
        <div class="main-input">
          <input type="number" placeholder="请输入社团联系方式" v-model="phone" :value="phone">
          <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" v-show="phone" @click="clear('phone')" alt="">
        </div>
      </div>

      <div class="main-item">
        <div class="main-title">
          <span></span>
          <span>社团简介</span>
        </div>
        <div class="main-input">
          <textarea class="introduce" type="text" maxlength="500" placeholder="500字以内" v-model="introduction" :value="introduction"></textarea>
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
      </div>
    </main>

    <footer>
      <form @submit="submit" report-submit='true'>
        <div>
          <button class="submit" form-type="submit" :class="btnBg">保存修改</button>
        </div>
      </form>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import {
  claims,
  clubDetails,
  changeClubDetails,
  types,
  claims_id
} from "@/utils/api";
import { mapState } from "vuex";
import url from "@/utils/common";
export default {
  onLoad(options) {
    console.log("onLoad周期");
    this.title = options.title;
    this.id = options.id;
    this.type = options.type;
    console.log(this.type);
    var id = this.id;
    this.org_id = options.org_id;
    var status = options.status; //是否从社团详情跳转过来的
    this.status = status;
    var that = this;
    this.upPhoto = []; //清空之前上传的图片相册
    this.summary = ""; //清空之前的一句话介绍
    this.introduction = ""; //清空简介
    this.phone = ""; //清空phone
    this.official_accounts = ""; //清空公众号id
    this.getPhoto = []; //清空之前获取到的图册
    this.paper = ""; //清空证件照
    this.paperStr = "";
    this.upload_length = this.upPhoto.length + this.getPhoto.length; //默认相册长度
    this.typeArr = [];
    types().then(function(res) {
      for (var i = 0; i < res.data.length; i++) {
        that.typeArr.push(res.data[i].name);
      }
      that.typeStr = that.typeArr[that.type - 1];
      console.log(that.typeStr);
    });
    if (this.org_id) {
      var org_id = wx.getStorageSync("org_id");
      var that = this;
      clubDetails(this.org_id).then(function(res) {
        console.log(res);
        if (res.logo != "") {
          that.logoStr = res.logo;
          that.logo = that.url + res.logo;
          console.log(that.logo, 3323);
        }
      });
    }
    if (id) {
      this.name = this.clubOrgs[id].name;
      this.type = this.clubOrgs[id].org_type;
      this.summary = this.clubOrgs[id].summary;
      this.introduction = this.clubOrgs[id].introduction;
      this.phone = this.clubOrgs[id].phone;
      if (this.clubOrgs[id].logo) {
        this.logo = this.clubOrgs[id].logo;
      } else {
        this.logo = url.url + "/img/default/uploadLogo.png";
      }
      // this.logo = this.clubOrgs[id].logo;
      this.photos = this.clubOrgs[id].photos;
      this.certificate = this.clubOrgs[id].certificate;
      this.org_id = this.clubOrgs[id].org_id;
      this.official_accounts = this.clubOrgs[id].official_accounts;
    } else if (status == "xiugai") {
      //修改社团资料
      this.status = status;
      wx.setNavigationBarTitle({
        title: "修改资料"
      });
      this.getInfo();
      this.upload_length = this.upPhoto.length + this.getPhoto;
    }
  },
  data() {
    return {
      upload_length: 0,
      title: "",
      url: url.url,
      org_claim_id: "",
      id: "",
      logo: url.url + "/img/default/uploadLogo.png",
      name: "",
      type: 0,
      typeArr: [],
      typeStr: "",
      summary: "",
      introduction: "",
      phone: "",
      logoStr: "", //上传的logo(相对路径)
      photos: [],
      paper: "",
      paperStr: "",
      certificate: "",
      official_accounts: "",
      photosArr: [],
      org_id: "",
      status: "",
      // toastShow: false,
      msg: "",
      is_chief: "",
      getPhoto: [], //修改时候获取到的之前的图片
      upPhoto: [], //本地上传的图片
      AllPhoto: [], //修改时候需要上传的图片
      sure: false //确认是否可以提交
    };
  },
  computed: {
    ...mapState(["clubName", "clubOrgs"]),
    btnBg() {
      if (this.getPhoto.length > 0 || this.upPhoto.length > 0) {
        if (this.name && this.type >= 0 && this.introduction && this.logoStr) {
          return "";
        }
      } else {
        return "btnBg";
      }
    }
  },
  watch() {
    this.upload_length;
  },
  mounted() {},
  methods: {
    clear(name) {
      if (name == "summary") {
        this.summary = "";
      } else if (name == "official_accounts") {
        this.official_accounts = "";
      } else if (name == "phone") {
        this.phone = "";
      }
    },
    bindPickerChange(e) {
      if (this.status != "woyao" && this.status != "xiugai") {
        this.type = Number(e.target.value);
        this.typeStr = this.typeArr[this.type];
      }
    },
    //logo上传
    upload() {
      var that = this;
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      wx.showLoading({
        title: "加载中", //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      // if (this.status == "xiugai") {}
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
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
                that.logo = that.url + "/img/default/uploadLogo.png";
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
    //证件上传
    paperLoad() {
      var that = this;
      wx.showLoading({
        title: "加载中", //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
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
              }
            }
          });
        },
        fail: function(res) {
          wx.hideLoading();
        }
      });
    },
    // 获取社团详情信息
    async getInfo() {
      var that = this;
      var org_id = wx.getStorageSync("org_id");
      this.org_id = org_id;
      let details = await clubDetails(org_id);
      this.name = details.name;
      if (details.logo) {
        this.logo = this.url + details.logo;
        this.logoStr = details.logo;
      } else {
        this.logo = this.url + "/img/default/uploadLogo.png";
      }
      this.summary = details.summary;
      this.introduction = details.introduction;
      this.phone = details.phone;
      this.official_accounts = details.official_accounts;
      this.getPhoto = details.photos; //获取以前的图片相册
      this.type = details.org_type;
      this.is_chief = details.is_chief;
      this.upload_length = details.photos.length;
      console.log(this.getPhoto);
    },
    //修改社团资料
    changeClub(e) {
      var that = this;
      var that = this;
      var type = Number(that.type);
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      // 如果用户还需上传图片
      if (that.upPhoto.length > 0) {
        that.AllPhoto = that.getPhoto;
        let length = that.getPhoto.length; //保留获取到的图片长度
        wx.showLoading({
          title: "加载中", //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        for (let i = 0; i < that.upPhoto.length; i++) {
          console.log(i);
          wx.uploadFile({
            url: common.testInterface + "upload/img",
            filePath: that.upPhoto[i],
            name: "image",
            header: {
              Authorization: "Bearer" + token,
              "X-Requested-With": "XMLHttpRequest" // 默认值
            },
            success: function(res) {
              that.AllPhoto.push(res.data);
              let data1 = {
                summary: that.summary,
                introduction: that.introduction,
                phone: String(that.phone),
                photos: that.AllPhoto,
                official_accounts: String(that.official_accounts),
                logo: that.logoStr
              };
              console.log(that.getPhoto, 472);
              //如果所有要上传图片的长度等于获取到的图片长度加上要上传的图片长度(所有图片上传完成)
              if (that.AllPhoto.length == length + that.upPhoto.length) {
                wx.hideLoading();
                console.log(6666666);
                changeClubDetails(that.org_id, data1, token)
                  .then(function(res) {
                    console.log(res);
                    formId(e);
                    setTimeout(() => {
                      wx.reLaunch({
                        url: "../../../mine/index"
                      });
                    }, 500);
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
            }
          });
        }
      } else {
        //用户不再上传图片，默认以前的相册上传
        let data = {
          summary: that.summary,
          introduction: that.introduction,
          phone: String(that.phone),
          photos: that.getPhoto,
          official_accounts: String(that.official_accounts),
          logo: that.logoStr
        };
        changeClubDetails(that.org_id, data, token).then(function(res) {
          console.log(res);
          formId(e);
          setTimeout(() => {
            wx.reLaunch({
              url: "../../../mine/index"
            });
          }, 500);
        });
        that.upPhoto = [];
      }
    },
    submit(e) {
      var that = this;
      var type = Number(that.type);
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      console.log(typeof this.type);
      console.log(typeof this.type == "number");
      if (!this.logoStr) {
        wx.showModal({
          title: "提示",
          content: "请上传logo"
        });
      } else if (typeof this.type != "number") {
        wx.showModal({
          title: "提示",
          content: "请选择社团类型"
        });
      } else if (!this.introduction) {
        wx.showModal({
          title: "提示",
          content: "请输入社团简介"
        });
      } else if (this.getPhoto.length <= 0 && this.upPhoto.length <= 0) {
        wx.showModal({
          title: "提示",
          content: "请上传社团照片"
        });
      }
      //如果获取的图片相册长度或者上传的图片长度>0
      if (this.getPhoto.length > 0 || this.upPhoto.length > 0) {
        if (this.name && this.type >= 0 && this.introduction && this.logoStr) {
          if (this.status == "xiugai") {
            this.changeClub(e);
          }
        }
      }
    },
    listShow() {
      var that = this;
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
      this.upload_length = this.getPhoto.length + this.upPhoto.length;
    },
    deleteImg2: function(e) {
      var imgs = this.upPhoto;
      var index = e.currentTarget.dataset.id;
      imgs.splice(index, 1);
      this.upPhoto = imgs;
      console.log(this.upPhoto, "up");
      this.upload_length = this.getPhoto.length + this.upPhoto.length;
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
.logo .main-title {
  position: relative;
  margin-top: 0rpx;
}
.logo .main-title span:first-child {
  display: inline-block;
  width: 10rpx;
  height: 10rpx;
  background: #ff4c5b;
  border-radius: 50%;
  position: absolute;
  top: 26rpx;
  left: 50rpx;
}
.logo .main-title span:nth-child(2) {
  font-size: 26rpx;
  color: #331900;
  margin-left: 74rpx;
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
.main-item .main-input picker {
  position: relative;
}
.main-item .main-input picker .more {
  position: absolute;
  width: 14rpx;
  height: 26rpx;
  top: 30rpx;
  right: 40rpx;
}
.closeIcon {
  position: absolute;
  top: 30rpx;
  right: 40rpx;
  width: 26rpx;
  height: 26rpx;
  z-index: 5;
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
.main-item .main-input .introduce {
  height: 270rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  width: 590rpx;
  padding: 31rpx 40rpx;
  font-size: 26rpx;
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
  padding: 8rpx 40rpx 40rpx;
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
