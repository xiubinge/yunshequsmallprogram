Page({
  data: {
   qqface:[],
  },
onLoad: function (options) {
    var array = [];
    for(var i=0;i<5;i++)
    {
      var item = [];
      for(var j=0;j<21;j++)
      {
        item.push(j)
      }
      array.push(item);
    }
    this.setData({
      qqface:array
    })
  },

})