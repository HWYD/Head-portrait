// 云函数入口文件
// code 20000成功 50000失败
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter = require('tcb-router')
const db = cloud.database()



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })
//获取用户数据
  app.router('getUserData',async(ctx,next)=>{
    ctx.body = await db.collection("user").where({
      _openid: wxContext.OPENID
    }).get()
  })
 //创建用户 
  app.router('createUser', async (ctx, next) => {
    const userinfo=event.userinfo
    const rest= await db.collection("user").where({
      _openid: wxContext.OPENID
    }).get().then((res) => {
      if(res.data.length ==0){
        db.collection("user").add({
          data:{
            ...userinfo,
            _openid:wxContext.OPENID,
            viewcount:30,
            createTime:db.serverDate()
          }
        }).then((res)=>{
          console.log(res)
        })
      }
      else{
      db.collection("user").where({
          _openid: wxContext.OPENID
        }).update({
          data:{
            ...userinfo,
            viewcount:30,
            createTime:db.serverDate()
          }
        })
        console.log('存在')
      }
      return res
    })
    ctx.body =userinfo
  })

  //测试改变查看次数api
  //choose 值为0时，用户使用时减少，为1是，用户看广告增加 
  app.router('changeVC',async(ctx,next)=>{
    const changcount =event.changcount
    const choose = event.choose
    let user_count,code =20000
    const change_user = await db.collection("user").where({
      _openid: wxContext.OPENID
    }).get().then((res)=>{
      user_count =res.data[0].viewcount
      if(choose == 0){
        if(user_count<=0){
          code =50000
          return 
        }
        user_count--     
      } 
      else{
        user_count= user_count +changcount
      }
      if(user_count <=0)
      user_count =0
      db.collection("user").where({
        _openid: wxContext.OPENID
      }).update({
        data:{
          viewcount:user_count
        }
      })
      
    })
    ctx.body ={
      changcount,
      change_user,
      choose,
      code
    }
  })
  //获取用户列表
  app.router('getUserList',async(ctx,next)=>{
    const start =event.start
    const count =event.count
    const userList = await db.collection('user').orderBy('createTime','asc').skip(start).limit(count).get()
    ctx.body={
      data:userList,
      code:20000
    }
  })
  //根据id修改用户次数
  app.router('changeCountById',async(ctx,next)=>{
    const userId = event.userId
    const count = event.count
    console.log(userId)
    console.log(count)
    const result = await db.collection('user').where({
      _id : userId
    }).update({
      data:{
        viewcount:count
      }
    }).then(res =>{
      return {
        res,
        code:20000
      }
    }).catch(err =>{
      return { code:50000 }
    })
    ctx.body = result
  })
  
  return app.serve()
}