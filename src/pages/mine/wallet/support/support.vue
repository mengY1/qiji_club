<template>
    <div>
        <div class="support">
            <div class="support-item" v-for="(item,index) in main" :key="index" @click="toDetail(item.act_id)" :data-id="item.id">
                <img :src="url+item.cover">
                <div class="itemText">
                    <p>{{item.title}}</p>
                    <p>{{activity_start_at[index]}}--{{activity_expire_at[index]}}</p>
                    <p>{{item.cms_school_name}}</p>
                    <div class="invite">
                        <span>邀请好友</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import url from "@/utils/common";
import changeTime from "@/utils/changeTime";
import { clubActivities } from "@/utils/api";
export default {
  data() {
    return {
      url: url.url,
      main: [],
      activity_start_at:[],
      activity_expire_at:[]
    };
  },
  onLoad() {
    this.getActList();
  },
  methods: {
    async getActList() {
      let org_id = wx.getStorageSync("org_id");
      var token = " ";
      token += wx.getStorageSync("silentlogin").token;
      let data = await clubActivities(org_id, { status: 20 }, token);
      this.main = data.data;
      console.log(this.main)
      for(var i=0;i<this.main.length;i++){
        this.activity_start_at.push(changeTime(this.main[i].activity_start_at))
        this.activity_expire_at.push(changeTime(this.main[i].activity_expire_at))
      }
    },
    toDetail(id) {
      var url = "../../../activity/detail/detail?act_id=" + id;
      // var url = "./detail/detail?id=" + id;
      wx.navigateTo({
        url
      });
    }
  }
};
</script>
<style scoped>
.support-item {
  padding: 40rpx;
}
.support-item img {
  width: 670rpx;
  height: 376rpx;
}
.support-item .itemText {
  text-align: left;
  position: relative;
}
.support-item .itemText p {
  font-size: 22rpx;
  color: #99958a;
}
.support-item .itemText p:first-child {
  font-size: 34rpx;
  width: 601rpx;
  color: #331900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-top: 22rpx;
}
.support-item .itemText p:nth-child(2) {
  padding-top: 12rpx;
}
.support-item .itemText .invite {
  position: absolute;
  right: 0rpx;
  top: 90rpx;
  width: 128rpx;
  height: 46rpx;
  box-sizing: border-box;
  border: 1px solid #ccb166;
  border-radius: 8rpx;
  line-height: 44rpx;
  text-align: center;
  font-size: 22rpx;
  color: #ccb166;
}
.itemBottom {
  margin-top: 16rpx;
}
.itemBottom .losupport {
  width: 40rpx;
  height: 32rpx;
}
.itemBottom text {
  font-size: 26rpx;
  color: #331900;
  margin-left: 20rpx;
}
.itemBottom span {
  display: inline;
  font-size: 22rpx;
  color: #99958a;
  margin-left: 163rpx;
}
</style>

