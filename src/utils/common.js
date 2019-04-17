import {
  formids
} from "@/utils/api"
let testInterface = "https://api.54qj.com/api/" //正式环境接口域名
let url = "https://cdn.54qj.com/" //正式环境文件域名
let status = "dev" //test为测试环境，dev为正式环境，正式环境才上报自定义分析数据
console.log(process.env.NODE_ENV, "process")
if (process.env.NODE_ENV == 'test') {
  console.log('这是测试环境')
  testInterface = "http://54qjapi.54qn.cn/api/" //测试环境接口域名
  url = "http://54qjapi.54qn.cn/" //测试环境文件域名
  status = "test"
} else if (process.env.NODE_ENV == "mine") {
  console.log("开发的内部环境")
  testInterface = "http://7479805f.ap.ngrok.io/api/"
  url = "http://54qjapi.54qn.cn/"
  status = "test"
}
const logoUrl = "?imageMogr2/thumbnail/!200x200r/gravity/Center/crop/200x200/format/jpg/blur/1x0/quality/100|imageslim" //社团logo
const otherUrl = "?imageMogr2/thumbnail/!670x376r/gravity/Center/crop/670x376/format/jpg/blur/1x0/quality/100|imageslim" //活动封面，banner社团相册
//获取当前日期
var date = "begin" //人气活动王的状态
console.log(Date.parse(new Date("2018/11/19 00:00")), "活动结束时间戳", Date.parse(new Date()), "当前时间戳")
if (Date.parse(new Date()) >= Date.parse(new Date("2018/11/19 00:00"))) {
  date = "end"
}
console.log(date, "人气活动王状态")
// var date = 19//19号结束活动(测试使用)
export function findElem(arrayToSearch, attr, val) {
  for (var i = 0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i][attr] == val) {
      return true;
    }
  }
  return false;
}

//消息推送需要的formId
export function formId(e) {
  console.log(e)
  var openid = wx.getStorageSync('silentlogin').openid
  var formId = e.target.formId
  console.log('form_id', formId)
  formids({
    open_id: openid,
    form_id: formId
  })
}
//跳转到首页并且刷新页面
export function backIndex() {
  wx.switchTab({
    url: "/pages/index/index",
    success: function () {
      var page = getCurrentPages().pop();
      page.onLoad();
    }
  });
}
//进入授权页面(苹果手机在遇到多个跳转的时候不会在启动的配置文件处执行跳转到授权页面)
export function toShouquan() {
  wx.getSystemInfo({
    success(res) {
      console.log(res,'手机系统信息')
      var model = res.model.substr(0,6)
      if(model==="iPhone"){
        console.log("卧槽又是苹果手机")
        if(!wx.getStorageSync("userInfo")){
          wx.navigateTo({
            url:"/pages/login/shouquan/shouquan"
          })
        }
      }
    }
  })
}
export default {
  testInterface,
  url,
  status,
  logoUrl,
  otherUrl,
  formId,
  backIndex,
  date
}
