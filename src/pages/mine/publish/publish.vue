<template>
  <div class="publish">

    <div class="imgUpBgShow" v-show="imgUpBgShow" @click="bgShowAction">
      <div class="chooseBox">
        <div class="choose-item" @click="toPoster">
          <p>海报模板</p>
        </div>
        <div class="choose-item" @click="imgUpload">
          <p>打开本地相册</p>
        </div>
        <div class="choose-item cancel">
          <p>取消</p>
        </div>
      </div>
    </div>

    <div class="contain">
      <div class="uploadImg_wrap" @click="bgShowAction">
        <div class="upload" v-show="uploadShow">
          <img :src="addImg" :key="addImg" class="addIcon">
          <p>请上传比例为16:9的活动海报大小1M以内</p>
        </div>
        <img :src="uploadImg" class="uploadImg" @click="fsd">
      </div>

      <div class="main-item" style="position:relative">
        <div class="title">
          <span class="redDog"></span>
          <text>活动名称</text>
        </div>
        <div class="main-input">
          <input type="text" v-model="title" placeholder="请输入活动名称" placeholder-style="color:#CCC7B8">
          <img class="closeIcon" v-if="title.length>0" :src="url+'/img/default/common/but_guanbi@2x.png'" alt="" @click="clear('title')">
        </div>
      </div>
      <div class="main-item">
        <div class="title">
          <span class="redDog"></span>
          <text>活动时间</text>
        </div>
        <picker mode="multiSelector" :value="dateTime1" @change="changeDateTime1" @columnchange="changeDateTimeColumn1" :range="dateTimeArray1">
          <div class="minInput">
            <text style="color:#333" v-if="isChange1">{{pushDate1}}</text>
            <text v-else>请输入活动时间</text>
          </div>
        </picker>
        <!-- <picker mode="multiSelector" :value="dateTime2" @change="changeDateTime2" @columnchange="changeDateTimeColumn2" :range="dateTimeArray2">
          <div class="minInput">
            <text style="color:#333" v-if="isChange2">{{pushDate2}}</text>
            <text v-else>结束时间</text>
          </div>
        </picker> -->
      </div>
      <!-- <div class="main-item">
        <div class="title">
          <span class="redDog"></span>
          <text>报名时间</text>
        </div>
        <picker mode="multiSelector" :value="dateTime3" @change="changeDateTime3" @columnchange="changeDateTimeColumn3" :range="dateTimeArray3">
          <div class="minInput">
            <text style="color:#333" v-if="isChange3">{{pushDate3}}</text>
            <text v-else>起始时间</text>
          </div>
        </picker>
        <picker mode="multiSelector" :value="dateTime4" @change="changeDateTime4" @columnchange="changeDateTimeColumn4" :range="dateTimeArray4">
          <div class="minInput">
            <text style="color:#333" v-if="isChange4">{{pushDate4}}</text>
            <text v-else>结束时间</text>
          </div>
        </picker>
      </div> -->
      <div class="main-item">
        <div class="title">
          <span class="redDog"></span>
          <text>活动地点</text>
        </div>
        <div class="main-input">
          <input type="text" v-model="address" placeholder="请输入活动详细地址" placeholder-style="color:#CCC7B8">
          <img class="closeIcon" v-if="address>0" :src="url+'/img/default/common/but_guanbi@2x.png'" alt="" @click="clear('address')">
        </div>
      </div>
      <div class="main-item">
        <div class="title">
          <span class="redDog"></span>
          <text>活动详情</text>
        </div>
        <div style="position:relative">
          <textarea v-show="!imgUpBgShow" class="introduce" maxlength="800" v-model="introduction" placeholder="请输入你的活动简介，注意事项等信息" placeholder-style="color:#CCC7B8"></textarea>
          <span class="introduction_length">{{introduction.length}}/800</span>
        </div>
      </div>
    </div>
    <footer>
      <form @submit="toApply" report-submit='true'>
        <div class="submit">
          <div>
            <button class="btn" form-type="submit">提交</button>
          </div>
        </div>
      </form>
    </footer>
  </div>
