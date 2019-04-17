<template>
  <div class="trends">
    <div class="trends-item" v-for="(item,index) in trendsMsg" :key="index" :data-index="index" @click="toWhere(item.top_id,item.foreign_id,item.type,item.comment_id,item.from_user_realname,item.act_type)">
      <div class="item_left">
        <img :src="url+item.from_user_avatar">
      </div>
      <div class="item_right">
        <div style="overflow:hidden">
          <span>{{item.from_user_realname}}</span>
          <span>{{item.created_at}}</span>
        </div>
        <p>{{item.content}}</p>
        <p>回复:{{item.parent_comment.content}}</p>
      </div>
    </div>

    <footer v-if="trendsMsg.length>0">
      <p @click='more' v-if="moreShow">查看更多内容</p>
      <p v-else>已无更多内容</p>
    </footer>

    <div class="default" v-if="trendsMsg.length==0">
      <img :src="url+'/img/default/pageDefault.png'" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common";
import { messages, yiduMsg } from "@/utils/api";
export default {
  data() {
    return {
      token: "",
      url: url.url,
      trendsMsg: [],
      page: 1,
      moreShow: true
    };
  },
  // props: ["trendsMsg"],
  onLoad() {
    var token = " ";
    token += wx.getStorageSync("silentlogin").token;
    this.token = token;
    var that = this;
    this.trendsMsg = [];
    this.moreShow = true;
    this.page = 1;
    messages({}, token,true).then(function(res) {
      console.log(res);
      console.log(res, 1111111);
      that.trendsMsg = res.data;
      if (this.trendsMsg.length == 0) {
        this.moreShow = false;
      }
    });
  },
  onUnload() {
    console.log(250);
  },
  onShow() {
    this.putMsg();
  },
  methods: {
    toWhere(top_id,act_id,type,comment_id,from_user_realname,act_type) {
      console.log(top_id)
      console.log(act_id)
      console.log(type)
      console.log(comment_id)
      console.log(from_user_realname)
      if(type==1){
        wx.navigateTo({
        url:`./commentDetail?top_id=${top_id}&&type=${type}&&act_id=${act_id}&&comment_id=${comment_id}&&from_user_realname=${from_user_realname}&&act_type=${act_type}`
      });
      }
      if(type==2){
        wx.navigateTo({
        url:`./blDetail?top_id=${top_id}&&type=${type}&&act_id=${act_id}&&comment_id=${comment_id}&&from_user_realname=${from_user_realname}`
      });
      }
    },
    putMsg(e) {
      // var index = e.currentTarget.dataset.index;
      let data = {
        is_total: 1
      };
      yiduMsg(data, this.token,true);
    },
    more() {
      this.page += 1;
      var that = this;
      messages({ page: this.page }, this.token).then(function(res) {
        console.log(res);
        for (var i = 0; i < 5; i++) {
          if (res.data[i]) {
            that.trendsMsg.push(res.data[i]);
          } else {
            console.log(1111, that.moreShow);
            that.moreShow = false;
          }
        }
      });
    }
  }
};
</script>
<style scoped>
.trends-item {
  overflow: hidden;
  padding: 40rpx 40rpx 0;
}
.trends-item .item_left {
  float: left;
}
.trends-item .item_left img {
  width: 73rpx;
  height: 80rpx;
}
.trends-item .item_right {
  width: 570rpx;
  float: left;
  margin-left: 26rpx;
  line-height: 34rpx;
  padding-bottom: 39rpx;
  border-bottom: 1px solid #e6e6e6;
  overflow: hidden;
}
.trends-item .item_right span {
  display: table-cell;
  vertical-align: middle;
}
.trends-item .item_right > div span:first-child {
  font-size: 34rpx;
  color: #331900;
  float: left;
}
.trends-item .item_right > div span:nth-child(2) {
  color: #ccb166;
  font-size: 22rpx;
  float: right;
}
.trends-item .item_right p:nth-of-type(2) {
  font-size: 28rpx;
  color: #331900;
  margin-top: 18rpx;
}
.trends-item .item_right p:nth-of-type(3) {
  font-size: 26rpx;
  color: #99958a;
  margin-top: 21rpx;
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

