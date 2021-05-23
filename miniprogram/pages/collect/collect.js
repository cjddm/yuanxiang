// miniprogram/pages/collect/collect.js
Page({

	data:{
		dataList:[]
	},

	onLoad(){
		wx.cloud.database().collection("xinList")
		.get()
		.then(res=>{
			console.log("成功",res);
			this.setData({
				dataList:res.data
			})
		})
		.catch(res=>{
			console.log("失败",res);
		})
	},
	// 跳转到详情页面
	// 把id传到详情页
	goDetail(e){
		console.log(e.currentTarget.dataset.item._id);
		wx.navigateTo({
			url: '/pages/detail/detail?id=' + e.currentTarget.dataset.item._id,
		})
	}
})