// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7gy63ub05adcdf3b'
})
const TcbRouter = require('tcb-router')
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const app =new TcbRouter({event})
  app.router('pictures',async(ctx,next)=>{ 
    const sort = event.sort? event.sort : 'desc'
    //参数type对应相应类型的数据表
    const collection = event.type? event.type : 'mixed_picture' 
    const dramaId = event.dramaId? event.dramaId : 0
    if(dramaId != 0){
      ctx.body = await db.collection(collection).where({
        dramaId: db.command.eq(dramaId)
      }).orderBy('createTime',sort)
      .skip(event.start)
      .limit(event.count).get()
    }else{
      ctx.body = await db.collection(collection).orderBy('createTime',sort)
      .skip(event.start)
      .limit(event.count).get()
    }
  }) 
  return app.serve()
}