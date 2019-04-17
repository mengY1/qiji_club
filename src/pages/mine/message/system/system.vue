<template>
<div>
    <div class="system"  >
        <div class="system-item" v-for="(item,index) in systemMsg" :key="index" :data-id="item.mini_program_url" @click="toWhere">
            <div class="item_left">
                <img :src="url+'/img/default/logo.jpg'">
            </div>
            <div class="item_right">
                <div style="overflow:hidden">
                    <span>奇集团队</span>
                    <span>{{item.created_at}}</span>
                </div>
                <p>{{item.content}}</p>
            </div>
        </div>

        <footer v-if="systemMsg.length>0">
          <p @click = 'more' v-if="moreShow">查看更多内容</p>
          <p v-else>已无更多内容</p>
        </footer>

        <div class="default" v-if="systemMsg.length==0">
          <img :src="url+'/img/default/pageDefault.png'"  alt="">
          <p>暂无数据</p>
        </div>
    </div>
    </div>
</template>
<script>
import url from "@/utils/common"
import { notifications, yidu } from "@/utils/api";
export default {
  data() {
    return {
      token: "",
      moreShow: true,
      systemMsg: [],
      page: 1,
      url:url.url
    };
  },
  onLoad() {
    var token = " ";
    token += wx.getStorageSync("silentlogin").token;
    var that = this;
    this.token = token;
    this.systemMsg = [];
    this.moreShow = true;
    this.page = 1;
    notifications({}, token,true).then(function(res) {
      console.log(res)
      console.log(res.data[0].mini_program_url)
      that.systemMsg = res.data;
      if (this.systemMsg.length == 0) {
        this.moreShow = false;
      }
    });
  },
  methods: {
    // toWhere(e){
    //   console.log(e.currentTarget.dataset.id)
    //      wx.navigateTo({
    //       url:e.currentTarget.dataset.id
    //     })
    // },
    more() {
      this.page += 1;
      var that = this;
      notifications({ page: this.page }, this.token).then(function(res) {
        for (var i = 0; i < 5; i++) {
          if (res.data[i]) {
            that.systemMsg.push(res.data[i]);
          } else {
            that.moreShow = false;
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.system-item {
  overflow: hidden;
  padding: 40rpx 37rpx 0;
}
.system-item .item_left {
  float: left;
}
.system-item .item_left img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}
.system-item .item_right {
  width: 570rpx;
  float: left;
  margin-left: 26rpx;
  line-height: 34rpx;
  padding-bottom: 39rpx;
  border-bottom: 1px solid #e6e6e6;
  overflow: hidden;
}
.system-item .item_right span {
  display: table-cell;
  vertical-align: middle;
}
.system-item .item_right > div span:first-child {
  font-size: 34rpx;
  color: #331900;
  float: left;
}
.system-item .item_right > div span:nth-child(2) {
  color: #ccb166;
  font-size: 22rpx;
  float: right;
}
.system-item .item_right p:nth-of-type(2) {
  font-size: 28rpx;
  color: #331900;
  margin-top: 18rpx;
}

footer p {
  display: block;
  width: 670rpx;
  margin: 0 auto;
  /* border-top: 1px solid #e6e6e6; */
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

