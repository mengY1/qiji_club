<template>
    <div class="grade">
        <div class="input">
            <div class="in">
              <picker :range="gradeArr" :value="index" @change="gradeChange">
                <text v-show="index==-1" style="color:#ccc7b8">请选择年级</text>
                <text v-show="index==-1" style="color:#ccc7b8;float:right;margin-right:80rpx">></text>
                <text v-if="index>=0">{{gradeArr[index]}}</text>
              </picker>
            </div>
        </div>
    </div>

    
</template>
<script>
export default {
  data() {
    return {
      gradeFocus: true,
      gradeName: "",
      professionFocus: true,
      professionName: "",
      gradeArr:["大一","大二","大三","大四","研究生"],
      index:-1,
      grade:0
    };
  },
  updated() {
    this.$emit("grade",this.grade)
  },
  methods: {
    gradeChange(e){
      this.index = e.target.value
      this.grade = Number(this.index)+1;
      console.log(this.grade)
    },
    professionFocu() {
      this.professionFocus = false;
    },
    professionBlu() {
      this.professionName == ""
        ? (this.professionFocus = true)
        : (this.professionFocus = false);
    }
  }
};
</script>
<style scoped>
.grade {
  padding-top:40rpx;
}
.grade .input {
  width: 100%;
  height: 88rpx;
  background: #f5f5f5;
  border-radius: 44rpx;
  position: relative;
  margin-bottom: 40rpx;
}
.grade .in {
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
.grade .gradeNumber {
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
