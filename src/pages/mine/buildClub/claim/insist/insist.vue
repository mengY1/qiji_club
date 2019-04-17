<template>
  <div>
    <div class="insist">
      <div class="input">
        <!-- <input type="text" class="in" @focus="insistFocu" @blur="insistBlu" v-model="insistName" :value="clubName"> -->
        <text class="in">{{keyword}}</text>
      </div>
    </div>
    <!-- <div class="tips">
                <p v-if="status=='repeat'">你想创建的社团已经被创建了，去看看吧</p>
                <p v-else>你想创建的社团好像已经存在，快去认领吧</p>               
            </div> -->
    <main>
      <div class="main_wrap" v-if="claimData.length>0">
        <div class="title_wrap">
          <div class="title">
            <span>无社长</span>
            <span @click="open(0)" v-if="claimTotal>3">{{openStatus0?"收缩":"展开"}}</span>
            <p>以下社团还没有社长,去申请成为社长吧</p>
          </div>
        </div>
        <div class="contain">
          <block v-for="(item,index) in claimData" :index="index" :key="index">
            <div class="contain-item" :data-id="index" @click="toClaim" :data-type="item.org_type" :data-org_id="item.org_id" v-if="index<claimShowTotal">
              <div class="item_left">
                <img v-if="item.logo" :src="url+item.logo">
                <img v-else :src="url+'/img/default/org_logo.jpg'" alt="">
              </div>
              <div class="item_right">
                <p>{{item.name}}</p>
                <p>{{item.summary}}</p>
                <p>{{item.cms_school_name}}</p>
              </div>
            </div>
          </block>
        </div>
      </div>

      <div class="main_wrap" v-if="creatingData.length>0">
        <div class="title_wrap">
          <div class="title">
            <span>创建中</span>
            <span @click="open(1)" v-if="creatingTotal>3">{{openStatus1?"收缩":"展开"}}</span>
            <p>以下社团正在创建审核中，暂时无法创建</p>
          </div>
        </div>
        <div class="contain">
          <block v-for="(item,index) in creatingData" :index="index" :key="index">
            <div class="contain-item" :data-id="index" @click="tipsShow" :data-type="item.org_type" :data-org_id="item.org_id" v-if="index<creatingShowTotal">
              <div class="item_left">
                <img v-if="item.logo" :src="url+item.logo">
                <img v-else :src="url+'/img/default/org_logo.jpg'" alt="">
              </div>
              <div class="item_right">
                <p>{{item.name}}</p>
                <p>{{item.summary}}</p>
                <p>{{item.cms_school_name}}</p>
              </div>
            </div>
          </block>
        </div>
      </div>

      <div class="main_wrap" v-if="createdData.length>0">
        <div class="title_wrap">
          <div class="title">
            <span>已创建</span>
            <span @click="open(2)" v-if="createdTotal>3">{{openStatus2?"收缩":"展开"}}</span>
            <p>以下社团已被创建，去看看吧</p>
          </div>
        </div>
        <div class="contain">
          <block v-for="(item,index) in createdData" :index="index" :key="index">
            <div class="contain-item" :data-id="index" @click="toClub(item.org_id)" :data-type="item.org_type" :data-org_id="item.org_id" v-if="index<createdShowTotal">
              <div class="item_left">
                <img v-if="item.logo" :src="url+item.logo">
                <img v-else :src="url+'/img/default/org_logo.jpg'" alt="">
              </div>
              <div class="item_right">
                <p>{{item.name}}</p>
                <p>{{item.summary}}</p>
                <p>{{item.cms_school_name}}</p>
              </div>
            </div>
          </block>
        </div>
      </div>
    </main>

    <footer v-if="!status">
      <form @submit="toClubInfo" report-submit="true">
        <button class="insistBtn" form-type="submit">创建新社团</button>
      </form>
    </footer>
  </div>
