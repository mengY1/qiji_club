//loading由api处传入，默认为false
import common from "@/utils/common"
import {
  access_token
} from "@/utils/api";
export function ajaxGet(url, data, token, loading) {
  token = ' ' + wx.getStorageSync('silentlogin').token
  var is_loading = loading ? loading : false
  if (!is_loading) {
    wx.showLoading({
      title: '加载中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {

      }
    });
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: common.testInterface + `${url}`, //仅为示例，并非真实的接口地址
      // url:`https://demo.holdshell.com/xunjian/${url}`,
      method: "GET",
      data: data,
      header: {
        "Authorization": "Bearer" + token,
        "X-Requested-With": "XMLHttpRequest", // 默认值
        "Min-Program-Client-Token": "qj_org"
      },
      success: function (res) {
        if (res.header.token) {
          var silentMsg = wx.getStorageSync("silentlogin");
          silentMsg.token = res.header.token
          wx.setStorageSync('silentlogin', silentMsg)
        }
        wx.hideLoading()
        // setTimeout(() => {
        //   wx.hideLoading();
        // }, 200);
        if (res.statusCode == 200) {
          resolve(res.data)
        } else if (res.statusCode == 201) {
          // wx.showToast({
          //   title: 1
          // })
          resolve(res.data)
        } else if (res.statusCode == 429) {
          wx.showToast({
            title: "请求过频繁"
          })
          reject(res.data)
        } else if (res.statusCode == 404) {
          wx.showToast({
            title: "资源不存在"
          })
          reject(res.data)
        } else if (res.statusCode == 403) {
          // wx.showToast({
          //   title: "请完善信息"
          // })
          reject(res.data)
          // setTimeout(() => {
          //   wx.navigateTo({
          //     url: "/pages/login/register/index"
          //   })
          // }, 1000);
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: "服务器错误"
          })
          reject(res.data)
        } else if (res.statusCode == 400) {
          // wx.showToast({
          //   title: "请求格式错误"
          // })
          reject(res.data)
        } else if (res.statusCode == 401) {
          reject(res.data)
          if (wx.getStorageSync('silentlogin').token) {
            var refresh_token = wx.getStorageSync("silentlogin").refresh_token;
            access_token({
              refresh_token: refresh_token
            }).then(res => {
              var silentMsg = wx.getStorageSync("silentlogin");
              silentMsg.token = res.access_token;
              silentMsg.refresh_token = res.refresh_token;
              wx.setStorageSync("silentlogin", silentMsg);
            }).catch(err => {
              wx.navigateTo({
                url: "/pages/login/shouquan/shouquan"
              })
            })
          }
          // if (wx.getStorageSync("silentlogin").token) {
          //   wx.navigateTo({
          //     url: "/pages/login/shouquan/shouquan"
          //   })
          // }
        } else {
          wx.showToast({
            title: res.errormsg
          })
          reject(res.data)
        }
        console.log(res.statusCode)
      },
      fail(err) {
        console.log(err)
        if (err.errMsg) {
          wx.showModal({
            title: "提示",
            content: "服务器繁忙",
            showCancel: false
          })
        }
        reject(err)
        wx.hideLoading();
        return false;
      }
    })
  })
}

export function ajaxPost(url, data, token, loading, success) {
  token = ' ' + wx.getStorageSync('silentlogin').token
  var is_loading = loading ? loading : false
  token = ' ' + wx.getStorageSync('silentlogin').token
  if (!is_loading) {
    wx.showLoading({
      title: '提交中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {

      }
    });
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: common.testInterface + `${url}`, //仅为示例，并非真实的接口地址
      method: "POST",
      data: data,
      header: {
        // 'content-type': 'application/json' // 默认值
        "Authorization": "Bearer" + token,
        "X-Requested-With": "XMLHttpRequest",
        "Min-Program-Client-Token": "qj_org"
      },
      success: function (res) {
        if (!is_loading) {
          wx.hideLoading();
        }
        if (res.statusCode == 200) {
          // console.log(JSON.stringify(res.data.data))
          resolve(res.data)
        } else {
          if (res.statusCode == 201) {
            resolve(res.data)
            if (res.data.message) {
              // wx.showToast({
              //     title: res.data.message
              // })
              wx.showToast({
                title: res.data.message,
                icon: "none"
              })

            }
          } else if (res.statusCode == 404) {
            wx.showToast({
              title: "资源不存在"
            })
            reject(res.data)
          } else if (res.statusCode == 422) {
            // wx.showToast({
            //   title:'请完善信息'
            // })
            reject(res.data)
            var msgArr = []
            for (var i in res.data.errors) {
              console.log(i)
              msgArr.push(i)
            }
            wx.showModal({
              title: "提示",
              content: res.data.errors[msgArr[0]][0]
            })
            //如果没有获取到授权信息的缓存则跳到授权页面
            if (res.data.errors.open_id || res.data.errors.unionid) {
              wx.navigateTo({
                url: "/pages/login/shouquan/shouquan"
              })
            }
            console.log(res.data)
          } else if (res.statusCode == 403) {
            wx.showToast({
              title: "请完善信息"
            })
            reject(res.data)
            setTimeout(() => {
              wx.navigateTo({
                url: "/pages/login/register/index"
              })
            }, 1000);
          } else if (res.statusCode == 429) {
            wx.showToast({
              title: "请求过频繁"
            })
            reject(res.data)
          } else if (res.statusCode == 401) {
            reject(res.data)
            //没有token
            if (!wx.getStorageSync('silentlogin').token && wx.getStorageSync('silentlogin')) {
              wx.showToast({
                title: "请先注册"
              })
              setTimeout(() => {
                wx.navigateTo({
                  url: "/pages/login/register/index"
                })
              }, 1000);
            } else if (res.statusCode == 400) {

              wx.showToast({
                title: "请求格式错误"
              })
            } else {
              // token过期或者
              wx.navigateTo({
                url: "/pages/login/shouquan/shouquan"
              })
            }
          } else if (res.statusCode == 400) {
            // 成功提示框弹出
            var isSuccess = success ? success : false
            if (isSuccess) {
              wx.showModal({
                title: "提示",
                content: res.data.message,
              });
            }
            console.log(123456987)
            reject(res.data)
          } else if (res.statusCode == 500) {
            wx.showToast({
              title: "服务器错误"
            })
            reject(res.data)
          } else {
            wx.showToast({
              title: res.errormsg
            })
            reject(res.data)
          }
        }
      },
      fail(err) {
        wx.showToast({
          title: err
        });
        return false;
      }
    })
  })
}

