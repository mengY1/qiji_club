<template>
  <div>
    <header>
      <div class="navbar">
        <div class="loading" v-show="loadingShow">
          <loading></loading>
        </div>
        <block v-for="(item,index) in tabs" :index="index" :key="index">
          <div :id="index" :class="{'navbar_item_on':activeIndex == index}" class="navbar_item" @click="tabClick">
            <div class="navbar_title" :class="{'navbar_selectedTitle':activeIndex == index}">{{item.name}}</div>
          </div>
        </block>
        <div class="navbar_slider" :class="navbarSliderClass"></div>
      </div>
    </header>
    <main>
      <div :hidden="activeIndex != 0">
        <income v-on:incomeLoading="incomeAction"></income>
      </div>
      <div :hidden="activeIndex != 1">
        <pay v-on:payLoading="payAction"></pay>
      </div>
    </main>
  </div>
</template>
<script>
import income from "./income/income";
import pay from "./pay/pay";
import loading from "@/components/loading";
export default {
  data() {
    return {
      loadingShow:true,
      loadingStatus:0,
      tabs: [
        {
          name: "收入",
          type: "1",
          checked: true
        },
        {
          name: "支出",
          type: "2",
          checked: true
        }
      ],
      activeIndex: 0
    };
  },
  components: {
    income,
    pay,
    loading
  },
  onLoad(){
    this.loadingShow = true
    this.loadingStatus = 0
  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return "navbar_slider_0";
      }
      if (this.activeIndex == 1) {
        return "navbar_slider_1";
      }
    },
    navbarSelectedTitle() {
      if (this.activeIndex == 0) {
        return "navbar_selectedTitle";
      }
      if (this.activeIndex == 1) {
        return "navbar_selectedTitle";
      }
    }
  },
  methods: {
    incomeAction(){
      this.loadingStatus +=1;
      console.log(this.loadingStatus)
      this.loadingShow = this.loadingStatus==2?false:true
    },
    payAction(){
      this.loadingStatus +=1;
      console.log(this.loadingStatus)
      this.loadingShow = this.loadingStatus==2?false:true
    },
    tabClick(e) {
      this.activeIndex = e.currentTarget.id;
    }
  }
};
</script>
<style>
.navbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  position: fixed;
  top: 0;
  height: 120rpx;
  width: 100%;
  border-bottom: 1rpx solid #e6e6e6;
  background: #ffffff;
}
.navbar_item {
  position: relative;
  display: block;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  padding: 13px 0;
  text-align: center;
  font-size: 0;
}
.navbar_title {
  color: #ccc7b8;
  font-weight: bold;
  display: inline-block;
  font-size: 34rpx;
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.navbar_selectedTitle {
  color: #331900;
}
.navbar_slider {
  position: absolute;
  content: " ";
  left: 0;
  bottom: 0;
  width: 80rpx;
  height: 6rpx;
  background-color: #ff890c;
  -webkit-transition: -webkit-transform 0.1s;
  transition: -webkit-transform 0.1s;
  transition: transform 0.1s;
  transition: transform 0.1s, -webkit-transform 0.1s;
}
.navbar_slider_0 {
  left: 147rpx;
  transform: translateX(0);
}
.navbar_slider_1 {
  left: 147rpx;
  transform: translateX(378rpx);
}

main {
  margin-top: 120rpx;
}
</style>