</template>
<script>
import common from "@/utils/common";
import { formId } from "@/utils/common";
import { orgs, claimsGet, check } from "@/utils/api";
// import { mapState } from "vuex";
export default {
  data() {
    return {
      // insistName: "音乐社",
      url: common.url,
      token: "",
      status: "",
      keyword: "",
      cms_school_id: "",
      claimData: "",
      claimTotal: "",
      claimShowTotal: 3, //要显示的认领社团的数量
      loadClaim: 1, //设一个变量，首次点击展开的时候执行下面方法加载更多数据，第二次起就不必再加载了（认领中的社团）
      createdData: "",
      createdTotal: "",
      createdShowTotal: 3, //要显示的已创建的社团数量
      loadCreated: 1, //同上(已创建的社团)
      creatingData: "",
      creatingTotal: "",
      creatingShowTotal: 3, //要显示的创建中的社团数量
      loadCreating: 1, //同上(创建中的社团)
      openStatus0: false,
      openStatus1: false,
      openStatus2: false
    };
  },
  // computed: {
  //   ...mapState(["clubOrgs", "clubName"])
  // },
  onLoad(options) {
    // this.status = options.status;
    // console.log(this.status);
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    this.claimShowTotal = 3;
    this.loadClaim = 1;
    this.openStatus0 = false;
    this.createdShowTotal = 3;
    this.loadCreated = 1;
    this.openStatus2 = false;
    this.keyword = options.keyword;
    this.cms_school_id = options.cms_school_id;
    this.getInfo();
  },
  onShow() {},
  methods: {
    getInfo() {
      //未认领
      orgs({
        keyword: this.keyword,
        cms_school_id: this.cms_school_id,
        org_status: 30,
        pagesize: 3
      }).then(res => {
        console.log(res, res.meta);
        this.claimData = res.data;
        this.claimTotal = res.meta.total;
      });
      //创建中
      claimsGet({
        keyword: this.keyword,
        cms_school_id: this.cms_school_id,
        audit_status: 10
        // user_id: wx.getStorageSync("silentlogin").user_id
      }).then(res => {
        console.log(res.meta, 159);
        this.creatingData = res.data;
        this.creatingTotal = res.meta.total;
      });
      //已创建
      orgs({
        keyword: this.keyword,
        cms_school_id: this.cms_school_id,
        org_status: 20,
        pagesize: 3
      }).then(res => {
        console.log(res, res.meta);
        this.createdData = res.data;
        this.createdTotal = res.meta.total;
      });
    },
    open(id) {
      if (id == 0) {
        this.openStatus0 = !this.openStatus0;
        this.claimShowTotal = this.openStatus0 ? this.claimTotal : 3;
        if (this.openStatus0 && this.loadClaim == 1) {
          this.moreClaim();
          this.loadClaim = 2;
        }
      } else if (id == 1) {
        this.openStatus1 = !this.openStatus1;
        this.creatingTotal = this.openStatus1 ? this.creatingTotal : 3;
        if (this.openStatus1 && this.loadCreating == 1) {
          this.moreCreating();
          this.loadCreating = 2;
        }
      } else if (id == 2) {
        this.openStatus2 = !this.openStatus2;
        this.createdShowTotal = this.openStatus2 ? this.createdTotal : 3;
        if (this.openStatus2 && this.loadCreated == 1) {
          this.moreCreated();
          this.loadCreated = 2;
        }
      }
    },
    moreClaim() {
      orgs({
        keyword: this.keyword,
        cms_school_id: this.cms_school_id,
        org_status: 30,
        pagesize: this.claimTotal
      }).then(res => {
        this.claimData = res.data;
      });
    },
    moreCreated() {
      orgs({
        keyword: this.keyword,
        cms_school_id: this.cms_school_id,
        org_status: 20,
        pagesize: this.createdTotal
      }).then(res => {
        this.createdData = res.data;
      });
    },
    moreCreating() {
      claimsGet({
        keyword: this.keyword,
        cms_school_id: this.cms_school_id,
        audit_status: 10,
        pagesize: this.creatingTotal
      }).then(res => {
        console.log(res.res.meta);
        this.creatingData = res.data;
      });
    },
    toClaim(e) {
      var id = e.currentTarget.dataset.id;
      var type = e.currentTarget.dataset.type;
      var org_id = e.currentTarget.dataset.org_id;
      // 创建的社团重名
      if (this.status == "repeat") {
        wx.navigateTo({
          url: "/pages/club/index?org_id=" + e.currentTarget.dataset.org_id
        });
      } else {
        check({ keyword: this.keyword, org_id: org_id }, this.token).then(
          res => {
            var url = "../../clubInfo/buildStep1?title=";
            wx.navigateTo({
              url:
                url +
                "claim" +
                "&id=" +
                id +
                "&org_id=" +
                e.currentTarget.dataset.org_id +
                "&status=" +
                "woyao&type=" +
                type
            });
          }
        );
      }
    },
    tipsShow() {
      wx.showModal({
        title: "提示",
        content: "该社团正在审核中"
      });
    },
    toClub(id) {
      wx.navigateTo({
        url: "/pages/club/index?org_id=" + id
      });
    },
    toClubInfo(e) {
      formId(e);
      if (common.status === "dev") {
        wx.reportAnalytics("create_org_click", {
          step: "创建新社团"
        });
      }
      check({ keyword: this.keyword }, this.token).then(res => {
        wx.navigateTo({
          url: "../../clubInfo/buildStep1?org_name=" + this.keyword
        });
      });
    }
  }
};
</script>
<style scoped>
.insist {
  padding: 60rpx 40rpx 0;
}
.insist .input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
}
.insist .in {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 44rpx;
  text-align: left;
  font-size: 28rpx;
  /* color: #ccc7b8; */
  padding-left: 40rpx;
  font-size: 28rpx;
  line-height: 88rpx;
}
.insist .insistNumber {
  position: absolute;
  height: 27rpx;
  top: 42%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}