export function ajaxPut(url, data, token, loading) {
  token = ' ' + wx.getStorageSync('silentlogin').token
  var is_loading = loading ? loading : false
  if (!is_loading) {
    wx.showLoading({
      title: '加载中', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {

      }
    });
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: common.testInterface + `${url}`, //仅为示例，并非真实的接口地址
      // url:`https://demo.holdshell.com/xunjian/${url}`,
      method: "PUT",
      data: data,
      header: {
        "Authorization": "Bearer" + token,
        "X-Requested-With": "XMLHttpRequest", // 默认值
        "Min-Program-Client-Token": "qj_org"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          // console.log(JSON.stringify(res.data.data))
          resolve(res.data)
        } else if (res.statusCode == 201) {
          resolve(res.data)
          console.log(231, res)
          if (res.data.message) {
            wx.showModal({
              title: "提示",
              content: res.data.message
            })
          }
        } else if (res.statusCode == 422) {
          // wx.showToast({
          //   title:'请完善信息'
          // })
          reject(res.data)
          var msgArr = []
          for (var i in res.data.errors) {
            console.log(i)
            msgArr.push(i)
          }
          wx.showModal({
            title: "提示",
            content: res.data.errors[msgArr[0]][0]
          })
        } else if (res.statusCode == 401) {
          reject(res.data)
          //没有token
          if (!wx.getStorageSync('silentlogin').token) {
            wx.showToast({
              title: "请先注册"
            })
            setTimeout(() => {
              wx.navigateTo({
                url: "/pages/login/register/index"
              })
            }, 1000);
          } else if (res.statusCode == 404) {
            reject(res.data)
            wx.showToast({
              title: "资源不存在"
            })
          } else if (res.statusCode == 403) {
            reject(res.data)
            wx.showToast({
              title: "请完善信息"
            })
            setTimeout(() => {
              wx.navigateTo({
                url: "/pages/login/register/index"
              })
            }, 1000);
          } else {
            // token过期或者
            wx.navigateTo({
              url: "/pages/login/shouquan/shouquan"
            })
          }
        } else if (res.statusCode == 429) {
          reject(res.data)
          wx.showToast({
            title: "请求过频繁"
          })
        } else if (res.statusCode == 500) {
          reject(res.data)
          wx.showToast({
            title: "服务器错误"
          })
        } else if (res.statusCode == 400) {
          reject(res.data)
          wx.showToast({
            title: "请求格式错误"
          })
        } else {
          reject(res.data)
          wx.showToast({
            title: res.errormsg
          })
        }
        console.log(res.statusCode)
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '失败'
        });
        return false;
      }
    })
  })
}

export function ajaxDelete(url, data, token) {
  token = ' ' + wx.getStorageSync('silentlogin').token
  wx.showLoading({
    title: '加载中', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: common.testInterface + `${url}`, //仅为示例，并非真实的接口地址
      // url:`https://demo.holdshell.com/xunjian/${url}`,
      method: "DELETE",
      data: data,
      header: {
        "Authorization": "Bearer" + token,
        "X-Requested-With": "XMLHttpRequest", // 默认值
        "Min-Program-Client-Token": "qj_org"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          // console.log(JSON.stringify(res.data.data))
          resolve(res.data)
        } else if (res.statusCode == 204) {
          resolve(res)
        } else if (res.statusCode == 201) {
          wx.showToast({
            title: res.data.message
          })
        } else if (res.statusCode == 429) {
          wx.showToast({
            title: "请求过频繁"
          })
        } else if (res.statusCode == 500) {
          wx.showToast({
            title: "服务器错误"
          })
        } else {
          wx.showToast({
            title: res.errormsg
          })
        }
        console.log(res.statusCode)
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: '失败'
        });
        return false;
      }
    })
  })
}
