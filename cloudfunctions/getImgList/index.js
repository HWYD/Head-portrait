// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const TcbRouter =require('tcb-router')
const db =cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let result = await db.collection("animesList").get().then((res) => {
      return res.data
    })
 return {
   result :result
 }
  // const app = new TcbRouter({
  //   event
  // })
  // app.router('animesList', async (ctx, next) => {
  //   ctx.body = await db.collection("animesList").get().then((res) => {
  //     return res.data
  //   })
  // })
  // app.router('boysList', async (ctx, next) => {
  //   ctx.body = await db.collection("boysList").get().then((res) => {
  //     return res.data
  //   })
  // })

  // return app.serve()
}