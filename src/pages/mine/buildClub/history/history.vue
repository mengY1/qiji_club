<template>
  <div class="history">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <div class="contain">
      <block v-for="(item,index) in main" :index="index" :key="index">
        <div class="contain-item" @click="toClub(item.org_claim_id)" v-if="item.audit_status==30||item.audit_status==10">
          <div class="item_left">
            <img :src="url+item.logo">
          </div>
          <div class="item_right">
            <p>{{item.name}}</p>
            <p v-if="item.audit_status==10" style="color:#576b95">审核中</p>
            <p v-if="item.audit_status==30">审核时间:{{item.audit_at}}</p>
            <p v-if="item.audit_status==30">
              <!-- <img src="http://54qj.54qn.cn/Public/images/index/hot.png"> -->
              <span>审核失败:{{item.audit_remark}}</span>
            </p>
          </div>
        </div>
      </block>
    </div>

    <div class="default" v-if="main.length==0">
      <img :src="url+'/img/default/pageDefault.png'" alt="">
      <p>暂无数据</p>
    </div>
    <footer v-if="main.length>0">
      <p v-if="!pShow">暂无更多内容</p>
      <p v-else @click="more">查看更多内容</p>
    </footer>
  </div>
</template>
<script>
import url from "@/utils/common";
import { claimsGet } from "@/utils/api";
import loading from "@/components/loading";
export default {
  data() {
    return {
      token: " ",
      user_id: "",
      url: url.url,
      main: [],
      loadingShow: true,
      pShow: true,
      page: 1
    };
  },
  components: {
    loading
  },
  mounted() {
    this.page = 1;
    this.pShow = true;
    this.loadingShow = true;
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    var that = this;
    var user_id = wx.getStorageSync("silentlogin").user_id;
    this.user_id = user_id;
    claimsGet({ user_id: user_id }, this.token, true)
      .then(function(res) {
        that.loadingShow = false;
        that.main = res.data;
      })
      .catch(err => {
        that.loadingShow = false;
      });
  },
  methods: {
    toClub(id) {
      // wx.navigateTo({
      //   url: "/pages/mine/buildClub/schedule/schedule?org_claim_id="+id
      // });
      wx.navigateTo({
        url: "/pages/club/fail/index?org_claim_id=" + id
      });
    },
    more() {
      this.page += 1;
      claimsGet({ user_id: this.user_id, page: this.page }).then(res => {
        if (res.data[0]) {
          for (var i in res.data) {
            this.main.push(res.data[i]);
            this.pShow = res.data[4] ? true : false;
          }
        } else {
          this.pShow = false;
        }
      });
    }
  }
};
</script>
<style scoped>
.contain {
  padding: 40rpx 52rpx 40rpx 40rpx;
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
.contain .contain-item .item_right p:nth-child(3) {
  font-size: 26rpx;
  color: #ff4c5b;
  margin-top: 18rpx;
  font-family: "1234567890-Regular";
}
.contain .contain-item .item_right p:nth-child(3) img {
  width: 28rpx;
  height: 32rpx;
  margin-right: 16rpx;
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
