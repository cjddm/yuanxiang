let db=wx.cloud.database();
const _ =db.command;

Page({
	data: {
		openid:'',
		myxin:[],
	},

	onLoad: function (options) {
		if(options){
				this.data.openid=options.id;
			db.collection('favorite').where({
				_openid:options.id
			})
			.get()
			.then(res=>{
				console.log(res);
				this.setData({
					myxin:res.data[0].myxin
				})
			})
		}else{
			db.collection('favorite').where({
				_openid:this.data.openid
			})
			.get()
			.then(res=>{
				console.log(res);
				this.setData({
					myxin:res.data[0].myxin
				})
			})
		}
	},

	// 删除模块
	delete:function(e){
		console.log(e);
		var bgx=e.currentTarget.dataset.item.gx
		var bsjid=e.currentTarget.dataset.item.sjid
		if(bgx=='私密'){
			db.collection('favorite').where({
				_openid:this.data.openid
			})
			.update({
				data:{
					myxin:_.pull({
						sjid:bsjid
					})
				}
			})
			.then(res=>{
				wx.showToast({
					title: '已删除',
					duration:1500
				})
				this.onLoad()
			})
			.catch(err=>{
				wx.showToast({
					title: '数据错误',
					icon:'error',
					duration:1000
				})
			})	
		}else{
			db.collection('xinList').where({
					sjid:bsjid
			})
			.remove()
			.then(res=>{
				db.collection('favorite').where({
					_openid:this.data.openid
				})
				.update({
					data:{
						myxin:_.pull({
							sjid:bsjid
						})
					}
				})
				.then(res=>{
					this.onLoad()
					wx.showToast({
						title: '已删除',
						duration:1500
					})
				})
				.catch(err=>{
					wx.showToast({
						title: '数据错误',
						icon:'error',
						duration:1000
					})
				})	
			})
			.catch(res=>{
				wx.showToast({
					title: '数据错误',
					icon:'error',
					duration:1000
				})
			})
		}
	},


	
})