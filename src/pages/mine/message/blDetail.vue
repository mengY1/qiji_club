<template>
  <div class="wrapper">
    <div class="discuss">
      <div class="discuss-item">
        <div class="item_top">
          <img :src="url+commentInfo.from_avatar">
          <div class="username">
            <p>{{commentInfo.from_realname}}</p>
          </div>
          <div class="time">
            <p>{{commentInfo.created_at}}</p>
          </div>
        </div>
        <div class="item_middle">
          <p>{{commentInfo.content}}</p>
        </div>
        <div class="item_bottom">
          <!-- 下面的是回复的区域 -->
          <div class="replyArea">
            <ul>
              <li
                v-for="(ite,ind) in commentInfo.reply"
                :index="ind"
                :key="ind"
                :data-id="ite.comment_id"
                @click="bindReply(ite.comment_id,ite.from_user_realname)"
              >
                <p v-show="ite.is_reply_layer==1">
                  <span>{{ite.from_user_realname}} </span>{{ite.content}}
                </p>
                <p v-show="ite.is_reply_layer==0">
                  <span> {{ite.from_user_realname}} </span>
                  回复
                  <span> {{ite.to_user_realname}} </span>
                  {{ite.content}}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        @click="toActivity"
        style="width:131rpx;height:25rpx;font-size:26rpx;font-family:PingFang-SC-Medium;font-weight:500;color:rgba(87,107,149,1);line-height:40rpx;margin-top:30rpx;"
      >查看原信息</div>
    </div>
    <div class="hfK">
      <div
        class="appear"
        :style="style"
        :class="getSystem"
      >
        <input
          :cursor-spacing="0"
          :show-confirm-bar="false"
          @blur="outBlur"
          @focus="inFous"
          :focus="fs"
          @confirm="bindKeyInputReply"
          :placeholder="hfXXX"
          confirm-type="confirm"
          v-model="msgRL"
          :adjust-position="false"
        />
        <span
          class="send"
          :data-id="msgRL"
          :class="getSystem"
          @click="bindKeyInputReply"
        >发送</span>
      </div>
    </div>
  </div>
</template>

<script>
import { blDetails, newsReply } from "@/utils/api";
import url from "@/utils/common";
export default {
  components: {},
  props: {},
  data() {
    return {
      commentInfo: "",
      url: url.url,
      style: "position:fixed;bottom:0;left:0;",
      bottom: "",
      hfXXX: "",
      top_id: "",
      top_id2: "",
      act_id: "",
      token: " ",
      msgRL: "",
      fs: "",
      comment_id: "",
      from_user_realname: "",
      type: ""
    };
  },
  onPageScroll(obj) {
    this.style = "position:fixed;bottom:0;left:0;";
  },
  watch: {},
  computed: {},
  methods: {
    outBlur() {
      this.fs = false;
      this.style = `position:fixed;bottom:0;left:0;`;
    },
    toActivity() {
      console.log(this.act_id)
      wx.navigateTo({
        url: `../../index/news/index?new_id=${this.act_id}`
      });
    },
    bindReply(comment_id, user) {
      console.log(user);
      this.top_id = comment_id;
      this.hfXXX = `回复：${user}`;
      this.fs = true;
    },
    inFous(e) {
      this.fs = true;
      this.bottom = e.mp.detail.height;
      this.style = `position:fixed;bottom:${this.bottom}px;left:0;`;
    },
    bindKeyInputReply(e) {
      if (e.target.value) {
        this.content = e.target.value;
      }
      if (e.target.dataset.id) {
        this.content = e.target.dataset.id;
      }
      console.log(this.act_id);
      console.log(this.comment_id);
      newsReply(
        this.act_id,
        this.comment_id,
        { content: this.content },
        this.token
      ).then(res => {
        console.log(res);
        console.log(this.main);
        this.fs = false;
        this.msgRL = "";
        this.hfXXX = `回复：${this.from_user_realname}`;
        this.style = "position:fixed;bottom:0;left:0";
        for (let i = 0; i < this.commentInfo.length; i++) {
          if (this.commentInfo[i].top_id == res.top_id) {
            this.commentInfo[i].reply.push(res);
          }
        }
        setTimeout(() => {
          blDetails(this.act_id,this.top_id2).then(res => {
            this.commentInfo = res;
            console.log(this.commentInfo);
          });
        }, 100);
        wx.showToast({
          title: "回复成功"
        });
      });
    }
  },
  created() {},
  onLoad(options) {
    console.log(9999999999999999999999999999);
    this.fs = true;
    this.token = " ";
    this.token += wx.getStorageSync("silentlogin").token;
    console.log(options);
    this.top_id = options.top_id;
    this.top_id2 = options.top_id;
    this.act_id = options.act_id;
    this.type = options.type;
    this.comment_id = options.comment_id;
    console.log(this.comment_id);
    this.from_user_realname = options.from_user_realname;
    this.hfXXX = `回复：${this.from_user_realname}`;
    blDetails(this.act_id, options.top_id).then(res => {
      this.commentInfo = res;
      this.fs = false;
      console.log(this.commentInfo);
    });
  }
};
</script>
<style scoped>
.discuss {
  padding: 0 20rpx 20rpx 20rpx;
  overflow: hidden;
  position: relative;
  padding-bottom: 300rpx;
}
.discuss .noPL {
  margin-top: 30rpx;
  text-align: center;
  color: #99958a;
  font-size: 15px;
}
.discuss .discuss-item {
  margin-top: 60rpx;
  overflow: hidden;
  border-bottom: 1px solid #e6e6e6;
}
.discuss .discuss-item .item_top {
  overflow: hidden;
  position: relative;
}
.discuss .discuss-item .item_top img {
  width: 80rpx;
  height: 80rpx;
  float: left;
}
.discuss .discuss-item .item_top .username {
  float: left;
  margin-left: 24rpx;
  overflow: hidden;
}
.discuss .discuss-item .item_top .username p {
  font-size: 30rpx;
  color: #332503;
  font-weight: bold;
  line-height: 37rpx;
  position: absolute;
  top: 22rpx;
  left: 110rpx;
}

