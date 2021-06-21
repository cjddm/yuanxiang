wx.cloud.init()
let db=wx.cloud.database();
const _ =db.command;

let iscollect=false //是否收藏
let Id=''
Page({
	data:{
		detail:'',
		shocang:true,
		username:'',
		openid:'',
		pl:'',//评论内容
		pllist:[],//获取的评论列表
		empty:true,//文章是否有评论
		focus:false,//输入框是否获取焦点,评论图标是否显示
	},
	// 通过id获取数据库里的指定数据
	onLoad(options){
		var msg=JSON.parse(decodeURIComponent(options.message))
		var opid=JSON.parse(decodeURIComponent(options.openid))
		var name=JSON.parse(decodeURIComponent(options.username))
		this.setData({
			detail:msg,
			openid:opid,
			username:name
		})
		this.fresh()
	},
	 // 收藏
	 changCollect:function(e){     
		 var xinid=this.data.detail._id
		 var that = this
		 var openid = this.data.openid
		 let value = e.currentTarget.dataset.item
		 db.collection('favorite').where({
							 userid: openid
					})
					.get({
							 success: res => {
												 var xlistid = res.data[0].xinlistid
												 // 判断收藏列表数组是否包含该文章id
												 let temp = new Set(xlistid)
												 console.log("temp", temp);
												 let panduan = temp.has(xinid)

												 if (panduan == true) {
															// 取消收藏,删除数据
															console.log("删除");
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
																	 .then(res=>{
																			wx.showToast({
																				title: '已取消',
																				icon: "none"
																			 });
																			 that.setData({
																				 shocang:false
																			 })
																	 })
																	 .catch(err=>{
																		 wx.showToast({
																			 title: '数据错误',
																			 icon:"error",
																			 duration:1000
																		 })
																	 })
														
												 } else if (panduan == false) {
															console.log("添加");
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
																						 duration:1000
																				});
																				that.setData({
																					shocang:true
																				})
																	 })
																	 .catch(err => {
																				wx.showToast({
																						 title: "数据错误",
																						 icon: 'none',
																						 duration: 1000
																				})
																	 })
												 }
							 },
							 fail:err=>{
								 console.log("错误",err);
							 }
					})
	},

	// 评论
	pl:function(e){
		this.setData({
			pl:e.detail.value
		})
	},
	fx:function(){
		var time=this.benditime()
		this.setData({
			focus:false
		})
		if(this.isNull(this.data.pl)==false){
			var value={
				comment:this.data.pl,
				name:this.data.username,
				openid:this.data.openid,
				time:time,
				reply:[]
			}
			wx.cloud.callFunction({
				name:'comment',
				data:{
					id:this.data.detail._id,
					value:value
				}
			})
			.then(res=>{
				this.setData({
					pl:''
				})
					wx.showToast({
						title: '发表成功',
						icon:"success",
						duration:1000
					})
					// 评论成功后刷新
					this.fresh()
			})
			.catch(err=>{
				wx.showToast({
					title:'发表失败',
					icon:'error',
					duration:1000
				})
			})
		}else{
			wx.showToast({
				title:'亲，不能为空哦！',
				icon:'none',
				duration:1000
			})
		}
	},

	// 判断是否全部为空格
  isNull:function ( str ){
    if ( str == "" ) return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
		},
		
		// 刷新评论列表
		fresh:function(){
			var xinid=this.data.detail._id
			db.collection('xinList').doc(xinid).get()
			.then(res=>{
				if(res.data.comment.length!=0){//判断评论是否为空
					// 不为空
					this.setData({
						pllist:res.data.comment,
						empty:false
					})
				}else{
					// 为空
				}
			})
			.catch(err=>{
				wx.showToast({
					title: '加载失败',
					icon:'none',
					duration:1000
				})
			})
		},

		// 获取本地时间
		benditime:function(){
			var date=new Date
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var dates = date.getDate();
			var day = date.getDay();
			var h = date.getHours();//时
			var m = date.getUTCMinutes();//分
			var s = date.getSeconds();//
			return year + "-" + month + "-" + dates + "-" + h + ':' + m
		},

		// 显示评论功能
		show:function(){
			this.setData({
				focus:true
			})
		}
})