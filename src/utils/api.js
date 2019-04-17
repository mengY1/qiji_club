// import request from './request'
//status参数在请求接口的方法里传值，默认为false，ajax处的showLoading会默认显示，传true则不让其显示
// status2参数在请求接口的方法里传值，默认为false，ajax处的400接口弹窗会默认显示，传true则不让其显示
import {
  ajaxGet,
  ajaxDelete
} from './ajax'
import {
  ajaxPost
} from './ajax'
import {
  ajaxPut
} from './ajax'
import {
  Agent
} from 'http';
//公共分类

//商家优惠券列表
export function storeList(token, res) {
  return ajaxGet("m/business/coupon", res, token, true)
}
//商家优惠券详情
export function storeDetails(coupon_id, token, res) {
  return ajaxGet("m/business/coupon/" + coupon_id, token, res)
}
//生成商家海报
export function storePoster(coupon_id, token, res) {
  return ajaxGet("m/business/coupon/" + coupon_id + "/poster", token, res)
}
//音乐节场次详情
export function musicConcert(concert_id, token, res) {
  return ajaxGet("m/concerts/" + concert_id, token, res)
}
//场次门票记录
export function sessionTickets(concert_id, token, res) {
  return ajaxGet("m/concerts/" + concert_id + "/tickets", token, res)
}
//当前用户的门票
export function userConcert(token, res) {
  return ajaxGet("m/user/concert/ticket", token, res)
}
//免费领取门票
export function freeCollection(concert_id, res, token) {
  return ajaxPost("m/concerts/" + concert_id + "/tickets", token, res)
}
//邀请码领取门票
export function inviteReceive(concert_id, res, token) {
  return ajaxPost("m/concerts/" + concert_id + "/tickets" + "/invite", token, res)
}
//判断是否打 call
export function isCalls(id, res, token) {
  return ajaxPost("m/concert/tickets/" + id + "/iscall", token, res)
}
//已领取门票的详情
export function ticketsDetails(id, token, res) {
  return ajaxGet("m/concert/tickets/" + id, token, res)
}
//打 call 操作
export function operatingCall(id, res, token) {
  return ajaxPost("m/concert/tickets/" + id + "/calls", token, res)
}
// 海报生成
export function musicPoster(token, res) {
  return ajaxGet("m/user/concert/ticket/poster", token, res)
}
//根据经纬度查询附近学校
export function nearSchool(res) {
  return ajaxGet("cms/schools/near", res)
}
//学校检索
export function schools(res) {
  return ajaxGet("cms/schools", res)
}
//专业检索
export function majorsSearch(res) {
  return ajaxGet("cms/majors", res)
}
//城市检索
export function citys(res, status) {
  return ajaxGet("cms/citys", res, "", status)
}
//省份
export function provinces(res) {
  return ajaxGet("cms/provinces", res)
}
//社团类型
export function types(res) {
  return ajaxGet("org/types", res)
}

//认证
//注册验证码
export function verifycode(res) {
  return ajaxPost("verifycode/register", res)
}
//手机号注册
export function register(res) {
  return ajaxPost("auth/program/register", res)
}
//刷新access_token
export function access_token(res) {
  return ajaxPost("auth/refresh_token", res, {}, true)
}

//小程序接口
//静默登录
export function silentlogin(res,status) {
  return ajaxPost("program/silentlogin", res,"",status)
}
//发送form_id
export function formids(res) {
  return ajaxPost("program/formids", res, {}, true)
}

//banner
// 列表
export function bannerInfo(res) {
  return ajaxGet("m/banners",
    res, {}, true)
}
// 访问量记录
export function bannerRecord(id, res, status) {
  return ajaxPost("m/banners/" + id + "/view", res, {}, status)
}

//人气活动王
// 人气活动排名
export function rank(res, status) {
  return ajaxGet("m/activities/rank", res, "", status)
}
//pick
export function pick(id, token, res, status) {
  return ajaxPost("m/activities/" + id + "/picks", token, res, status)
}
//今天的投票记录
export function picks(res, status) {
  return ajaxGet("m/activities/picks", res, "", status)
}
//获奖名单
export function winnings(token, res, status) {
  return ajaxGet("m/activities/rank/winnings", token, res, status)
}

