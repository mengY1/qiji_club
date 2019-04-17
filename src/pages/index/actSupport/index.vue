<template>
  <div>
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <main>
      <div class="main_wrap">
        <div class="support">
          <div class="sup-item" v-for="(item,index) in supList" :key="index" @click="toDetail(item.sponsor_id)">
            <div class="item_left">
              <img :src="url+item.avatar" alt="" v-if="item.avatar">
            </div>
            <div class="item_right">
              <p class="title">{{item.company_name}}</p>
              <p class="money">赞助金额¥{{item.funds}}</p>
              <p class="introduce">{{item.sponsor_name}}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer v-if="supList.length>0">
      <p @click='more' v-if="moreShow">查看更多内容</p>
      <p v-else>已无更多内容</p>
    </footer>
  </div>
</template>
<script>
import loading from "@/components/loading";
import { supList } from "@/utils/api";
import common from "@/utils/common";
export default {
  data() {
    return {
      url: common.url,
      loadingShow: true,
      supList: [],
      page: 1,
      moreShow: true
    };
  },
  components: {
    loading
  },
  onLoad(options) {
    this.loadingShow = true;
    this.page = 1;
    this.moreShow = true;
    this.getListInfo();
    console.log(options, 46);
    if (options.sponsor_id) {
      wx.navigateTo({
        url: "./detail?sponsor_id=" + options.sponsor_id + "&&channel=friends"
      });
    }
  },
  onPullDownRefresh() {
    this.loadingShow = true;
    this.page = 1;
    this.moreShow = true;
    this.getListInfo();
  },
  onReachBottom() {
    this.more();
  },
  methods: {
    async getListInfo() {
      try {
        this.supList = [];
        let list = await supList({ pagesize: 8 }, true);
        this.supList = list.data;
        this.loadingShow = false;
      } catch (e) {
        console.log(e);
        this.loadingShow = false;
      }
    },
    more() {
      if (this.moreShow) {
        this.page += 1;
        console.log(this.moreShow);
        supList({ pagesize: 8, page: this.page }).then(res => {
          for (var i = 0; i < 8; i++) {
            if (res.data[i]) {
              this.supList.push(res.data[i]);
            } else if (!res.data[7]) {
              this.moreShow = false;
            } else {
              this.moreShow = false;
            }
          }
        });
      }
    },
    toDetail(id) {
      wx.navigateTo({
        url:
          "/pages/index/actSupport/detail?sponsor_id=" + id + "&&channel=list"
      });
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: "活动赞助",
      path: "/pages/index/index?actSupport=1"
      // imageUrl: this.url + "img/share/app.jpg"
    };
  }
};
</script>
<style scoped>
.main_wrap {
  padding: 0 40rpx;
}
.support .sup-item {
  padding: 30rpx 0;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
}
.support .sup-item .item_left {
  float: left;
  overflow: hidden;
}
.support .sup-item .item_left img {
  width: 122rpx;
  height: 122rpx;
}
.support .sup-item .item_right {
  float: left;
  overflow: hidden;
  margin-left: 18rpx;
  width: 524rpx;
  color: #999999;
  font-size: 28rpx;
}
.support .sup-item .title {
  font-size: 32rpx;
  color: #333333;
  margin-top: -6rpx;
}
.support .sup-item .money {
  margin-top: 8rpx;
}
.support .sup-item .introduce {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

footer p {
  display: block;
  width: 670rpx;
  margin: 0 auto;
  border-top: 1px solid #e6e6e6;
  text-align: center;
  line-height: 100rpx;
  font-size: 26rpx;
  color: #99958a;
}
</style>