</template>
<script>
import { toTime } from "@/utils/changeTime";
import { dateTimePicker, getMonthDay } from "@/utils/dateTimePicker";
import common from "@/utils/common";
import { formId } from "@/utils/common";
import url from "@/utils/common";
import { issue, detailInfo, again } from "@/utils/api";
export default {
  data() {
    return {
      imgUpBgShow: false,
      uploadImg: "",
      url: url.url,
      token: " ",
      uploadShow: true,
      photos: [],
      photosArr: [],
      // 携带上去的信息
      title: "",
      address: "",
      cover: "",
      introduction: "",
      activity_start_at: "起始时间",
      activity_expire_at: "结束时间",
      enrol_start_at: "起始时间",
      enrol_expire_at: "结束时间",
      act_id: "",
      index: "",
      isChange1: false,
      isChange2: false,
      isChange3: false,
      isChange4: false,
      testNum: 0, //防止重复提交
      //时间控件
      dateTimeArray1: null,
      dateTime1: null,
      dateTimeArray2: null,
      dateTime2: null,
      dateTimeArray3: null,
      dateTime3: null,
      dateTimeArray4: null,
      dateTime4: null,
      pushDate1: "",
      pushDate2: "",
      pushDate3: "",
      pushDate4: "",
      startYear: 2000,
      endYear: 2050,
      addImg: url.url + "/img/default/add.png"
    };
  },
  onShow() {
    this.testNum = 0;
    if (wx.getStorageSync("actPoster")) {
      this.cover = wx.getStorageSync("actPoster");
      this.uploadImg = this.url + wx.getStorageSync("actPoster");
      this.uploadShow = false;
    }
  },
  onLoad(options) {
    wx.removeStorageSync("actPoster");
    this.imgUpBgShow = false;
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    this.index = 0;
    this.isChange1 = false;
    this.isChange2 = false;
    this.isChange3 = false;
    this.isChange4 = false;
    this.index = "";
    this.pushDate1 = "";
    this.pushDate2 = "";
    this.pushDate3 = "";
    this.pushDate4 = "";
    if (options.act_id) {
      this.act_id = options.act_id;
      var that = this;
      detailInfo(this.act_id).then(function(res) {
        that.uploadImg = that.url + res.cover;
        that.cover = res.cover;
        that.uploadShow = false;
        that.title = res.title;
        that.activity_start_at = res.activity_start_at.slice(0, 16);
        that.activity_expire_at = res.activity_expire_at.slice(0, 16);
        that.enrol_start_at = res.enrol_start_at.slice(0, 16);
        that.enrol_expire_at = res.enrol_expire_at.slice(0, 16);
        that.pushDate1 = res.activity_start_at.slice(0, 16);
        that.pushDate2 = res.activity_expire_at.slice(0, 16);
        that.pushDate3 = res.enrol_start_at.slice(0, 16);
        that.pushDate4 = res.enrol_expire_at.slice(0, 16);
        that.isChange1 = true;
        that.isChange2 = true;
        that.isChange3 = true;
        that.isChange4 = true;
        that.address = res.address;
        that.introduction = res.introduction;
      });
    } else {
      this.act_id = "";
      this.uploadImg = "";
      this.cover = "";
      this.uploadShow = true;
      this.title = "";
      this.activity_start_at = "起始时间";
      this.activity_expire_at = "结束时间";
      this.enrol_start_at = "起始时间";
      this.enrol_expire_at = "结束时间";
      this.address = "";
      this.introduction = "";
    }
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj1 = dateTimePicker(this.startYear, this.endYear);
    var obj2 = dateTimePicker(this.startYear, this.endYear);
    var obj3 = dateTimePicker(this.startYear, this.endYear);
    var obj4 = dateTimePicker(this.startYear, this.endYear);
    // 精确到分的处理，将数组的秒去掉
    obj1.dateTimeArray.pop();
    obj1.dateTime.pop();
    obj2.dateTimeArray.pop();
    obj2.dateTime.pop();
    obj3.dateTimeArray.pop();
    obj3.dateTime.pop();
    obj4.dateTimeArray.pop();
    obj4.dateTime.pop();
    this.dateTimeArray1 = obj1.dateTimeArray;
    this.dateTime1 = obj1.dateTime;
    this.dateTimeArray2 = obj2.dateTimeArray;
    this.dateTime2 = obj2.dateTime;
    this.dateTimeArray3 = obj3.dateTimeArray;
    this.dateTime3 = obj3.dateTime;
    this.dateTimeArray4 = obj4.dateTimeArray;
    this.dateTime4 = obj4.dateTime;
  },
  methods: {
    clear(name) {
      if (name == "title") {
        this.title = "";
      } else if (name == "address") {
        this.address = "";
      }
    },
    changeDateTime1(e) {
      this.isChange1 = true;
      this.dateTime1 = e.target.value;
      this.pushDate1 = toTime(this.dateTime1);
      //让剩余三个时间默认和第一个相同
      // this.isChange2 = true;
      // this.pushDate2 = this.pushDate1
      // this.isChange3 = true;
      // this.pushDate3 = this.pushDate1;
      // this.isChange4 = true;
      // this.pushDate4 = this.pushDate1
    },
    changeDateTimeColumn1(e) {
      var arr = this.dateTime1,
        dateArr = this.dateTimeArray1;
      arr[e.target.column] = e.target.value;
      dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      this.dateTimeArray1 = dateArr;
      this.dateTime1 = arr;
      this.isChange1 = true;
      this.pushDate1 = toTime(this.dateTime1);
      this.$forceUpdate();
    },
    changeDateTime2(e) {
      this.isChange2 = true;
      this.dateTime2 = e.target.value;
      this.pushDate2 = toTime(this.dateTime2);
    },
    changeDateTimeColumn2(e) {
      var arr = this.dateTime2,
        dateArr = this.dateTimeArray2;
      arr[e.target.column] = e.target.value;
      dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      this.dateTimeArray2 = dateArr;
      this.dateTime2 = arr;
      this.isChange2 = true;
      this.pushDate2 = toTime(this.dateTime2);
      this.$forceUpdate();
    },
    changeDateTime3(e) {
      this.isChange3 = true;
      this.dateTime3 = e.target.value;
      this.pushDate3 = toTime(this.dateTime3);
    },
    changeDateTimeColumn3(e) {
      var arr = this.dateTime3,
        dateArr = this.dateTimeArray3;
      arr[e.target.column] = e.target.value;
      dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      this.dateTimeArray3 = dateArr;
      this.dateTime3 = arr;
      this.isChange3 = true;
      this.pushDate3 = toTime(this.dateTime3);
      this.$forceUpdate();
    },
    changeDateTime4(e) {
      this.isChange4 = true;
      this.dateTime4 = e.target.value;
      this.pushDate4 = toTime(this.dateTime4);
    },
    changeDateTimeColumn4(e) {
      var arr = this.dateTime4,
        dateArr = this.dateTimeArray4;
      arr[e.target.column] = e.target.value;
      dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      this.dateTimeArray4 = dateArr;
      this.dateTime4 = arr;
      this.isChange4 = true;
      this.pushDate4 = toTime(this.dateTime4);
      this.$forceUpdate();
    },
    bgShowAction() {
      this.imgUpBgShow = !this.imgUpBgShow;
    },
    toPoster() {
      wx.navigateTo({
        url: "./poster"
      });
    },
    imgUpload() {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          that.uploadImg = res.tempFilePaths;
          that.cover = "";
          that.uploadShow = false;
          wx.showLoading({
            title: "正在上传", //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          wx.uploadFile({
            url: common.testInterface + "upload/img",
            filePath: that.uploadImg[0],
            name: "image",
            header: {
              Authorization: "Bearer" + that.token,
              "X-Requested-With": "XMLHttpRequest" // 默认值
            },
            success: function(res) {
              wx.removeStorageSync("actPoster");
              that.cover = res.data;
              wx.hideLoading();
            },
            fail: function(res) {
              wx.hideLoading();
              that.uploadShow = true;
            }
          });
        }
      });
    },
    toApply(e) {
      var that = this;
      if (this.testNum == 0) {
        that.testNum = 1;
        if (this.act_id) {
          this.resetAct(e);
        } else {
          this.publishAct(e);
        }
      }
    },
    //重新提交
    resetAct(e) {
      formId(e);
      var that = this;
      let data = {
        title: that.title,
        address: that.address,
        cover: that.cover,
        introduction: that.introduction,
        activity_start_at: that.pushDate1,
        activity_expire_at: that.pushDate2,
        enrol_start_at: that.pushDate3,
        enrol_expire_at: that.pushDate4
      };
      again(this.act_id, data, that.token)
        .then(function(res) {
          that.testNum = 0;
          wx.redirectTo({
            url: "./apply/apply"
          });
          wx.removeStorageSync("actPoster");
        })
        .catch(err => {
          that.testNum = 0;
        });
    },
    //发布活动
    publishAct(e) {
      formId(e);
      var that = this;
      let data = {
        title: that.title,
        address: that.address,
        cover: that.cover,
        introduction: that.introduction,
        activity_start_at: that.pushDate1,
        activity_expire_at: that.pushDate2,
        enrol_start_at: that.pushDate3,
        enrol_expire_at: that.pushDate4
      };
      issue(data, that.token)
        .then(function(res) {
          that.testNum = 0;
          wx.showToast({
            title: "提交成功"
          });
          wx.redirectTo({
            url: "./apply/apply"
          });
          wx.removeStorageSync("actPoster");
        })
        .catch(err => {
          that.testNum = 0;
        });
    }
  }
};
</script>
<style scoped>
.contain {
  padding: 40rpx;
}
.upload {
  background: #f5f5f5;
  height: 376rpx;
  width: 670rpx;
  border-radius: 20rpx;
  text-align: center;
  position: absolute;
}
.uploadImg {
  width: 670rpx;
  height: 376rpx;
  border-radius: 20rpx;
  z-index: 10;
}
.upload .addIcon {
  width: 68rpx;
  height: 68rpx;
  margin-top: 107rpx;
}
.upload p {
  font-size: 26rpx;
  width: 343rpx;
  margin-left: 164rpx;
  color: #ccc7b8;
}

