//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
     seeallart:0,//查看全文
     qrtoast:0,//弹二维码
     tsheetshow:0,//弹板块
     types:[],//板块
     annoucements:[],//公告
     currentType:0,
     pageIndex:1,
     fname:"",
     flogo:"",
     fqrcode: "",
     ftopiccount: "",
     fviewcount: "",
     listart:{}//帖子列表
  }, 
 onLoad: function () {
   var target=this;
   wx.showLoading({
     title: '正在进入...',
   })
   var int = setInterval(function(){
    //保证正常获取用户信息完毕才进入页面
     if ('' != app.globalData.secret) {
       wx.hideLoading()
       target.loadMainData();
       target.loadArticle();
       clearInterval(int);
     }
     else {
     }
   }, 800)
  },
 
 loadMainData: function () {
   var target=this;
   var url = app.globalData.apiurl +"/m/s/" + app.globalData.fid ;
   // 显示加载中
 
   wx.request({
     url: url,
     method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: { 'content-type': 'json' }, // 设置请求的 header
     success: function (res) {
      
       var sdata=res.data;
       sdata.TList.unshift({ "TId": 0, "TName": "全部" });
       //取板块
       target.setData({
         "types": sdata.TList
       });//取公告
       target.setData({
         "annoucements": sdata.AList
       });
       target.setData({
         "fname": sdata.FName
       });
       target.setData({
         "flogo": sdata.FLogo
       });
       target.setData({
         "fqrcode": sdata.FQrCode
       });
       target.setData({
         "ftopiccount": sdata.FTopicCount
       });
       target.setData({
         "fviewcount": sdata.FViewCount
       });

     },
     fail: function () {
       // fail

     },
     complete: function () {
    
     }
   });

 },
 loadArticle: function () {
   var target = this;
   var params = ["?tid=" + target.data.currentType];
   params.push("&pidx=" + target.data.pageIndex);
   params.push("&lg=" + app.globalData.secret);
   var url = app.globalData.apiurl + "/m/listart/" + app.globalData.fid + params.join('');
   // 显示加载中
   wx.showToast({
     title: '加载中',
     icon: 'loading',
     duration: 70000
   });
   wx.request({
     url: url,
     method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: { 'content-type': 'json' }, // 设置请求的 header
     success: function (res) {
       //html转换
       var listart=res.data;
       for (var i = 0; i < listart.length; i++)
       {
         var art=listart[i];
     
         if ('' != art.ContentDesc) {

           WxParse.wxParse('artcont', 'html', art.ContentDesc, target, 0);
         }
         if ('' != art.ContentDescAll) {
           WxParse.wxParse('artcontall', 'html', art.ContentDescAll, target, 0);
         }
       }
       for (var i = 0; i < listart.length; i++) {
       
         console.log(art.ContentDesc);
       }
       target.setData({
         "listart": listart
       });
      
     },
     fail: function () {
       // fail

     },
     complete: function () {
       wx.hideToast();
     }
   });

 },
 qr_click:function()
 {
   this.setData({
     "qrtoast": 1
   });
 },
 close_qrtoast:function()
 {
   this.setData({
     "qrtoast": 0
   });
 },
open_typesheet: function () {
   console.log("sdfsdf");
   this.setData({
     "tsheetshow": 1
   });
 },
 close_typesheet:function()
 {
   this.setData({
     "tsheetshow": 0
   });
 },
  /*板块跳转 */
  typeclick: function (event) {
   var pretype = this.data.currentType;
   var newtype = event.currentTarget.dataset.id;
   if (pretype==newtype)
   {}
   else
   {
     this.setData({ "currentType": id });
     this.setData({ "pageIndex": 1 });
     this.loadArticle();
   }
 },
 
})
