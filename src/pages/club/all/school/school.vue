<template>
  <div>
    <div class="contain">
      <div style="padding: 0 52rpx 40rpx 40rpx;">
        <div class="default" v-if="main.length==0">
          <img :src="url+'/img/default/pageDefault.png'" alt="">
          <p>暂无数据</p>
        </div>
        <div class="contain-item" v-for="(item,index) in main" :index="index" :key="index" :data-org_id="item.org_id" @click="toClub">
          <div class="item_left">
            <img v-if="item.logo" :src="url+item.logo+logoUrl">
            <img v-else :src="url+'/img/default/org_logo.jpg'">
          </div>
          <div class="item_right">
            <p>{{item.name}}</p>
            <p>隶属于{{item.cms_school_name}}</p>
            <p v-if="item.org_status != 30">
              <!-- <img src="http://54qj.54qn.cn/Public/images/index/hot.png"> -->
              <!-- <span>人气{{item.popularity}}</span> -->
            </p>
            <h1 v-else-if="item.org_status == 30">无社长</h1>
          </div>
        </div>
        <footer v-if="main.length>0">
          <p v-if="!pShow">暂无更多内容</p>
        </footer>
      </div>
    </div>

  </div>
</template>
<script>
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import { orgs, userInfo } from "@/utils/api";
export default {
  data() {
    return {
      main: [],
      cms_school_id: "",
      url: url.url,
      logoUrl: url.logoUrl,
      page: 1,
      pShow: true,
      getSchoolInfo: 0
    };
  },
  props: ["getSchoolInfo", "updateIndex"],
  onLoad() {
    this.getUserInfo();
  },
  onShow() {
    // 如果refreshIndex为20则刷新页面数据
    if (wx.getStorageSync("refreshIndex") === 20) {
      this.getUserInfo();
      wx.setStorageSync("refreshIndex", 10);
    }
  },
  watch: {
    getSchoolInfo(n, o) {
      this.getSchoolInfo = n;
      if (n == 0 || n === o) {
        this.getSchoolClub();
      }
    },
    updateIndex(n, o) {
      if (n == 0) {
        this.getUserInfo();
      }
    }
  },
  // 加载更多
  onReachBottom() {
    if (this.pShow && this.getSchoolInfo == 0) {
      this.moreAction();
    }
  },
  methods: {
    getUserInfo() {
      if (wx.getStorageSync("silentlogin").token) {
        userInfo("", "", true).then(res => {
          this.getSchoolClub(res.cms_school_id);
          this.cms_school_id = res.cms_school_id;
        });
      } else {
        this.getSchoolClub();
      }
    },
    getSchoolClub(cms_school_id) {
      this.pShow = true;
      this.page = 1;
      this.main = [];
      orgs({ cms_school_id: cms_school_id, sort: "2,3" }, "", true).then(
        res => {
          this.main = res.data;
          this.$emit("showLoading");
        }
      );
    },
    moreAction() {
      if (this.pShow) {
        this.page += 1;
        orgs({
          page: this.page,
          cms_school_id: this.cms_school_id,
          sort: "2,3"
        }).then(res => {
          for (var i = 0; i < 6; i++) {
            if (res.data[i]) {
              this.main.push(res.data[i]);
            } else {
              this.pShow = false;
            }
          }
        });
      }
    },
    toClub(e) {
      var id = e.currentTarget.dataset.org_id;
      wx.setStorageSync("org_id", id);
      var url = "../../club/index?org_id=" + id;
      wx.navigateTo({
        url: url
      });
    }
  }
};
</script>
<style scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.contain {
  /* padding: 0 52rpx 40rpx 40rpx; */
  margin-top: 105rpx;
  width: 100%;
  overflow: hidden;
}
.contain .contain-item {
  margin-top: 40rpx;
  overflow: hidden;
}
.contain .contain-item .item_left {
  float: left;
}
.contain .contain-item .item_left img {
  width: 156rpx;
  height: 156rpx;
  border-radius: 20rpx;
}
.contain .contain-item .item_right {
  width: 463rpx;
  margin-left: 40rpx;
  float: left;
}
.contain .contain-item .item_right p:first-child {
  font-size: 34rpx;
  color: #331900;
}
.contain .contain-item .item_right p:nth-child(2) {
  font-size: 26rpx;
  color: #99958a;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-top: 18rpx;
}
.contain .contain-item .item_right p:nth-child(3) span {
  font-size: 22rpx;
  color: #ffffff;
  margin-top: 24rpx;
  font-family: "1234567890-Regular";
  display: inline-block;
  line-height: 36rpx;
  text-align: center;
  padding: 0 16rpx;
  border-radius: 8rpx;
  background: #ff555c;
}
/* .contain .contain-item .item_right p:nth-child(3) img {
  width: 28rpx;
  height: 32rpx;
  margin-right: 16rpx;
} */
.contain .contain-item .item_right h1 {
  display: block;
  width: 120rpx;
  height: 36rpx;
  background: #ccb166;
  border-radius: 8rpx;
  font-size: 22rpx;
  color: #ffffff;
  text-align: center;
  line-height: 36rpx;
  margin-top: 20rpx;
}

footer p {
  display: block;
  width: 670rpx;
  /* margin: 0 auto; */
  border-top: 1px solid #e6e6e6;
  text-align: center;
  line-height: 100rpx;
  font-size: 26rpx;
  color: #99958a;
  margin-top: 60rpx;
}

.default {
  text-align: center;
  margin-top: 280rpx;
}
.default img {
  width: 300rpx;
  height: 300rpx;
}
.default p {
  font-size: 26rpx;
  color: #999999;
  margin-top: 10rpx;
}
</style>


