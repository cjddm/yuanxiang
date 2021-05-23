// miniprogram/pages/index/index.js

const { callbackify } = require("util");

//index.js
var app = getApp();
//获取应用实例
 
Page({
  data: {
   	userInfo: {},
   	startX:0, //开始移动时距离左
   	endX:0, //结束移动时距离左
     nowPage:0, //当前是第几个个页面
     showModal:false,//是否弹出卡片
     bbb:0,//阅读全文时，文字的高度
     iscollect:false,//是否收藏

     xinStore:[],
     id:'',
     xinId:'',
     poppup:{
          id:"",
          from:"",
          to:"",
          msg:"",
          display:"",
          scale:"",
          slateX:"",
          zIndex:"",
          style:"",
          mgtop:"",
     },
   	xinList:[
    	 {
    	   id:1,
    	   from:'一路向南1',
    	   to:'记得要微笑',
    	   msg:'这么多年咨询信看下来s，让我逐渐明白一件事。 很多时候，咨询的人心里已经有了答案，来咨询只确的决对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。这么多年咨询信看下来s，让我逐渐明白一件事。 很多时候，咨询的人心里已经有了答案，来咨询只确的决对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。这么多年咨询信看下来s，让我逐渐明白一件事。 很多时候，萨汗国的撒感到意外湖北大厦酒店会不会是咨询的人心里已经有了答案，来咨询只确的决对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。让我逐渐明白一件事。 很多时候，萨汗国的撒感到意外湖北大厦酒店会不会是咨询的人心里已经有了答案，来咨询只确的决对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。萨汗国的撒感到意外湖北大厦酒店会不会是咨询的人心里已经有了答案，来咨询只确的决对的。 所以有些人读过回信后，会再次写信过来， ',
    	   display:0,
    	   scale:'',
    	   slateX:'',
    	   zIndex:0,
            style:'',
            mgtop:'',
    	 },
    	 {
    	    id: 2,
    	    from: '一路向南2',
    	    to: '记得要微笑',
    	    msg: '该属性定义行内元素的基线相对于该元素所在行的基线的垂直对齐。允许指定负长度值和百分比值。这会使元素降低而不是升高。在表单元格中，这个属性会设置单元格框中的单元格内容的对齐方式。',
    	    display:0,
    	    scale: '',
    	    slateX: '',
    	    zIndex: 0,
             style: '',
            mgtop:''
             
    	 },
    	 {
    	    id: 3,
    	    from: '一路向南3',
    	    to: '记得要微笑',
    	    msg: '这么多年咨询信看下来，让我逐渐明白一件事。 很多时候，咨询的人心里已经有了答案，来咨询只确	的决定对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。',
    	    display:0,
    	    scale: '',
    	    slateX: '',
    	    zIndex: 0,
             style: '',
            mgtop:''
             
    	 },
    	 {
    	    id: 4,
    	    from: '一路向南4',
    	    to: '记得要微笑',
    	    msg: '这么多年咨询信看下来，让我逐渐明白一件事。 很多时候，咨询的人心里已经有了答案，来咨询只确	的决定对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。',
    	    display:0,
    	    scale: '',
    	    slateX: '',
    	    zIndex: 0,
             style: '',
            mgtop:''
             
    	 },
    	 {
    	    id: 5,
    	    from: '一路向南5',
    	    to: '记得要微笑',
    	    msg: '这么多年咨询信看下来，让我逐渐明白一件事。 很多时候，咨询的人心里已经有了答案，来咨询只确	的决定对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。',
    	    display: 0,
    	    scale: '',
    	    slateX: '',
    	    zIndex: 0,
             style: '',
            mgtop:''
             
    	 },
    	 {
    	      id: 6,
    	      from: '一路向南6',
    	      to: '记得要微笑',
    	      msg: '这么多年咨询信看下来，让我逐渐明白一件事。 很多时候，咨询的人心里已经有了答案，来咨询只确	的决定是对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。',
    	      display: 0,
    	      scale: '',
    	      slateX: '',
    	      zIndex: 0,
               style: '',
            mgtop:''
               
    	 },
    	 {
    	      id: 7,
    	      from: '一路向南7',
    	      to: '记得要微笑',
    	      msg: '这么多年咨询信看下来，让我逐渐明白一件事。 很多时候，咨询的人心里已经有了答案，来咨询只确	的决定是对的。 所以有些人读过回信后，会再次写信过来， 大概就是因为回答的内容和他的想一样。',
    	      display: 0,
    	      scale: '',
    	      slateX: '',
    	      zIndex: 0,
               style: '',
            mgtop:''
               
    	 },
      ]
     },
     //事件处理函数
 
     onLoad: function (e) {
     
          this.checkPage(this.data.nowPage);
     },
     onReady: function () {
        
     },
     onShareAppMessage: function () {
          return {
               title: '解忧小酒馆，专治不开心~'
          }
     },
     // 点击弹出全文
     submitOn:function(e){
          var poppup=this.data.poppup;
          var number=this.data.nowPage;
          var clist=this.data.xinList;
          this.setData({
              showModal:true,
              poppup:clist[number],
          });
          this.queryMultipleNodes()
     },
     // 退出全文阅读
     submitOff:function(){
          this.setData({
               showModal:false
          })
     },
     preventTouchMove: function() {
  
     },
     // 收藏
     changCollect:function(e){     
          console.log(e);
          if(!this.data.iscollect==true){
               let xinData=this.data.xinStore
               xinData.push({
                    xinId:xinData.length,
                    id:this.data.xinList.id
               })
               wx.setStorageSync('xinData', xinData);
               wx.showToast({
                 title: '已收藏',
               });
          }else{
               wx.showToast({
                 title: '已取消',
               })
          }
          // const openId=wx.getStorageSync('token')||'';
          // const that=this
          // if(openId){
          //      const xinId=e.currentTarget.dataset.id
          //      const xinList=that.data.xinList
          //      for(let i in xinList){
          //           if(xinId == xinList[i].id){
          //              console.log(xinId);
          //              callbackify.requeatGet('gostore',{
          //                xinId:xinId,

          //              }) 
          //           }
          //      }
          // }
           this.setData({
                iscollect:!this.data.iscollect
           })
     },
     //手指触发开始移动
     moveStart:function(e) {
          var startX = e.changedTouches[0].pageX;
          this.setData({
               startX:startX
          });
     },
     //手指触摸后移动完成触发事件
     moveItem: function (e) {
          var that = this;
          var endX = e.changedTouches[0].pageX;
          this.setData({
               endX: endX
          });
     
          //计算手指触摸偏移剧距离
          var moveX = this.data.startX - this.data.endX;
          
          //向左移动
          if(moveX > 20 ){
               if(that.data.nowPage >= (that.data.xinList.length - 1)) {
                    wx.showToast({
                         title: '最后一封信了喔,明天再来吧',
                         icon: 'none'
                    })
                    return false;
               }
               that.setData({
                    nowPage:that.data.nowPage+1
               });
               this.checkPage(this.data.nowPage);
          }
          if(moveX < -20) {
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
     checkPage:function(index) {
          //信列表数据
          var data = this.data.xinList;
          var that = this;
          var m = 1;
          for(var i = 0;i < data.length;i ++) {
               //先将所有的页面隐藏
               var disp = 'xinList[' + i + '].display';
               var sca = 'xinList[' + i + '].scale';
               var slateX = 'xinList[' + i + '].slateX';
               var zIndex = 'xinList[' + i + '].zIndex';
               var style = 'xinList[' + i + '].style';
               var mgtop='xinList[' + i + '].mgtop';
               that.setData({
                    [disp]:0,
                    [style]: "display:block",
               });
               //向左移动上一个页面
               if(i == (index - 1) ){
                    that.setData({
                         [slateX]: '-120%',
                         [disp]: 1,
                         [zIndex]: 2,
                         
                    });
               }
               //向右移动的最右边要display:none的页面
               if (i == (index + 3)) {
                    that.setData({
                         [style]:'display:none',
                         [slateX]:'0',
                         [zIndex]: -10,
                    });
               }
               if(i == index || (i > index && (i < index + 3))) {
                    //显示最近的三封
                    that.setData({
                         [disp]:1
                    });
                    //第一封信
                    if(m == 1){
                         this.setData({
                              [sca]: 1,
                              [slateX]: 0,
                              [zIndex]: 1,
                              [mgtop]:'',
                         });
                    }
                    //第二封信
                    else if (m == 2) {
                         this.setData({
                              [sca]: 0.98,
                              [slateX]:'5px',
                              [zIndex]: -1,
                              [mgtop]:'23px'
                         });
                    }
                    //第三封信
                    else if (m == 3) {
                         this.setData({
                              [sca]: 0.96,
                              [slateX]: '10px',
                              [zIndex]: -2,
                              [mgtop]:'31px'
                         });
                    }
                    m ++;
               }
          
          }
     },
     // 声明节点查询的方法 获取被撑开盒子的高度
     queryMultipleNodes:function(){
          var bbb=this.data.bbb
          const query=wx.createSelectorQuery().select('#productServe').boundingClientRect();
          query.exec(res=>{
               // console.log(res[0].height);
               var heg=res[0].height
               this.setData({
                    bbb:heg
               })
          })
     }
})