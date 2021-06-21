// miniprogram/pages/index/index.js
// const { callbackify } = require("util")
let db = wx.cloud.database()
const _ = db.command;
var app = getApp();
var pdX=true;
var pdID=true;
var number=0 //请求数据时要跳过的数据

Page({
     data: {
          userInfo: {},
          startX: 0, //开始移动时距离左
          endX: 0, //结束移动时距离左
          nowPage: 0, //当前是第几个个页面
          showModal: false, //是否弹出卡片
          iscollect: false, //是否收藏
          openid: "",
          id: '',
          xinId: '',
          poppup: {
               id: "",
               from: "",
               to: "",
               msg: "",
               display: "",
               scale: "",
               slateX: "",
               zIndex: "",
               style: "",
               mgtop: "",
          },
          xinList: []
     },
     //事件处理函数
     onLoad: function (options) {
          console.log("options",options);
          this.setData({
               xinList:options
          })
          this.checkPage(this.data.nowPage)
          if(pdX==true){
               this.huoqu()
          };
          if(pdID==true){
               this.opid()
          }
         

     },
          // 通过云函数获取用户的openid  
     opid:function(){
          // 通过云函数获取用户的openid      
               wx.cloud.callFunction({
                    name: 'userid',
                    complete: res => {
                         this.setData({
                              openid: res.result.openid
                         })
                    }
               })
               pdID=false    
     },
          // 向数据库请求文章信息
     huoqu:function(){
          var that = this
          wx.showLoading({
            title: '请稍等喔',
          })
          db.collection('xinList')
               .orderBy('time','desc')
               .limit(20)//返回限制数量为20
               .get()
               .then(res => {
                    this.setData({
                         xinList: res.data,
                    })
                    that.checkPage(that.data.nowPage);
                    number += res.data.length;
                    wx.hideLoading()
               })
               .catch(res => {
                    wx.showToast({
                         title: '请求失败',
                         icon: "error",
                         duration:1000
                    })
                    wx.hideLoading()
                    console.log(res,"保持");
               })
               pdX=false
          // }
     },
     onShow: function () {

     },
     onReady: function () {},
     // 点击弹出全文
     submitOn: function (e) {
          var poppup = this.data.poppup;
          var number = this.data.nowPage;
          var clist = this.data.xinList;
          this.setData({
               showModal: true,
               poppup: clist[number],
          });
          // this.queryMultipleNodes()
     },
     // 退出全文阅读
     submitOff: function () {
          this.setData({
               showModal: false
          })
     },
     preventTouchMove: function () {

     },
     // 收藏
     changCollect: function (e) {
          var that = this
          let index = e.currentTarget.dataset.index
          var openid = this.data.openid
          let value = e.currentTarget.dataset.item
          let xinid = e.currentTarget.dataset.item._id
          db.collection('favorite').where({
                    userid: openid
               })
               .get({
                    success: res => {
                         //当length不等于零时，说明该用户已存在favorite数据库
                         if (res.data.length != 0) {
                              var xlistid = res.data[0].xinlistid
                              var xlist = res.data[0].xinlist

                              // 判断收藏列表数组是否包含该文章id
                              let temp = new Set(xlistid)
                              let panduan = temp.has(xinid)

                              if (panduan == true) {
                                   // 取消收藏,删除数据
                                   db.collection('favorite')
                                        .where({
                                             userid: openid
                                        })
                                        .update({
                                             data: {
                                                  xinlistid: _.pull(xinid),
                                                  xinlist: _.pull(value)
                                             }
                                        })
                                   wx.showToast({
                                        title: '已取消',
                                        icon: "none"
                                   });
                              } else if (panduan == false) {
                                   db.collection('favorite')
                                        .where({
                                             userid: openid
                                        })
                                        .update({
                                             data: {
                                                  xinlistid: _.push({
                                                       each:[xinid],
                                                       position:0
                                                  }),
                                                  xinlist: _.push({
                                                       each:[value],
                                                       position:0
                                                  })
                                             }
                                        })
                                        .then(res => {
                                             wx.showToast({
                                                  title: '已收藏',
                                             });
                                        })
                                        .catch(err => {
                                             wx.showToast({
                                                  title: "加载错误",
                                                  icon: 'none',
                                                  duration: 1000
                                             })
                                        })
                              }
                         } else {
                              wx.showToast({
                                   title: '请先登录',
                                   icon: "error"
                              })
                         }
                    }
               })
     },
     //手指触发开始移动
     moveStart: function (e) {
          var startX = e.changedTouches[0].pageX;
          this.setData({
               startX: startX
          });
     },
     
     //手指触摸后移动完成触发事件
     // 包含刷新
     moveItem: function (e) {
          var that = this;
          var endX = e.changedTouches[0].pageX;
          this.setData({
               endX: endX
          });
          //计算手指触摸偏移剧距离
          var moveX = this.data.startX - this.data.endX;
          //向左移动
          if (moveX > 20) {
               if (that.data.nowPage >= (that.data.xinList.length - 1)) {
                    // 向数据库请求文章信息
                    wx.showLoading({
                         title: '加载中',
                         mask:true
                       });
                    db.collection('xinList')
                         .skip(number)
                         .limit(20)
                         .get()
                         .then(res => {
                              if(res.data.length!=0){
                                   var result = that.data.xinList.concat(res.data);
                                   that.onLoad(result);
                                   number+=res.data.length;
                                   wx.hideLoading()
                              }else{
                                   wx.showToast({
                                        title: '文章已经到底了喔',
                                        icon:"none",
                                        duration:1000
                                   })
                              }
                         })
                         .catch(err => {
                              wx.showToast({
                                   title: '请求失败',
                                   icon: "error",
                                   duration:800
                              })
                         })
                    return false;
               }
               that.setData({
                    nowPage: that.data.nowPage + 1
               });
               this.checkPage(this.data.nowPage);
          }
          if (moveX < -20) {
               if (that.data.nowPage <= 0) {
                    wx.showToast({
                         title: '这是第一封信了喔',
                         icon: 'none'
                    })
                    return false;
               }
               that.setData({
                    nowPage: that.data.nowPage - 1
               });
               this.checkPage(this.data.nowPage);

               // wx.showToast({
               //  title: '不可以回退噢',
               //  icon:'none'
               // })
          }
     },
     // 页面判断逻辑,传入参数为当前是第几页 
     checkPage: function (index) {
          //信列表数据
          var data = this.data.xinList;
          var that = this;
          var m = 1;
          for (var i = 0; i < data.length; i++) {
               //先将所有的页面隐藏
               var disp = 'xinList[' + i + '].display';
               var sca = 'xinList[' + i + '].scale';
               var slateX = 'xinList[' + i + '].slateX';
               var zIndex = 'xinList[' + i + '].zIndex';
               var style = 'xinList[' + i + '].style';
               var mgtop = 'xinList[' + i + '].mgtop';
               that.setData({
                    [disp]: 0,
                    [style]: "display:block",
               });
               //向左移动上一个页面
               if (i == (index - 1)) {
                    that.setData({
                         [slateX]: '-120%',
                         [disp]: 1,
                         [zIndex]: 2,

                    });
               }
               //向右移动的最右边要display:none的页面
               if (i == (index + 3)) {
                    that.setData({
                         [style]: 'display:none',
                         [slateX]: '0',
                         [zIndex]: -10,
                    });
               }
               if (i == index || (i > index && (i < index + 3))) {
                    that.setData({
                         [disp]: 1
                    });
                    // 显示最近的三封
                    that.setData({
                         [disp]: 1
                    });
                    //第一封信
                    if (m == 1) {
                         this.setData({
                              [sca]: 1,
                              [slateX]: 0,
                              [zIndex]: 1,
                              [mgtop]: '',
                         });
                    }
                    //第二封信
                    else if (m == 2) {
                         this.setData({
                              [sca]: 0.98,
                              [slateX]: '5px',
                              [zIndex]: -1,
                              [mgtop]: '23px'
                         });
                    }
                    //第三封信
                    else if (m == 3) {
                         this.setData({
                              [sca]: 0.96,
                              [slateX]: '10px',
                              [zIndex]: -2,
                              [mgtop]: '31px'
                         });
                    }
                    m++;
               }

          }
     },
     // 已废弃
     // 声明节点查询的方法 获取被撑开盒子的高度
     // queryMultipleNodes:function(){
     //      var bbb=this.data.bbb
     //      const query=wx.createSelectorQuery().select('#productServe').boundingClientRect();
     //      query.exec(res=>{
     //           console.log(res);
     //           console.log(res[0].height);
     //           var heg=(res[0].height+60)*2
     //           this.setData({
     //                bbb:heg
     //           })
     //      })
     // }
})