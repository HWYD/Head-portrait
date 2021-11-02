// 云函数入口文件
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
  app.router('animesList', async (ctx, next) => {
    ctx.body = await db.collection("animesList").get().then((res) => {
      return res.data
    })
  })
  app.router('boysList', async (ctx, next) => {
    ctx.body = await db.collection("boysList").get().then((res) => {
      return res.data
    })
  })
  app.router('girlsList', async (ctx, next) => {
    ctx.body = await db.collection("girlsList").get().then((res) => {
      return res.data
    })
  })
  app.router('funnyList', async (ctx, next) => {
    ctx.body = await db.collection("funnyList").get().then((res) => {
      return res.data
    })
  })
  app.router('petsList', async (ctx, next) => {
    ctx.body = await db.collection("petsList").get().then((res) => {
      return res.data
    })
  })
  app.router('sceneryList', async (ctx, next) => {
    ctx.body = await db.collection("sceneryList").get().then((res) => {
      return res.data
    })
  })

  return app.serve()
}