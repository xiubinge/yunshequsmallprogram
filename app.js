//app.js
App({
  onLaunch: function () {
   
    try {//sessionid
  
     var value = wx.getStorageSync('sid')
     if (value) {
        this.globalData.secret=value;
      }//未登录
      else
      {
        this.getUserInfo();
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  getUserInfo:function(){
      var target=this;
       //调用登录接口
      wx.login({
        success: function (lres) {
          if (lres.code) {
                //发起网络请求
                wx.request({
                  url: target.globalData.apiurl + '/u/login/' + target.globalData.fid + "?code=" + lres.code,
                  method: 'post',
                  success: function (ores) {
                    //存储秘钥 
                      wx.getUserInfo({
                        success: function (res) {
                          var userInfo = res.userInfo
                         /*  var params = ["?encrypt=" + userInfo.nickName];
                          params.push("&headimg=" + userInfo.avatarUrl);
                          params.push("&sex=" + userInfo.gender);
                          params.push("&province =" + userInfo.province );
                          params.push("&city=" + userInfo.city);
                          params.push("&country=" + userInfo.country);*/
                          var params = ["?encrypt=" +res.encryptedData]
                          params.push("&iv=" + res.iv);
                          params.push("&sid=" + ores.data);
                          wx.request({
                            url: encodeURI(target.globalData.apiurl + "/u/getuser/" + target.globalData.fid + params.join('')),
                            method: 'get',
                            success: function (res) {
                              wx.setStorageSync('sid', res.data)
                              target.globalData.secret = res.data;
                            },
                            fail: function () {

                            }
                        })
                     
                    },
                  fail: function () {

                  }
                })
              } 
          });
        }
    }
  });
  },
  retryAuth:function()
  {
     wx.showModal({
          title: '提示',
          content: '抱歉，获取用户信息失败，不能参与社区互动！',
          confirmText:'重新试试',
          cancelText:' 放弃',
          success: function(res) {
            if (res.confirm) {
              
            } else if (res.cancel) {
            }          
          }
     })
  },
  globalData:{
    secret:'',
    fid:3,
    /*userInfo: { id:0,nick: "匿名用户", headimg:"http://i.pengxun.cn/static/user/default_user_head3.png"},*/
    apiurl:'https://smallapi.vzan.com/api'
  }
})