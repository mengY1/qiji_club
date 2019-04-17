<template>
  <div class="incomeDetail">
    <div class="loading" v-show="loadingShow">
      <loading></loading>
    </div>
    <div>
      <p>{{status==0?"收入金额":"支出金额"}}
        <span>{{main.amount}}</span>
      </p>
      <div class="item">
        <p>类型
          <span>{{main.type_name}}</span>
        </p>
        <p>创建时间
          <span>{{main.created_at}}</span>
        </p>
        <p v-if="main.status==20">审核时间
          <span>{{main.audit_at}}</span>
        </p>
        <p v-if="main.status==40">提现成功时间
          <span>{{main.wechat_payment_time}}</span>
        </p>
        <p>交易订单号
          <span>{{main.number}}</span>
        </p>
        <!-- <p>剩余金额
                    <span>{{main.remain}}</span>
                </p> -->
      </div>
      <div class="remarks">
        <p>标题
          <span>{{main.title}}</span>
        </p>
        <p>订单状态
          <span v-if="main.status==10">审核中</span>
          <span v-else-if="main.status==20">审核通过</span>
          <span v-else-if="main.status==30">审核不通过</span>
          <span v-else-if="main.status==40">提现成功</span>
          <span v-else-if="main.status==50">提现失败</span>
        </p>
        <p v-if="main.status==50">驳回原因
          <span>{{main.wechat_pay_fail_msg}}</span>
        </p>
        <p v-else-if="main.status==30">驳回原因
          <span>{{main.audit_remark}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { billsDetails } from "@/utils/api";
import loading from "@/components/loading";
export default {
  data() {
    return {
      loadingShow: true,
      main: "",
      token: "",
      bill_id: "",
      org_id: "",
      status: ""
    };
  },
  components: {
    loading
  },
  onLoad(options) {
    this.loadingShow = true;
    this.bill_id = options.bill_id;
    this.org_id = wx.getStorageSync("org_id");
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    this.status = options.status;
    if (options.status == 1) {
      wx.setNavigationBarTitle({
        title: "支出详情"
      });
      this.getPayInfo();
    } else {
      this.getIncomeInfo();
    }
  },
  methods: {
    getPayInfo() {
      billsDetails(this.org_id, this.bill_id, {}, this.token, true).then(
        res => {
          this.main = res;
          this.loadingShow = false
          console.log(this.main);
        }
      ).catch(err=>{
        this.loadingShow = false;
      });
    },
    getIncomeInfo() {
      billsDetails(this.org_id, this.bill_id, {}, this.token, true).then(
        res => {
          this.main = res;
          this.loadingShow = false
        }
      ).catch(err=>{
        this.loadingShow = false;
      });
    }
  }
};
</script>
<style scoped>
.incomeDetail {
  padding-left: 40rpx;
}
.incomeDetail p {
  font-size: 28rpx;
  color: #99958a;
}
.incomeDetail span {
  color: #331900;
  font-size: 28rpx;
  float: right;
}
.incomeDetail > div > p:first-child {
  line-height: 112rpx;
  border-bottom: 1px solid #e6e6e6;
  padding-right: 42rpx;
}
.incomeDetail > div > p:first-child span {
  font-size: 44rpx;
}

.item {
  line-height: 50rpx;
  padding: 30rpx 42rpx 30rpx 0;
  border-bottom: 1px solid #e6e6e6;
}
.remarks {
  padding-right: 42rpx;
  line-height: 50rpx;
  margin-top: 26rpx;
}
</style>

