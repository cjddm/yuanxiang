// const { get } = require("http")

var app=getApp().globalData
let db=wx.cloud.database()
Page({
    data: {
      pd:true,
      openid:'',
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      canIUseGetUserProfile: false,
      canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
    },
    onLoad() {
      if (wx.getUserProfile) {
        this.setData({
          canIUseGetUserProfile: true
        })
      }
      wx.cloud.callFunction({
        name:'userid',
        complete:res=>{
          this.setData({
            openid:res.result.openid
          })
        }
      });
      wx.cloud.callFunction({
        name:'userid',
        complete:res=>{
          this.setData({
            openid:res.result.openid
          })
          let opid=res.result.openid
          db.collection('favorite').where({
            _openid:opid
          })
          .get({
            success:res=>{
              // 用户不存在
              if(res.data.length==0){
                this.setData({
                  pd:true
                })
              }else{
                this.setData({
                  pd:false
                })
              }
            }
          })
        }
      })
    },
    dj(){
      this.getUserProfile()
    },
    getUserProfile(e) {
      console.log(e,"getuserprofile");
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '获取头象和昵称', 
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            pd:false
          })
          var nickname=res.userInfo.nickName
          wx.cloud.callFunction({
            name:'userid',
            complete:res=>{
                 this.setData({
                      openid:res.result.openid
                 })
                 let opid=res.result.openid
                 console.log();
                 // 检测用户是否在数据库存在集合，若没有则为用户创建
                 db.collection('favorite').where({
                      userid:opid
                 })
                 .get({
                      success:res=>{
                           console.log(res,"详细信息");
                           // 当length等于零时，说明favorite数据库中没有该用户
                           if(res.data.length==0){
                                db.collection('favorite').add({
                                     data:{
                                          userid:opid,
                                          xinlistid:[],
                                          xinlist:[],
                                          myxin:[],
                                          username:nickname
                                     },
                                     success:function(res){
                                          console.log("用户注册成功");
                                          this.setData({
                                            pd:false
                                          })
                                     }
                                })
                           }else{
                                console.log("用户已存在");
                           }
                      }
                 })
            }
       })
        },
        fail:(err)=>{
          console.log(err,"拒绝");
          this.setData({
            pd:true
          })
        }
      })
    },

    write(){
      wx.navigateTo({
        url: '/pages/write/write?id='+this.data.openid,
      })
    },

    wd(){
      wx.navigateTo({
        url: '/pages/wd/wd?id='+this.data.openid,
      })
    }
  })
  
 