//活动
//招聘活动详情
export function recruitmentDetails(id, token, res, status) {
  return ajaxGet("m/activities", +id, token, res, status)
}
//竞赛活动详情
export function competitionDetails(id, token, res, status) {
  return ajaxGet("m/activities", +id, token, res, status)
}
// 招聘活动举报
export function recruitmentReport(act_id, token, res) {
  return ajaxPost("m/activities/" + act_id + "/reports", token, res)
}
// 竞赛活动举报
export function competitionReport(act_id, token, res) {
  return ajaxPost("m/activities/" + act_id + "/reports", token, res)
}
// 发布活动
export function issue(token, res) {
  return ajaxPost("m/activities", token, res)
}
//更新.重新发布
export function again(id, token, res) {
  return ajaxPut("m/activities/" + id, token, res)
}
// 活动列表
export function activitiesList(token, res, status) {
  return ajaxGet("m/activities", token, res, status)
}
//活动详情
export function detailInfo(id, token, res, status) {
  return ajaxGet("m/activities/" + id, token, res, status)
}
// 活动举报
export function report(act_id, token, res) {
  return ajaxPost("m/activities/" + act_id + "/reports", token, res)
}
//取消
export function cancelAct(id, token, res) {
  return ajaxPost("m/activities/" + id + "/cancel", token, res)
}
//发布活动回顾
export function actReview(id, token, res) {
  return ajaxPost("m/activities/" + id + "/review", token, res)
}
//分享
export function shareAct(id, token, res) {
  return ajaxPost("m/activities/" + id + "/share", token, res)
}
//浏览量
export function actPv(id, token, res, status) {
  return ajaxPost("m/activities/" + id + "/pv", token, res, status)
}
//生成海报
export function actPoster(id, token, res) {
  return ajaxGet("m/activities/" + id + "/poster", token, res)
}
//修改活动简介
export function actIntroduction(id, token, res) {
  return ajaxPut("m/activities/" + id + "/introduction", token, res)
}
//活动海报模板列表
export function actTemplate(res) {
  return ajaxGet("m/templates", res)
}

// 活动评论
// 评论
export function comments(token, res) {
  return ajaxPost("comments", token, res)
}
// 活动评论
// 回复
export function reply(comment_id, token, res) {
  return ajaxPost("comments/" + comment_id + "/reply", token, res)
}
// 活动评论详情
export function commentDetail(comment_id, token, res) {
  return ajaxGet("comments/" + comment_id, token, res)
}


// 活动评论列表
export function commentsList(token, res, status) {
  return ajaxGet("comments", token,
    res, status
  )
}

//活动-报名
// 活动报名列表GET
export function membersGet(act_id, token, res, status) {
  return ajaxGet("m/activities/" + act_id + "/members", token, res, status)
}
// 活动报名POST
export function actSignUp(act_id, token, res, status1, status2) {
  return ajaxPost("m/activities/" + act_id + "/members", token, res, status1, status2)
}
//报名人数统计
export function statistical(act_id, token, res, status) {
  return ajaxGet("m/activities/" + act_id + "/members/statistical", token, res, status)
}
// 取消报名
export function cancelSignUp(act_id, token, res) {
  return ajaxDelete("m/activities/" + act_id + "/members", token, res)
}


//意见反馈
//添加
export function feedbacks(token, res) {
  return ajaxPost("feedbacks", token, res)
}

//社团-创建认领
//列表
export function claimsGet(token, res, status) {
  return ajaxGet("m/org/claims", token, res, status)
}
//详情
export function claims_id(id, token, res, status) {
  return ajaxGet("m/org/claims/" + id, token, res, status)
}
//创建/认领
export function claims(token, res) {
  return ajaxPost("m/org/claims", token, res)
}
//生成海报
export function buildPoster(id, token, res) {
  return ajaxGet("m/org/claims/" + id + "/poster", token, res)
}
//验证是否能创建/认领
export function check(token, res) {
  return ajaxPost("m/org/claims/check", token, res,"",true)
}
//认证
export function confirms(id, token, res) {
  return ajaxPost("m/org/claims/" + id + "/confirms", token, res)
}

//社团
//列表
export function orgs(token, res, status) {
  return ajaxGet("m/orgs", token, res, status)
}
//社团名片
export function orgCardDetail(res, status) {
  return ajaxGet("m/org/business_card", "", res, status)
}
//社团名片生成
export function orgCard(token, res) {
  return ajaxGet("m/org/business_card/poster", token, res)
}
//详情
export function clubDetails(id, token, res, status) {
  return ajaxGet("m/orgs/" + id, token, res, status)
}
//更新
export function changeClubDetails(id, token, res) {
  return ajaxPut("m/orgs/" + id, token, res)
}
//成员列表
export function members(id, token, res, status) {
  return ajaxGet("m/orgs/" + id + "/members", token, res, status)
}
//新增浏览量
export function pv(id, token, res, status) {
  return ajaxPost("m/orgs/" + id + "/pv", token, res, status)
}
//发布的活动列表
export function clubActivities(id, token, res, status) {
  return ajaxGet("m/orgs/" + id + "/activities", token, res, status)
}
//生成海报
export function clubPoster(id, token, res) {
  return ajaxGet("m/orgs/" + id + "/poster", token, res)
}