/* 选择海报蒙层 */
.imgUpBgShow {
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
}
.imgUpBgShow .chooseBox {
  position: fixed;
  width: 100%;
  bottom: 0;
  background: #fff;
  z-index: 100;
  overflow: hidden;
}
.imgUpBgShow .chooseBox .choose-item {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  background: #fff;
  text-align: center;
  font-size: 36rpx;
  color: #000000;
}
.imgUpBgShow .chooseBox .cancel {
  border-top: 12rpx solid #cdcdd1;
}

.main-item {
  margin-top: 52rpx;
  overflow: hidden;
}
.main-item .main-input {
  position: relative;
}
.main-item .title {
  color: #331900;
  font-size: 26rpx;
  position: relative;
  padding-left: 24rpx;
}
.main-item .redDog {
  position: absolute;
  display: inline-block;
  width: 10rpx;
  height: 10rpx;
  background: #ff4c5b;
  border-radius: 50%;
  top: 12rpx;
  left: 0rpx;
}
.main-item input {
  /* width: 630rpx; */
  height: 88rpx;
  background: rgba(245, 245, 245, 1);
  border-radius: 44rpx;
  background: rgba(245, 245, 245, 1);
  border-radius: 44rpx;
  line-height: 88rpx;
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(204, 199, 184, 1);
  text-align: left;
  padding-left: 33rpx;
  color: rgb(0, 0, 0);
  margin-top: 26rpx;
  padding-right: 100rpx;
}
.main-item .closeIcon {
  position: absolute;
  width: 26rpx;
  height: 26rpx;
  top: 30rpx;
  right: 40rpx;
  z-index: 5;
}
.main-item .bigInput {
  margin-top: 28rpx;
  width: 670rpx;
  height: 88rpx;
  background: rgba(245, 245, 245, 1);
  border-radius: 44rpx;
  line-height: 88rpx;
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(204, 199, 184, 1);
  text-align: center;
  position: relative;
}
.main-item .typeTips {
  position: absolute;
  top: 0rpx;
  left: 40rpx;
  width: 100%;
  text-align: left;
}
.main-item .bigInput.blackWay5 {
  color: black;
}
.main-item .minInput {
  width: 670rpx;
  height: 88rpx;
  margin-top: 22rpx;
  float: left;
  background: rgba(245, 245, 245, 1);
  border-radius: 44rpx;
  line-height: 88rpx;
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(204, 199, 184, 1);
  box-sizing: border-box;
  padding-left: 40rpx;
}
.main-item .minInput.blackWay1 {
  color: black;
}
.main-item .minInput.blackWay2 {
  color: black;
}
.main-item .minInput.blackWay3 {
  color: black;
}
.main-item .minInput.blackWay4 {
  color: black;
}
.main-item .minInput:nth-of-type(1) {
  margin-right: 30rpx;
}
.main-item .introduce {
  width: 670rpx;
  height: 270rpx;
  padding: 30rpx 40rpx;
  background: #f5f5f5;
  color: black;
  border-radius: 44rpx;
  box-sizing: border-box;
  margin-top: 28rpx;
  font-size: 26rpx;
}
.main-item .introduction_length {
  position: absolute;
  bottom: 22rpx;
  right: 30rpx;
  font-size: 26rpx;
  color: #ccc7b8;
}

footer .submit {
  padding: 40rpx;
}
footer .submit .btn {
  width: 670rpx;
  height: 88rpx;
  box-sizing: border-box;
  line-height: 88rpx;
  text-align: center;
  border-radius: 44rpx;
  background: #ffb90c;
  font-size: 28rpx;
  color: #331900;
}
</style>
