// 云函数入口文件
const cloud = require('wx-server-sdk')
const DB= cloud.database().collection("xinList")

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
	// const wxContext = cloud.getWXContext()
	return await DB.doc(event.id)
	.update({
		data:{
			collect:event.collect
		}
	})
	.then(res=>{
		console.log("改变收藏状态成功",res);
		return res
	})
	.catch(res=>{
		console.log("改变收藏状态失败",res);
		return res
	})
}