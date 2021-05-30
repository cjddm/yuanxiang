// pages/write/write.js
let db=wx.cloud.database();
const _ = db.command;

Page({
  data: {
    title: '',
		msg:"",
		openid:'',
		name:""
	},
	onLoad(options){
		this.data.openid=options.id
		console.log(this.data.openid);
	},
  //获取用户输入的内容
  userNameInput:function(e){
    this.setData({
      title: e.detail.value
    })
  },
  passWdInput:function(e)
  {
    this.setData({
      msg: e.detail.value
    })
	},
  //公开
  loginBtnClick: function (e) {
		db.collection('favorite').where({
			userid:this.data.openid
		})
		.get({
			success:res=>{
				console.log(res);
				if(res.data.length != 0){
				var name=res.data[0].username
					if(this.data.msg!=""&&this.data.title!=""){
						var sjnum=this.random()
						db.collection('xinList').add({
							data:{
								display:'0',
								from:name,
								mgtop:'',
								msg:this.data.msg,
								scale:"",
								slateX:"",
								style:"",
								to:this.data.title,
								userid:this.data.openid,
								zIndex:'0',
								gx:'公开',
								sjid:sjnum
							}
						})
						.then(res=>{
							console.log(res,"成功");
							db.collection('favorite').where({
								_openid:this.data.openid
							})
							.update({
								data:{
									myxin:_.push({
										each:[{
										display:'0',
										from:name,
										mgtop:'',
										msg:this.data.msg,
										scale:"",
										slateX:"",
										style:"",
										to:this.data.title,
										userid:this.data.openid,
										zIndex:'0',
										gx:'公开',
										sjid:sjnum
										}],
										position:0
									})
								}
							})	
							.then(res=>{
								wx.showToast({
									title: '发表成功',
									icon:"success",
									duration:1000
								}),
								setTimeout(() => {
									wx.navigateBack({
										delta:1
									})
								}, 1200);
							})
							.catch(err=>{
								console.log(err,"失败");
								wx.showToast({
								title: '数据错误',
								icon:"none"
							})
							})		
						})
						.catch(err=>{
							console.log(err,"失败");
								wx.showToast({
								title: '数据错误',
								icon:"none"
							})
						})
					}else{
						wx.showToast({
							title: '标题和内容为空',
							icon:"error"
						})
					}
				}else{
					wx.showToast({
						title: '请先登录',
						icon:"error"
					})
				}
			}
		})
	},
	
	// 私密
	loginBtnClicktwo:function(){
		db.collection('favorite').where({
			userid:this.data.openid
		})
		.get({
			success:res=>{
				console.log(res);
				if(res.data.length != 0){
				var name=res.data[0].username
					if(this.data.msg!=""&&this.data.title!=""){
						var sjnum=this.random()
							db.collection('favorite').where({
								_openid:this.data.openid
							})
							.update({
								data:{
									myxin:_.push({
										each:[{
										from:name,
										msg:this.data.msg,
										to:this.data.title,
										userid:this.data.openid,
										gx:'私密',
										sjid:sjnum
										}],
										position:0
									})
								}
							})
							.then(res=>{
								wx.showToast({
									title: '发表成功',
									icon:"success",
									duration:1000
								}),
								setTimeout(() => {
									wx.navigateBack({
										delta:1
									})
								}, 1200);
							})
							.catch(err=>{
								wx.showToast({
									title: '数据错误',
									icon:"error",
									duration:1000
								})
							})
						}else{
							wx.showToast({
								title: '标题和内容为空',
								icon:"error"
							})
					}
				}else{
					wx.showToast({
						title: '请先登录',
						icon:"error"
					})
				}
			}
		})
	},
		// 生成随机数
		random:function(){
			const charts = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
				var res = '';
				for(var i = 0; i <22; i++){
					var id = Math.ceil(Math.random()*35);
					res += charts[id];
				}
				return res
		},
})