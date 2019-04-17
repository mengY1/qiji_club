<template>
  <div>
    <div class="input">
      <div class="input">
        <div class="in">
          <picker mode="multiSelector" :range="multiArray" :value="index" @columnchange="columnChange" @change="majorsChange" class="pic" @click="picAction" :disabled="pickShow">
            <text v-show="!majorsName" style="color:#ccc7b8">请选择专业</text>
            <text style="color:#ccc7b8;float:right;margin-right:80rpx">></text>
            <text v-if="majorsName">{{majorsName}}</text>
          </picker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["majors", "majorsIdArr", "multiArray"],
  data() {
    return {
      index: 0,
      cms_major_id: "",
      majorsName: "",
      value: "", //修改的第一列的值
      pickShow: true,
      multiIndex: [0, 0],
      multiArray: [],
      data1: ""
    };
  },
  watch: {
    value(n, o) {
      this.multiIndex[1] = 0;
    },
    majors(n, o) {
      this.majorsName = "";
      this.cms_major_id = "";
      this.pickShow = true;
    }
  },
  updated() {
    // if (this.majors.length > 0) {
    //   if (this.majors[0].child) {
    //     this.majorsName = this.majors[this.multiIndex[0]].child[
    //       this.multiIndex[1]
    //     ].name;
    //     this.cms_major_id = this.majors[this.multiIndex[0]].child[
    //       this.multiIndex[1]
    //     ].major_id;
    //   }
    // }
    if (this.majors.length > 0) {
      this.pickShow = false;
    }
    this.$emit("cms_major_id", this.cms_major_id);
  },
  methods: {
    picAction() {
      console.log(this.multiArray);
      if (this.majors.length > 0) {
        this.pickShow = false;
      } else {
        this.pickShow = true;
      }
      this.$emit("pickShow", this.pickShow);
    },
    // 选择的最终专业
    majorsChange(e) {
      // console.log(e.target.value);
      // this.index = e.target.value;
      // var i = this.index;
      // this.cms_major_id = this.majorsIdArr[i];
      // var id = this.cms_major_id;
      this.majorsName = this.majors[this.multiIndex[0]].child[
        this.multiIndex[1]
      ].name;
      this.cms_major_id = this.majors[this.multiIndex[0]].child[
        this.multiIndex[1]
      ].major_id;
      var id = this.majors[this.multiIndex[0]].child[this.multiIndex[1]]
        .major_id;
      console.log(
        this.majors[this.multiIndex[0]].child[this.multiIndex[1]].major_id
      );
      this.$emit("cms_major_id", id);
    },
    // 一级菜单的选择变化
    columnChange(e) {
      var that = this;
      var column = e.target.column; //修改的列
      var value = e.target.value; //修改的列对应的值
      // 把第一列的值保留起来监听
      if (column == 0) {
        this.value = value;
      }
      console.log(this.value);
      this.multiIndex[column] = value;
      console.log(this.multiIndex); //一级菜单的下标及二级菜单的下标
      var i = that.multiIndex[0]; //第一列的值
      var data = { multiArray: that.multiArray, multiIndex: that.multiIndex };
      data.multiIndex[column] = value;
      that.multiArray[1] = [];
      for (var k = 0; k < that.majors[i].child.length; k++) {
        that.multiArray[1].push(that.majors[i].child[k].name);
      }
      // switch (column) {
      //   case 0:
      //     switch (that.multiIndex[0]) {
      //       case i:

      //         console.log(that.multiArray);
      //     }
      //     break;
      // }
      this.data1 = data;
    }
  }
};
</script>
<style scoped>
.input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
}
.in {
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
.majorsNumber {
  position: absolute;
  height: 27rpx;
  top: 44%;
  left: 40rpx;
  transform: translate(0, -50%);
  text-align: center;
  font-size: 28rpx;
  color: #ccc7b8;
}
</style>

