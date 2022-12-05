// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud1-7gy63ub05adcdf3b'
})
const TcbRouter = require('tcb-router')
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('来了',event,context)
  const wxContext = cloud.getWXContext()
  const app =new TcbRouter({event})
  app.router('getMixedHead',async(ctx,next)=>{ 
    let sort =event.sort
    if(!sort){
     sort = 'desc'
    }
    ctx.body= await db.collection('photo').orderBy('createTime',sort)
    .skip(event.start)
    .limit(event.count).get()
  }) 
  console.log('出了',event,context)
  return app.serve()
  
}