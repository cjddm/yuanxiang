var app=getApp().userData
Page({
 
     data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
         userid:'',
         nickname:'',
         avatarurl:''
     },
     bindGetUserInfo:function(){
        var that=this
        wx.getUserInfo({
          success:function(res){
              that.setData({
                nickname:res.userInfo.nickName,
                avatarurl:res.userInfo.avatarUrl
              })
          }
        })
     },
     onLoad(){
        // 查看是否授权
        wx.getSetting({
            success (res){
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function(res) {
                    console.log(res.userInfo)
                  }
                })
              }
            }
         })
        }, 
    bindGetUserInfo (e) {
        console.log(e.detail.userInfo)
      },
    //  获取用户的openid
     huoqu:function(){
        wx.cloud.callFunction({
            name:'userid',
            data:{
                message:'userid'
            }
        })
        .then(res=>{
            console.log("获取openid成功",res);
            app.openID=res.result.openid
            this.setData({
                userid:res.result.openid
            })
        })
        .catch(res=>{
            console.log("获取openid失败",res);
        })
     }
 })