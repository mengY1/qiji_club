<template>
  <div class="review">
    <div class="item_wrap">
      <div class="list-item" v-for="(item,index) in reviewInfo" :key="index" @click="toDetail(item.act_id)" :data-id="item.act_id">
        <div class="item_left">
          <img :src="url+item.cover" class="logo">
        </div>
        <div class="item_right">
          <p class="title">{{item.title}}</p>
          <p class="time">{{activity_start_at[index]}}</p>
          <p class="address">{{item.cms_school_name}} | {{item.org_name}}</p>
          <p class="tips">审核中</p>
        </div>
      </div>
    </div>

    <div class="default" v-if="reviewInfo.length==0">
      <img :src="url+'/img/default/pageDefault.png'" alt="">
      <p>暂无数据</p>
    </div>
  </div>
</template>
<script>
import { clubActivities } from "@/utils/api";
import url from "@/utils/common";
import logoUrl from "@/utils/common";
import otherUrl from "@/utils/common";
import changeTime from "@/utils/changeTime";
export default {
  props: ["activeIndex"],
  data() {
    return {
      main: "",
      org_id: "",
      token: "",
      url: url.url,
      logoUrl: url.logoUrl,
      otherUrl: url.otherUrl,
      activity_start_at: [],
      activity_expire_at: [],
      reviewInfo: [],
      load: true, //是否加载更多数据
      page: 1
    };
  },
  methods: {
    toDetail(id) {
      var url = "../detail/detail?act_id=" + id;
      wx.navigateTo({
        url
      });
    },
    more() {
      if (this.activeIndex == 1 && this.load) {
        this.page += 1;
        clubActivities(
          this.org_id,
          { status: 10, page: this.page },
          this.token,
          true
        ).then(res => {
          if (res.data[0]) {
            for (var i = 0; i < res.data.length; i++) {
              this.reviewInfo.push(res.data[i]);
              this.activity_start_at.push(
                changeTime(res.data[i].activity_start_at, 16)
              );
              this.activity_expire_at.push(
                changeTime(res.data[i].activity_expire_at, 16)
              );
            }
          } else {
            this.load = false;
          }
        });
      }
    }
  },
  onLoad() {
    this.load = true;
    this.page = 1;
    var token = " ";
    token += wx.getStorageSync("silentlogin").token;
    this.token = token;
    this.org_id = wx.getStorageSync("org_id");
    this.activity_start_at = [];
    this.activity_expire_at = [];
    //审核中
    clubActivities(this.org_id, { status: 10 }, token, true).then(res => {
      this.reviewInfo = res.data;
      for (var i = 0; i < this.reviewInfo.length; i++) {
        this.activity_start_at.push(
          changeTime(this.reviewInfo[i].activity_start_at, 16)
        );
        this.activity_expire_at.push(
          changeTime(this.reviewInfo[i].activity_expire_at, 16)
        );
      }
    });
  },
  onReachBottom() {
    if (this.activeIndex == 1) {
      this.more();
    }
  }
};
</script>
<style scoped>
.item_wrap .list-item .tips {
  color: #576b95;
  font-size: 24rpx;
}
</style>
