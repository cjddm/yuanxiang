// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
	env:"1024-7gzn27kk7bf3245f"
})
const db=cloud.database()
const _ =db.command


// 云函数入口函数
exports.main = async (event, context) => {
	return await db.collection('xinList').doc(event.id)
	.update({
		data:{
				comment: _.push({
					each:[
						event.value
					],
					position:0
				})
		}	
	})
	.then(res=>{
		console.log("成功",res);
	})
	.catch(err=>{
		console.log("失败",err);
	})

}