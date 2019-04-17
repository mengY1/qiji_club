<template>
  <div class="school" @click="schoolInfoHide">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <div class="input">
      <input type="text" class="in" @focus="schoolFocu" @blur="schoolBlu" v-model="schoolName" maxlength="15">
      <div class="close_wrap" @click="clear">
        <img :src="url+'/img/home/but_guanbi@2x.png'" class="closeIcon" alt="" v-show="schoolName">
      </div>
      <div class="schoolNumber" v-show="schoolFocus">
        <text class="schoolText">请输入学校</text>
      </div>
    </div>
    <div class="schoolTips">
      <text v-show="pickShow">请输入学校</text>
      <text v-show="!pickShow&&schoolTrue">请输入正确的学校</text>
    </div>
    <div class="schoolsInfo" v-show="schoolInfoShow">
      <block v-for="(item,index) in schoolsData" :key="index">
        <p v-bind:readonly="true" v-if="index<5" @click="getName" :data-name="item.name" :data-id="item.cms_school_id" :value="item.name">{{item.name}}</p>
      </block>
    </div>
    <gradeInfo @grade="getGrade"></gradeInfo>
    <majors :majors="majors" :multiArray="multiArray" :majorsIdArr="majorsIdArr" @cms_major_id='getId' @pickShow='getPicShow'></majors>
    <!-- <p @click="test">test</p> -->
    <form @submit="toGradeInfo" report-submit="true">
      <button class="next" :class="btnBg" form-type="submit">下一步</button>
    </form>
  </div>

