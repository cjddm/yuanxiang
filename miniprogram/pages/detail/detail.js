let db=wx.cloud.database();
const _ =db.command;

let iscollect=false //是否收藏
let Id=''
Page({
	data:{
		detail:'',
		shocang:true,
		openid:''
	},
	// 通过id获取数据库里的指定数据
	onLoad(options){
		var msg=JSON.parse(decodeURIComponent(options.message))
		var opid=JSON.parse(decodeURIComponent(options.openid))
		this.setData({
			detail:msg,
			openid:opid
		})
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
})