//社团-移交社长
//生成一条移交记录
export function chaif_replaces(id, token, res) {
  return ajaxPost("m/orgs/" + id + "/chaif-replaces", token, res,true)
}
//记录详情
export function remove_key(key, res,status) {
  return ajaxGet("m/org/chaif-replaces/" + key, res,"",status)
}
//原社长确认
export function originalConfirm(key, token, res) {
  return ajaxPost("m/org/chaif-replaces/" + key + "/original-confirm", token, res)
}
//新社长确认
export function toConfirm(key, token, res) {
  return ajaxPost("m/org/chaif-replaces/" + key + "/new-confirm", token, res)
}



//社团-关注
//关注
export function follows(id, token, res) {
  return ajaxPost("m/orgs/" + id + "/follows", token, res)
}
//取消关注
export function cancel(org_id, follows_id, token, res) {
  return ajaxDelete("m/orgs/" + org_id + "/follows/" + follows_id, token, res)
}
//社团-钱包
//流水记录
export function bills(id, token, res, status) {
  return ajaxGet("m/orgs/" + id + "/bills", token, res, status)
}
//提现
export function withDraw(id, token, res) {
  return ajaxPost("m/orgs/" + id + "/bills", token, res)
}
//详情
export function billsDetails(org_id, bill_id, token, res, status) {
  return ajaxGet("m/orgs/" + org_id + "/bills/" + bill_id, token, res, status)
}

//个人
//完善学校信息
export function school(token, res) {
  return ajaxPut("m/user/school", token, res)
}
//完善个人信息
export function user(token, res, status) {
  return ajaxPut("m/user", token, res, status)
}
//详情
export function userInfo(token, res, status) {
  return ajaxGet("m/user", token, res, status)
}
// 报名的活动
export function myActivities(token, res, status) {
  return ajaxGet("m/user/activities", token, res, status)
}
//关注的社团
export function followClub(token, res, status) {
  return ajaxGet("m/user/follow/orgs", token, res, status)
}

//动态消息
//列表
export function messages(token, res, status) {
  return ajaxGet("messages", token, res, status)
}
//设置已读
export function yiduMsg(token, res, status) {
  return ajaxPut("messages", token, res, status)
}

//系统消息通知
//列表
export function notifications(token, res, status) {
  return ajaxGet("notifications", token, res, status)
}
//设置已读
export function yidu(token, res, status) {
  return ajaxPut("notifications", token, res, status)
}

//奇集日报
//最后一篇日报
export function newsList(res, status) {
  return ajaxGet("m/news/last", res, "", status)
}
//喜欢
export function stars(id, res) {
  return ajaxPost("m/news/" + id + "/stars", res, {}, true)
}
//生成的海报
export function newsPoster(id, res) {
  return ajaxGet("m/news/" + id + "/poster", res)
}
//用户喜欢的日报
export function userLikeNews(id, res, status) {
  return ajaxGet("m/user_wechats/" + id + "/star/news", res, "", status)
}
//分享操作
export function newsShare(id, res) {
  return ajaxPost("m/news/" + id + "/shares", res)
}
//分享详情
export function newsShareDetail(id, res, status) {
  return ajaxGet("m/news/shares/" + id, res, "", status)
}
//日报详情
export function newsDetail(id, res, status) {
  return ajaxGet("m/news/" + id, res, "", status)
}
//列表
export function list(res, status) {
  return ajaxGet("m/news", res, "", status)
}
//订阅
export function subscriptions(res, status) {
  return ajaxPost("m/news/subscriptions", res, "", status)
}
//取消订阅
export function newsCancel(res) {
  return ajaxPost("m/news/subscriptions/cancel", res)
}
//判断用户是否订阅
export function newsCheck(res, status) {
  return ajaxPost("m/news/subscriptions/check", res, "", status)
}
// 奇集日报评论列表
export function newsComList(new_id, res, status) {
  return ajaxGet(`m/news/${new_id}/comments`, res, "", status)
}
//  奇迹日报评论
export function newsComment(new_id, token, res, status) {
  return ajaxPost(`m/news/${new_id}/comments`, token, res, "", status)
}
//  奇迹日报回复
export function newsReply(new_id, comment_id, token, res) {
  return ajaxPost(`m/news/${new_id}/comments/${comment_id}/reply`, token, res)
}
//  奇迹日报单条详情
export function blDetails(new_id, comment_id, token, res) {
  return ajaxGet("m/news/" + new_id + '/comments/' + comment_id, token, res)
}


//奇集大学
//列表
export function uniList(res, status) {
  return ajaxGet("m/universities", res, "", status)
}
//详情
export function uniDetail(id, res, status) {
  return ajaxGet("m/universities/" + id, res, "", status)
}
//领取
export function uniPull(id, res, status) {
  return ajaxPost("m/universities/" + id + "/pull", res, "", status)
}

//活动赞助
//活动赞助列表
export function supList(res, status) {
  return ajaxGet("m/activity_sponsor", res, "", status)
}
//活动赞助详情
export function supDetail(id, res, status) {
  return ajaxGet("m/activity_sponsor/" + id, res, "", status)
}
