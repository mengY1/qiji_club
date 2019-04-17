<script>
import { silentlogin, access_token } from "@/utils/api";
import common from "@/utils/common";
export default {
  created() {
    // 调用API从本地缓存中获取数据
  },
  onShow(options) {
    wx.setStorageSync("scene", options.scene);
    // if(options)
    var that = this;
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
    });
    updateManager.onUpdateReady(function() {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否马上重启小程序？",
        success: function(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });
    // 查看是否授权
    wx.getSetting({
      success: function(res) {
        res.authSetting["scope.userInfo"];
        if (
          wx.getStorageSync("userInfo").code &&
          wx.getStorageSync("user_school_id") &&
          wx.getStorageSync("silentlogin")
        ) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          if (wx.getStorageSync("silentlogin").token) {
            // that.refreshToken();
            if (common.status === "dev") {
            }
          }
          wx.getUserInfo({
            success: function(res) {}
          });
        } else {
          if (JSON.stringify(options.query) != "{}") {
            // 有分享的参数进入，需要先跳转到指定页面后再去授权页
            setTimeout(() => {
              wx.navigateTo({
                url: "/pages/login/shouquan/shouquan"
              });
            }, 2000);
          } else {
            setTimeout(() => {
              wx.navigateTo({
                url: "/pages/login/shouquan/shouquan"
              });
            }, 100);
          }
        }
      }
    });
  },
  mounted() {},
  methods: {
    getInfo() {
      wx.login({
        success: function(res) {
          wx.setStorageSync("code", res.code);
        }
      });
    },
    refreshToken() {
      if (!wx.getStorageSync("silentlogin").refresh_token) {
        wx.navigateTo({
          url: "/pages/login/shouquan/shouquan"
        });
      } else {
        // var refresh_token = wx.getStorageSync("silentlogin").refresh_token;
        // access_token({ refresh_token: refresh_token }).then(res => {
        //   var silentMsg = wx.getStorageSync("silentlogin");
        //   silentMsg.token = res.access_token;
        //   silentMsg.refresh_token = res.refresh_token;
        //   wx.setStorageSync("silentlogin", silentMsg);
        // });
      }
    }
  }
};
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
