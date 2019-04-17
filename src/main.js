import Vue from 'vue'
import App from '@/App'
import store from '@/store'

Vue.config.productionTip = false
App.store = store
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: ["pages/login/shouquan/shouquan"],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black',
      // navigationStyle:"custom"
    },
    networkTimeout:{
      request:30000
    },
    permission: {
      "scope.userLocation": {
        desc: "奇集需要获取你的位置以便提供更好的内容推荐服务"
      }
    },
    "navigateToMiniProgramAppIdList":[
      "wx9932fe68bacd1398",
      "wx99418b7b5cdcc4d4"
    ],
    tabBar: {
      "color": "#99958A",
      "selectedColor": "#331900",
      "list": [{
          "pagePath": "pages/club/all/all",
          "text": "社团",
          "iconPath": "/static/images/tabbar/shetuan_icon_default@2x.png",
          "selectedIconPath": "/static/images/tabbar/shetuan_icon@2x.png",
        },
        {
          "pagePath": "pages/index/actSupport/index",
          "text": "赞助",
          "iconPath": "/static/images/tabbar/index.png",
          "selectedIconPath": "/static/images/tabbar/selectedIndex.png"
        },
        {
          "pagePath": "pages/mine/index",
          "text": "我的",
          "iconPath": "/static/images/tabbar/mine.png",
          "selectedIconPath": "/static/images/tabbar/selectedMine.png"
        }
      ]
    }
  }
}