.tips {
  margin-top: 30rpx;
  color: #ff4c5b;
  font-size: 22rpx;
  margin-left: 40rpx;
}

.main_wrap {
  border-bottom: 20rpx solid #f5f5f5;
}
.main_wrap:last-child {
  margin-bottom: 148rpx;
}
.title_wrap {
  padding: 0 40rpx;
}
.title {
  margin-top: 55rpx;
  border-bottom: 1px solid #e6e6e6;
}
.title span:first-child {
  font-size: 34rpx;
  color: #332503;
}
.title span:nth-child(2) {
  margin-left: 514rpx;
  font-size: 26rpx;
  color: #ccb166;
}
.title p {
  font-size: 26rpx;
  padding-bottom: 14rpx;
  color: #99958a;
  margin-top: 10rpx;
}
.contain {
  /* padding: 40rpx 0rpx 40rpx; */
  /* margin-bottom: 148rpx; */
  padding: 0 40rpx 50rpx;
}
.contain .contain-item {
  margin-top: 54rpx;
  overflow: hidden;
  padding-bottom: 56rpx;
  border-bottom: 1px solid #e6e6e6;
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
  margin-top: 10rpx;
}
.contain .contain-item .item_right p:nth-child(3) {
  font-size: 26rpx;
  color: #99958a;
  margin-top: 18rpx;
  font-family: "1234567890-Regular";
}

.next {
  position: fixed;
  bottom: 98rpx;
  width: 670rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: #ffb90c;
  opacity: 0.2;
  text-align: center;
  line-height: 88rpx;
}
.next span {
  font-size: 28rpx;
  color: #331900;
}

footer {
  position: fixed;
  bottom: 0rpx;
  padding: 30rpx 0;
  box-shadow: 0px -15px 15px -15px rgba(0, 0, 0, 0.12);
  background: #fff;
  z-index: 5;
}
.insistBtn {
  margin: 0 40rpx;
  width: 670rpx;
  height: 88rpx;
  background: #ffb90c;
  line-height: 88rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 30rpx;
  font-weight: bold;
}
</style>

