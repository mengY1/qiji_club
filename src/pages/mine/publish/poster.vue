<template>
  <div>
    <main style="padding-bottom:148rpx">
      <div class="poster_wrap">
        <div class="poster_item" v-for="(ite,ind) in poster" :key="ind">
          <div class="item_top">
            <span>{{ite.type}}</span>
            <!-- <img :src="ind===index?bottomIcon:topIcon" class="more" @click="more(ind)"> -->
            <div style="width:100rpx;height:58rpx;float:right;position:absolute;right:40rpx;" @click="more(ind)" v-if="ite.imgAllLength>3">
              <img :src="ite.moreIcon" class="more">
            </div>
          </div>
          <div class="item_bottom">
            <div class="posterImg">
              <img :src="url+item" class="allImg" v-show="index<ite.imgShowLength" :class="{selectImg:index===current&&ind===tab}" v-for="(item,index) in ite.path" :key="index" @click="chooseImg(index,ind)">
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <div class="saveBtn">
        <span :class="{opacity:!selectImg}" @click="saveAction">保存</span>
      </div>
    </footer>
  </div>
</template>
<script>
import url from "@/utils/common";
import { actTemplate } from "@/utils/api";
export default {
  data() {
    return {
      url: url.url,
      poster: [],
      moreIconArr: [], //选择展开的下标数组
      tab: "", //选择列表的下标
      current: "", //对应列表的图片的下标
      selectImg: ""
    };
  },
  onLoad() {
    this.poster = [];
    this.moreIconArr = [];
    this.tab = "";
    this.current = "";
    this.selectImg = "";
    this.getInfo();
  },
  methods: {
    getInfo() {
      actTemplate().then(res => {
        this.poster = res.data;
        console.log(this.poster);
        for (var i of this.poster) {
          i.moreIcon = this.url+"/img/default/Posterlibrary-Collapse.png";
          i.imgShowLength = 3; //每个列表默认显示3个
          i.imgAllLength = i.path.length; //展开时候要显示的长度为图片数组的长度
          console.log(i);
        }
      });
    },
    more(index) {
      if (this.moreIconArr.indexOf(index) === -1) {
        this.moreIconArr.push(index);
        this.poster[index].moreIcon =
          this.url+"/img/default/Posterlibrary-Expand.png";
        this.poster[index].imgShowLength = this.poster[index].imgAllLength;
      } else {
        var num = this.moreIconArr.indexOf(index);
        this.moreIconArr.splice(num, 1);
        this.poster[index].moreIcon =
          this.url+"/img/default/Posterlibrary-Collapse.png";
        this.poster[index].imgShowLength = 3;
      }
    },
    chooseImg(index, ind) {
      this.tab = ind;
      this.current = index;
      this.selectImg = this.poster[this.tab].path[this.current];
    },
    saveAction() {
      if (this.selectImg) {
        console.log(this.selectImg);
        wx.setStorageSync("actPoster", this.selectImg);
        wx.navigateBack({
          delta: -1
        });
      }
    }
  }
};
</script>
<style scoped>
.poster_wrap {
  padding: 40rpx 40rpx 0;
}
.poster_item {
  margin-bottom: 24rpx;
}
.poster_item .item_top {
  font-size: 26rpx;
  color: #331900;
  overflow: hidden;
}
.poster_item .item_top > span {
  float: left;
}
.poster_item .item_bottom {
  margin-top: 24rpx;
}
.poster_item .allImg {
  width: 210rpx;
  height: 118rpx;
  border-radius: 8rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  position: relative;
}
.poster_item .selectImg:after {
  content: "";
  display: block;
  width: 210rpx;
  height: 118rpx;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAB2CAMAAACKyj2IAAAAP1BMVEUAAAD6tQxeRAQAAAD+uQxHMwP/uQz/uQz/uQz/uQzRlwr/uQz/uQz4tAzLkwr+uAz/uQz/uQz/uQzUmgr/uQxhM2WYAAAAFHRSTlOZ+7MA/a3415WP4ysG+uC9uyoJ5bnirpIAAAGGSURBVHja7d3LbsMgEEZhnIDvSZuW93/Wjt1aCpIhy+aM/rPycj4JsbE0hKv1mIY+4+uH6bFpjLSOMTspjl8baf3MjvpYjTRmV43XsLg5db/FJUzZWVMYsrOG4OD2LuvD8RXwHRKR3jmRCIlESCRCIhESiZBIhEQiJBIhkQiJREgkQiIREomQSIREIiQSoX8npTnG7+SJdOmy1SU/JBPtzW5IhyhHLyQTOSPtIlcH70/k6Hp4Fl2CB1Ip8kAqRR5IpcgDqRSRSOl+u93TKxGJlLpj6JYIRZqPsZsiFCkWg9dESJKN3hChSHMxfE2EIqVi/JoIRSoBNRGLVBIqIhipRJyLaKTCdC7CkZ5N5yIeyUwvRDySmdoiIMlMTRGRZKaWCEkyU0PEJJmpLoKSzFQVUUn7T5c5hZOwpGoiiSTSmyYSIZEIiURIJEIiERKJkEiERCIkEiGRCIlESCRCIhESiZBIhA6JxyWn3lbRxsHjwmCHa50dLt/2uCLd4SJ7a/Hy3MCyaX4AtSyeo7swEi4AAAAASUVORK5CYII=");
  background-size: 105px 59px;
  background-repeat: no-repeat;
  position: absolute;
  top: 0rpx;
}
.poster_item .allImg:nth-child(3n + 3) {
  margin-right: 0;
}
.more {
  width: 26rpx;
  height: 14rpx;
  vertical-align: middle;
  margin-top: 12rpx;
  float: right;
}

.saveBtn {
  position: fixed;
  bottom: 0rpx;
  width: 750rpx;
  height: 148rpx;
  background: #fff;
  box-shadow: 0 0 30rpx 0 rgba(0, 0, 0, 0.12);
}
.saveBtn span {
  display: block;
  width: 670rpx;
  margin: 30rpx auto 0;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: #ffb90c;
  color: #331900;
  font-size: 30rpx;
  border-radius: 8rpx;
}
.opacity {
  opacity: 0.3;
}
</style>

