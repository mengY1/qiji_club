export function toSharePage(options) {
  console.log(111, options.sponsor_id)
  if (options.toClaim) {
    //邀请好友来认领
    wx.navigateTo({
      url: "/pages/mine/buildClub/beInvited/index?avatar=" + options.avatar + "&userName=" + options.userName + "&org_id=" + options.org_id
    })
  } else if (options.sponsor_id) {
    //活动赞助详情
    wx.navigateTo({
      url: "/pages/index/actSupport/detail?sponsor_id=" + options.sponsor_id
    });
  } else if (options.org_id) {
    wx.navigateTo({
      url: "/pages/club/index?org_id=" + options.org_id + "&channel=friends"
    })
  } else if (options.key) {
    //移交社长（新社长）
    wx.navigateTo({
      url: "/pages/club/remove/newProprieter?key=" + options.key
    })
  } else if (options.act_id) {
    //活动详情
    wx.navigateTo({
      url: "/pages/activity/detail/detail?act_id=" + options.act_id + "&channel=friends"
    })
  }
  // 海报跳转（获取的参数例子act=123&type=1或者org=123）
  var scene = decodeURIComponent(options.scene); //小程序码扫描进入的参数
  var arr = scene.split("=");
  if (arr[0] === "key") {
    // 移交社长（新社长）
    wx.navigateTo({
      url: "/pages/club/remove/newProprieter?key=" + arr[1]
    })
  }
  if (arr[0] == "org") {
    wx.navigateTo({
      url: "/pages/club/index?org_id=" + arr[1]
    });
  } else if (arr[0] == "act") {
    // 二次分割出123&type
    var actArr = arr[1].split("&");
    if (arr[2] == 1) {
      wx.navigateTo({
        url: "/pages/activity/detail/detail?act_id=" + actArr[0]
      });
    } else if (arr[2] == 2) {
      wx.navigateTo({
        url: "/packageA/activity/recruitmentActivities/recruitmentDetails?act_id=" +
          actArr[0]
      });
    } else if (arr[2] == 3) {
      wx.navigateTo({
        url: "/packageA/activity/academicEvents/academicDetails?act_id=" +
          actArr[0]
      });
    } else if (arr[2] == 4) {
      wx.navigateTo({
        url: "/packageA/activity/competitionActivity/competitionDetails?act_id=" +
          actArr[0]
      });
    } else if (arr[2] == 5) {
      wx.navigateTo({
        url: "/packageA/activity/graduate/graduate?act_id=" + actArr[0]
      });
    }
  }
}
