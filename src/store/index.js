// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutation'
import actions from './action'
import state from './state'
// import xml2json from 'xmlstring2json'
// import { formatSlideList, formatNewsList, formatTopicList } from '@/utils'
// import api from '@/utils/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
