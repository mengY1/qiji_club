<template>
  <div class="income">
    <div class="income-item_wrap">
      <div class="income-item" v-for="(item,index) in main" :key="index" @click="toIncomeDetail(item.bill_id)">
        <div class="item-left">
          <p>{{item.title}}</p>
          <p>{{item.created_at}}</p>
        </div>
        <div class="item-right">
          <text>{{item.amount}}</text>
        </div>
      </div>
    </div>

    <footer v-if="main.length>0">
      <p @click='more' v-if="moreShow">查看更多内容</p>
      <p v-else>已无更多内容</p>
    </footer>

    <div class="default" v-if="main.length==0">
      <img :src="url+'/img/default/pageDefault.png'" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import url from "@/utils/common"
import { bills } from "@/utils/api";
export default {
  data() {
    return {
      url:url.url,
      main: [],
      moreShow: true,
      page: 1,
      token: "",
      id: ""
    };
  },
  onLoad() {
    this.main = [];
    this.moreShow = true;
    this.page = 1;
    this.getMsg();
  },
  methods: {
    toIncomeDetail(id) {
      wx.navigateTo({
        url: "./income/incomeDetail/incomeDetail?bill_id=" + id + "&&status=0"
      });
    },
    getMsg() {
      var id = wx.getStorageSync("org_id");
      this.id = id;
      var that = this;
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      this.token = token;
      bills(id, { revenue_or_pay: 1 }, token,true).then(function(res) {
        that.main = res.data;
        that.$emit("incomeLoading")
      }).catch(err=>{
        that.$emit("incomeLoading")
      });
    },
    more() {
      this.page += 1;
      var that = this;
      bills(this.id, { revenue_or_pay: 1, page: this.page }, this.token).then(
        function(res) {
          for (var i = 0; i < 5; i++) {
            if (res.data[i]) {
              that.main.push(res.data[i]);
            } else {
              console.log(1111, that.moreShow);
              that.moreShow = false;
            }
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.income-item_wrap {
  padding-left: 39rpx;
}
.income-item {
  padding: 45rpx 69rpx 45rpx 0;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
}
.income-item .item-left {
  float: left;
}
.income-item .item-left p:nth-child(1) {
  font-size: 28rpx;
  color: #331900;
}
.income-item .item-left p:nth-child(2) {
  font-size: 26rpx;
  color: #99958a;
  margin-top: 8rpx;
}
.income .item-right {
  float: right;
  margin-top: 20rpx;
  font-size: 44rpx;
  color: #331900;
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

