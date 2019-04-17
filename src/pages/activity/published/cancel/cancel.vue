<template>
  <div class="cancel">
    <div class="item_wrap">
      <div class="list-item" v-for="(item,index) in cancelInfo" :key="index" @click="toDetail(item.act_id)" :data-id="item.act_id">
        <div class="item_left">
          <img :src="url+item.cover" class="logo">
        </div>
        <div class="item_right">
          <p class="title">{{item.title}}</p>
          <p class="time">{{activity_start_at[index]}}</p>
          <p class="address">{{item.cms_school_name}} | {{item.org_name}}</p>
          <p class="tips" v-if="item.status===30">审核失败</p>
        </div>
      </div>
    </div>

    <div class="default" v-if="cancelInfo.length==0">
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
      org_id: "",
      token: "",
      page: 1,
      load: true,
      main: "",
      url: url.url,
      otherUrl: url.otherUrl,
      logoUrl: url.logoUrl,
      activity_start_at: [],
      activity_expire_at: [],
      cancelInfo: []
    };
  },
  methods: {
    toDetail(id) {
      var url = "../detail/detail?act_id=" + id;
      wx.navigateTo({
        url
      });
    },
    again(id) {
      var url = "../../mine/publish/publish?act_id=" + id;
      wx.navigateTo({
        url
      });
    },
    more() {
      if (this.activeIndex == 2 && this.load) {
        this.page += 1;
        clubActivities(
          this.org_id,
          { status: "30,40", page: this.page },
          this.token,
          true
        ).then(res => {
          if (res.data[0]) {
            for (var i = 0; i < res.data.length; i++) {
              this.cancelInfo.push(res.data[i]);
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
    var token = " ";
    token += wx.getStorageSync("silentlogin").token;
    this.token = token;
    this.page = 1;
    this.load = true;
    var org_id = wx.getStorageSync("org_id");
    this.activity_start_at = [];
    this.activity_expire_at = [];
    this.org_id = org_id;
    clubActivities(org_id, { status: "30,40" }, token, true).then(res => {
      this.cancelInfo = res.data;
      for (var i = 0; i < this.cancelInfo.length; i++) {
        this.activity_start_at.push(
          changeTime(this.cancelInfo[i].activity_start_at, 16)
        );
        this.activity_expire_at.push(
          changeTime(this.cancelInfo[i].activity_expire_at, 16)
        );
      }
    });
  },
  onReachBottom() {
    if (this.activeIndex == 2) {
      this.more();
    }
  }
};
</script>
<style scoped>
.item_wrap .list-item .tips{
  color:#ff4c5b;
  font-size: 24rpx;
}
</style>