.discuss .discuss-item .item_top .time {
  font-size: 22rpx;
  color: #99958a;
  position: absolute;
  top: 22rpx;
  right: 0;
}
.discuss .discuss-item .item_middle {
  font-size: 26rpx;
  color: #332503;
  margin-top: 30rpx;
  line-height: 40rpx;
}
.discuss .discuss-item .item_bottom {
  margin-top: 29rpx;
  text-align: right;
  position: relative;
  margin-bottom: 65rpx;
}
.discuss .discuss-item .item_bottom .huiFu {
  width: 50rpx;
  height: 20rpx;
  position: absolute;
  bottom: -10rpx;
  right: 3rpx;
  margin-bottom: 20rpx;
}
.discuss .discuss-item .item_bottom img {
  width: 32rpx;
  height: 34rpx;
  position: absolute;
  top: 10rpx;
  right: 60rpx;
}
.discuss .discuss-item .item_bottom text {
  font-size: 22rpx;
  color: #99958a;
}
.discuss .discuss-item .item_bottom .replyArea {
  font-size: 22rpx;
  color: #99958a;
  float: left;
  width: 670rpx;
  height: 100%;
  background: rgba(245, 245, 245, 1);
  border-radius: 8rpx;
  margin-bottom: 30rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul {
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  line-height: 40rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul li {
  overflow: hidden;
}
.discuss .discuss-item .item_bottom .replyArea ul li p {
  font-size: 26rpx;
  float: left;
  text-align: left;
  padding: 10rpx 0 10rpx 20rpx;
}
.discuss .discuss-item .item_bottom .replyArea ul li p span {
  color: #576b95;
}
.appear {
  width: 750rpx;
  height: 108rpx;
  background: #fff;
  border-top: 1px solid #eaeaea;
}
.appear input {
  float: left;
  width: 570rpx;
  height: 72rpx;
  background: rgba(245, 245, 245, 1);
  border-radius: 8rpx;
  margin: 20rpx 0 0 20rpx;
  font-size: 26rpx;
  padding-left: 10rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #000;
  line-height: 72rpx;
}
.appear .send {
  float: right;
  width: 120rpx;
  height: 72rpx;
  background: rgba(255, 185, 12, 1);
  border-radius: 8rpx;
  font-size: 26rpx;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(65, 41, 27, 1);
  line-height: 72rpx;
  text-align: center;
  margin: 20rpx 20rpx 0 0rpx;
}
</style>