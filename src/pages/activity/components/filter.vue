<template>
  <div class="filter">
    <!-- 活动类型  -->
    <header>
      <scroll-view scroll-x="true" style="border-bottom: 1rpx solid #e6e6e6;height:88rpx">
        <div class="navbar">
          <block v-for="(item,index) in tabs" :index="index" :key="index">
            <div :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick">
              <form @submit="submit" report-submit='true'>
                <button form-type="submit" class="navbar_title" :class="{'navbar_selectedTitle':activeIndex == index}">{{item.name}}</button>
              </form>
              <div class="navbar_slider" v-if="index==activeIndex"></div>
            </div>
          </block>
        </div>
      </scroll-view>
      <!--选项卡-->
      <div class="tabTit box tc bg_f">
        <div class="flex1" :class="!tab[index]?' active':''" v-for="(item,index) in tabTxt" :key="index" :data-index="index" @click="filterTab">
          <text>{{item}}</text>
          <!-- <img src="/static/images/common/xiangxia.png"> -->
          <span class="iconfont icon-down-"></span>
        </div>
      </div>
    </header>
    <!-- 遮罩层 -->
    <div class="bgShadow" v-show="bgShow" @click="bgShowAction"></div>
    <!--筛选项-->
    <div class="tabLayer tc" :hidden="tab[0]">
      <div :class="house_type==0?'active':''" data-id="0" data-index="0" data-txt="进行中" data-status=20 @click="filter">进行中</div>
      <div :class="house_type==0?'active':''" data-id="0" data-index="0" data-txt="已结束" data-status=50 @click="filter">已结束</div>
      <div :class="house_type==0?'active':''" data-id="0" data-index="0" data-txt="全部" data-status=" " @click="filter">全部</div>
    </div>
    <div class="tabLayer tc" :hidden="tab[1]">
      <div :class="house_style==0?'active':''" data-id="0" data-index="1" data-txt="近三天" data-status=1 @click="filter">近三天</div>
      <div :class="house_style==0?'active':''" data-id="0" data-index="1" data-txt="近七天" data-status=2 @click="filter">近七天</div>
      <div :class="house_style==0?'active':''" data-id="0" data-index="1" data-txt="近一个月" data-status=3 @click="filter">近一个月</div>
      <div :class="house_style==0?'active':''" data-id="0" data-index="1" data-txt="全部时间" data-status=0 @click="filter">全部时间</div>
    </div>
    <div class="tabLayer tc" :hidden="tab[2]" v-if="activeIndex!=3">
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="本校" data-status="school" @click="filter">本校</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="同城" data-status="city" @click="filter">同城</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="全国" data-status="all" @click="filter">全国</div>
    </div>
    <div class="tabLayer tc" :hidden="tab[2]" v-if="activeIndex==3">
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="国际级" data-status=1 @click="filter">国际级</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="国家级" data-status=2 @click="filter">国家级</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="省级" data-status=3 @click="filter">省级</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="市级" data-status=4 @click="filter">市级</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="校级" data-status=5 @click="filter">校级</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="自由级" data-status=6 @click="filter">自由级</div>
      <div :class="house_area==0?'active':''" data-id="0" data-index="2" data-txt="全部级别" data-status=" " @click="filter">全部级别</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tabs: [
        {
          name: "社团活动"
        },
        {
          name: "招聘活动"
        },
        {
          name: "学术活动"
        },
        {
          name: "竞赛活动"
        },
        {
          name: "考研活动"
        }
      ],
      activeIndex: 0,
      data: [], //数据
      house_type: 0, //全部
      house_style: 0, //全部时间
      house_area: 0, //本校
      tabTxt: ["全部", "全部时间", "同城"], //tab文案
      tab: [true, true, true],
      bgShow: false,
      statusArr: ["", 0, "city"]
    };
  },
  computed: {},
  methods: {
    bgShowAction() {
      this.bgShow = false;
      this.tab = [true, true, true];
    },
    tabClick(e) {
      this.bgShowAction();
      if (this.activeIndex != 3 && e.currentTarget.id == 3) {
        this.tabTxt[2] = "全部级别";
        this.statusArr[2] = " ";
      }
      if (this.activeIndex == 3 && e.currentTarget.id != 3) {
        this.tabTxt[2] = "同城";
        this.statusArr[2] = "city";
      }
      if (this.activeIndex != e.currentTarget.id) {
        this.$emit("statusAction", [
          this.statusArr,
          e.currentTarget.id,
          this.tabTxt
        ]);
      }
      this.activeIndex = e.currentTarget.id;
    },
    // 选项卡
    filterTab: function(e) {
      var data = [true, true, true],
        index = e.currentTarget.dataset.index;
      data[index] = !this.tab[index];
      this.tab = data;
      if (!this.tab[index]) {
        this.bgShow = true;
      } else {
        this.bgShow = false;
      }
    },
    //筛选项点击操作
    filter: function(e) {
      this.bgShow = false;
      var self = this,
        id = e.currentTarget.dataset.id,
        txt = e.currentTarget.dataset.txt,
        tabTxt = this.tabTxt,
        status = e.currentTarget.dataset.status;
      switch (e.currentTarget.dataset.index) {
        case "0":
          tabTxt[0] = txt;
          (this.data = []), (this.tab = [true, true, true]);
          this.tabTxt = tabTxt;
          this.house_type = id;
          this.statusArr[0] = status ? status : "";
          break;
        case "1":
          tabTxt[1] = txt;
          (this.data = []), (this.tab = [true, true, true]);
          this.tabTxt = tabTxt;
          this.house_type = id;
          this.statusArr[1] = status;
          break;
        case "2":
          tabTxt[2] = txt;
          (this.data = []), (this.tab = [true, true, true]);
          this.tabTxt = tabTxt;
          this.house_type = id;
          this.statusArr[2] = status;
          break;
      }
      //数据筛选
      this.$emit("statusAction", [
        this.statusArr,
        this.activeIndex,
        this.tabTxt
      ]);
    }
  }
};
</script>
<style scoped>
@import "../../../style/icon.css";
page {
  padding: 90rpx 0 50px;
}
.iconfont {
  color: #999;
  display: inline-block;
  font-size: 16rpx;
  margin-left: 16rpx;
}
.icon-xiajiantou {
  margin-left: 10rpx;
  display: inline-block;
  padding-top: 0rpx;
}
.icon-down--copy-copy-copy {
  font-size: 20rpx;
  margin-left: 8rpx;
  display: inline-block;
  /* padding-top: 0rpx; */
  margin-top: -2rpx;
}
header {
  position: fixed;
  width: 750rpx;
  z-index: 100;
  background: #fff;
  top: 0;
}

.navbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  /* position: fixed;
  top: 0; */
  height: 88rpx;
  background: #ffffff;
  z-index: 5;
}
.navbar_item {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  /* padding:0rpx 10rpx; */
  text-align: center;
  font-size: 0;
}
.navbar_title {
  background: #fff;
  color: #333333;
  display: inline-block;
  font-size: 28rpx;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
button::after {
  border: none;
}

.navbar_selectedTitle {
  color: #331900;
}
.navbar_slider {
  position: absolute;
  content: " ";
  left: 60rpx;
  top: 84rpx;
  width: 50rpx;
  height: 4rpx;
  background-color: #ffb90c;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}

.filter {
  font-size: 28rpx;
}
.tl {
  text-align: left;
}
.tc {
  text-align: center;
}
.tr {
  text-align: right;
}
.box {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}
.flex1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  box-flex: 1;
  flex: 1;
  overflow: hidden;
  display: block;
}

.bgShadow {
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100vh;
  z-index: 50;
  position: fixed;
}
.tabTit {
  height: 90rpx;
  line-height: 90rpx;
  border-bottom: solid 1px #e6e6e6;
  width: 750rpx;
  z-index: 100;
  background: #fff;
}

.tabTit .active {
  color: #ffb90c;
  background: #fff;
}

.tabTit .active span {
  /* transform: rotate(180deg); */
  background: none;
  color: #ffb90c;
}

.tabTit img {
  width: 16rpx;
  height: 10rpx;
  vertical-align: middle;
  margin-left: 5px;
}

.tabLayer {
  /* box-shadow: 0 5px 5px rgba(0, 0, 0, 0.15); */
  width: 750rpx;
  overflow: hidden;
  position: fixed;
  top: 184rpx;
  z-index: 1;
  background: #fff;
  border-bottom: solid 1px #eee;
  z-index: 100;
}

.tabLayer text {
  width: 210rpx;
  height: 60rpx;
  line-height: 60rpx;
  float: left;
  border: solid 1px #eee;
  margin: 20rpx 0 0 26rpx;
}

.tabLayer .active {
  color: #333;
  line-height: 88rpx;
  border-bottom: 1px solid #e6e6e6;
  text-align: left;
  padding-left: 62rpx;
}

.case {
  height: 640rpx;
  margin: 30rpx auto 0;
  background: #fff;
  border: solid 1px #f1f1f1;
  overflow: hidden;
}

.case .title {
  font-size: 33rpx;
  color: #000;
  margin-top: 5rpx;
}

.case .title,
.case .tag {
  padding: 0 5rem 0 15px;
}

.case .tag {
  font-size: 28rpx;
}

.case .pic {
  width: 100%;
  height: 510rpx;
}

.case .headPic {
  right: 10px;
  top: 455rpx;
}

.case .headPic img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: solid 6rpx #fff;
}

.case .headPic text {
  display: block;
  font-size: 28rpx;
  margin-top: -6rpx;
}
</style>