</template>
<script>
import common from "@/utils/common";
import gradeInfo from "./gradeInfo/index";
import majors from "./majors/index";
import { school, schools, majorsSearch, userInfo } from "@/utils/api";
import { formId } from "@/utils/common";
import loading from "@/components/loading";
export default {
  data() {
    return {
      url: common.url,
      options: "",
      loadingShow: false,
      schoolFocus: true,
      schoolName: "",
      data: { keyword: "" },
      schoolsData: [],
      cms_school_id: "",
      schoolInfoShow: false,
      data1: { cms_school_id: "" },
      majors: [],
      majorsId: "",
      majorsIdArr: [],
      gradeId: "",
      pickShow: false,
      schoolTrue: false,
      multiArray: [], //二级联动菜单的首层显示数组(二维数组)
      key: "" //移交社长的key参数
    };
  },
  onLoad(options) {
    this.options = options;
    this.key = options.key;
    // 有token是已填手机号，请求user接口判断有无完成校园信息注册，若有则跳到第三步，若无则让正在加载隐藏
    if (wx.getStorageSync("silentlogin").token) {
      this.loadingShow = true;
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      userInfo({}, token, true).then(res => {
        if (res.cms_school_id) {
          if (this.key) {
            wx.redirectTo({
              url: "../personInfo/index?key=" + this.key
            });
          } else {
            wx.redirectTo({
              url:
                "../personInfo/index?org_id=" +
                this.options.org_id +
                "&userName=" +
                this.options.userName +
                "&avatar=" +
                this.options.avatar
            });
          }
        }
        this.loadingShow = false;
      });
    }
  },
  watch: {
    schoolName() {
      this.test();
    }
  },
  components: {
    gradeInfo,
    majors,
    loading
  },
  updated() {
    if (this.schoolTrue) {
      this.pickShow = false;
    }
  },
  computed: {
    btnBg() {
      if (
        this.cms_school_id &&
        this.schoolName &&
        this.gradeId > 0 &&
        this.majorsId > 0
      ) {
        console.log(1111);
        return "";
      } else {
        return "btnBg";
      }
    }
  },
  methods: {
    clear() {
      this.schoolName = "";
      this.majors = "";
      this.schoolFocus = true;
    },
    schoolInfoHide() {
      this.schoolInfoShow = false;
    },
    test() {
      var that = this;
      this.schoolInfoShow = true;
      this.pickShow = false;
      this.data.keyword = this.schoolName;
      if (this.schoolName) {
        schools(this.data).then(function(res) {
          if (res.data.length == 0) {
            that.schoolTrue = true;
            that.schoolsData = res.data;
          } else {
            that.schoolsData = res.data;
          }
        });
      }
    },
    getName(e) {
      var that = this;
      this.schoolInfoShow = true;
      this.schoolInfoShow = false;
      this.pickShow = false;
      this.schoolTrue = false;
      this.schoolName = e.currentTarget.dataset.name;
      this.cms_school_id = e.currentTarget.dataset.id;
      this.data1.cms_school_id = this.cms_school_id;
      majorsSearch(this.data1).then(function(res) {
        that.majors = [];
        that.majors = res.data; //完整的专业json
        // for (var i = 0; i < res.data.length; i++) {
        //   that.majors.push(res.data[i].name);
        //   that.majorsIdArr.push(res.data[i].cms_major_id);
        // }
        var arr1 = []; //一级菜单的数组
        var arr2 = []; //一级菜单联动的二级数组
        that.multiArray = [];
        // 遍历获取一级菜单第一层的内容
        for (var i = 0; i < res.data.length; i++) {
          arr1.push(res.data[i].name);
        }
        // 遍历获取一级菜单联动的二级菜单的专业
        for (var i = 0; i < res.data[0].child.length; i++) {
          arr2.push(res.data[0].child[i].name);
        }
        that.multiArray.push(arr1);
        that.multiArray.push(arr2);
        console.log(that.multiArray);
      });
    },
    getId(data) {
      this.majorsId = data;
    },
    getPicShow(data) {
      this.pickShow = data;
    },
    getGrade(data) {
      this.gradeId = data;
    },
    schoolFocu() {
      this.schoolFocus = false;
    },
    schoolBlu() {
      this.schoolName == ""
        ? (this.schoolFocus = true)
        : (this.schoolFocus = false);
    },
    toGradeInfo(e) {
      if (e) {
        formId(e);
      }
      if (common.status === "dev") {
        wx.reportAnalytics("perfect_info_click", {
          step: "第二步"
        });
      }
      if (
        this.cms_school_id &&
        this.schoolName &&
        this.gradeId > 0 &&
        this.majorsId > 0
      ) {
        let data = {
          cms_school_id: this.cms_school_id,
          cms_major_id: this.majorsId,
          grade: this.gradeId
        };
        var token = " ";
        token += wx.getStorageSync("silentlogin").token;
        school(data, token).then(res => {
          if (this.key) {
            wx.navigateTo({
              url: "../personInfo/index?key=" + this.key
            });
          } else {
            wx.navigateTo({
              url:
                "../personInfo/index?org_id=" +
                this.options.org_id +
                "&userName=" +
                this.options.userName +
                "&avatar=" +
                this.options.avatar
            });
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.school {
  padding: 86rpx 40rpx 0;
  position: relative;
}
.loading {
  position: fixed;
  left: 0;
  z-index: 100;
}
.school .input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
}
.school .in {
  /* width: 100%; */
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  /* color: #ccc7b8; */
  padding-left: 40rpx;
  font-size: 28rpx;
  position: relative;
  z-index: 10;
  padding-right: 100rpx;
}
.school .close_wrap {
  width: 88rpx;
  height: 88rpx;
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  z-index: 200;
}
.school .closeIcon {
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  width: 26rpx;
  height: 26rpx;
  z-index: 200;
}
.school .schoolNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}
.school .schoolTips {
  font-size: 28rpx;
  color: #ff4c5b;
  margin-left: 40rpx;
  position: absolute;
}
.school .schoolsInfo {
  position: absolute;
  width: 85%;
  line-height: 88rpx;
  padding-left: 40rpx;
  top: 168rpx;
  background: #fff;
  z-index: 10;
}
.school .schoolsInfo input {
  line-height: 88rpx;
  height: 88rpx;
  border-bottom: 1px solid #e6e6e6;
  font-size: 28rpx;
  background: #fff;
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
  opacity: 1;
  font-size: 28rpx;
  color: #331900;
}

.btnBg {
  opacity: 0.3;
}
</style>
