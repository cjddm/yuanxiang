let db=wx.cloud.database()

Page({
	data:{
		dataList:[],
		openid:'',
		whether:false,
		username:'',
		ko:false,//收藏为空
		dl:false,//登陆情况
		DL:false,//控制刷新
	},
// 先判断用户是否存在
// 根据id拉取收藏列表
	onLoad(list){
			if(this.data.whether==false){
				this.login()
			};
			if(list){
				this.setData({
					dataList:list
				})
			}
		},

		// 下拉刷新
		onPullDownRefresh(){
			if(this.data.DL==true){
				db.collection('favorite').where({
					_openid:this.data.openid
			})
			.get()
			.then(res=>{
				var list=res.data[0].xinlist
				this.setData({
					DL:true
				})
				if(res.data.length!=0){
					this.onLoad(list)
					wx.stopPullDownRefresh()
					if(res.data[0].xinlistid!=0){
						this.setData({
							ko:false
						})
					}else{
						this.setData({
							ko:true
						})
					}
				}else{
					this.setData({
						ko:true
					})
				}
			})
			}else{
				this.login()
				wx.stopPullDownRefresh()
			}
		},

		// 判断用户是否登陆
		login:function(){
			var that=this
			wx.cloud.callFunction({
				name:'userid',
				success:res=>{
					this.setData({
						openid:res.result.openid
					})
					db.collection('favorite').where({
						_openid:res.result.openid
					})
					.get()
					.then(res=>{
						// 用户已登陆
						if(res.data.length !=0){
							if(res.data[0].xinlist==''){
								this.setData({
									ko:true,
								})
							};
							this.setData({
								dataList:res.data[0].xinlist,
								username:res.data[0].username,
								dl:false,
								DL:true,
								whether:true
							})
						}else{
							// 用户未登录
							this.setData({
								dl:true,
							})
						}
					})
					.catch(err=>{
						console.log(err,"不存在");
					})
				}
			})
		},


	// 跳转到详情页面
	// 把id传到详情页
	goDetail(e){
		db.collection('favorite').where({
			_openid:this.data.openid
		})
		.get()
		.then(res=>{
			var xlistid=res.data[0].xinlistid;
			var xinid=this.data.dataList[e.currentTarget.dataset.index]._id;
			let temp=new Set(xlistid);
			let panduan=temp.has(xinid)
			if(panduan){
				var that=this
				var detail=JSON.stringify(this.data.dataList[e.currentTarget.dataset.index])
				var openid=JSON.stringify(this.data.openid)
				var username=JSON.stringify(this.data.username)
				wx.navigateTo({
					url: '/pages/detail/detail?message=' + encodeURIComponent(detail) + '&openid='+ openid+'&username='+username,
				})
			}else{
				wx.showToast({
					title: '已经取消收藏了哦',
					icon:"none",
					duration:1000
				})
				this.onPullDownRefresh()
			}
		})
	}
})