// pages/detail/detail.js
let iscollect=false //是否收藏
let Id=''

Page({
	data:{
		detail:'',
		shocangurl:'../../images/tabbar/collect.png',
		shocang:false
	},
	// 通过id获取数据库里的指定数据
	onLoad(options){
		Id=options.id
		console.log(Id);
		wx.cloud.database().collection("xinList")
		.doc(Id)
		.get()
		.then(res=>{
			console.log("详情页成功",res);
			iscollect=res.data.collect
			this.setData({
				detail:res.data,
				shocangurl:iscollect?'../../images/tabbar/collect-sh.png':'../../images/tabbar/collect.png',
				shocang:iscollect?true:false
			})
		})
		.catch(res=>{
			console.log("详情页失败",res);
		})
	},
	 // 收藏
	 changCollect:function(e){     
		console.log(Id);
		if(iscollect==false){
			this.setData({
				shocangurl:'../../images/tabbar/collect-sh.png',
				shocang:true
			})
				 wx.showToast({
					 title: '已收藏',
				 });	
				 iscollect=true
				 wx.cloud.callFunction({
					 name:"collect",
					 data:{
						 id:Id,
						 collect:iscollect
					 }
				 })
				 .then(res=>{
					 console.log("改变收藏状态成功",res);
				 })
				 .catch(res=>{
					 console.log("改变收藏状态失败",res);
				 })
		}else{
			this.setData({
				shocangurl:'../../images/tabbar/collect.png',
				shocang:false
			})
				 wx.showToast({
					 title: '已取消',
				 })				
				 iscollect=false
				 wx.cloud.callFunction({
					name:"collect",
					data:{
						id:Id,
						collect:iscollect
					}
				})
				.then(res=>{
					console.log("改变收藏状态成功",res);
				})
				.catch(res=>{
					console.log("改变收藏状态失败",res);
				})
		}
},
})