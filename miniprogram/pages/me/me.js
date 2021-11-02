// pages/me/me.js
let interstitialAd = null;
let adshow = true
let userinfo
let videoAd = null
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlogin:false,
    userAvatarUrl:'',
    userNickName:'',
    viewTime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
    // 在页面中定义激励视频广告
    
    this.getVedioAd()
    console.log(app.globalData.islogin)
    

    
  },
  //测试改变查看次数api
  //choose 值为0时，用户使用时减少，为1是，用户看广告增加 
  changeVC(){
    wx.cloud.callFunction({
      name:'userList',
      data:{
        $url:'changeVC',
        changcount:-5,
        choose:0
      }
    }).then((res)=>{
      console.log(res)
    })
  },
  //测试获取用户信息
  getuser(){
    wx.getUserInfo({
        lang: 'zh_CN',
        success:(res)=>{
         
          console.log(res.userInfo)
         
        }
      })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  this.getuser()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.islogin()
    //插屏广告
    // if (!adshow) {
    //   if (wx.createInterstitialAd) {
    //     interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-bcb13b8c9b249a17' })
    //     interstitialAd.onLoad(() => {
    //       console.log('onLoad event emit')
    //       adshow = true
    //     })
    //     interstitialAd.onError((err) => {
    //       console.log('onError event emit', err)
    //     })
    //     interstitialAd.onClose((res) => {
    //       console.log('onClose event emit', res)
    //     })
    //     interstitialAd.show().catch((err) => {
    //       console.error(err)
    //     })
    //   }
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
   this.getUserData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //获取用户信息
  getUserData(){
   wx.cloud.callFunction({
     name:'userList',
     data:{
       $url:'getUserData'
     }
   }).then((res)=>{
     console.log(res)
     this.setData({
      userlogin:true,
      userAvatarUrl:res.result.data[0].avatarUrl,
      userNickName:res.result.data[0].nickName,
       viewTime:res.result.data[0].viewcount
     })
     wx.stopPullDownRefresh({
       success: (res) => {},
     })
   })
  },
  //判断是否登录
  islogin(){
  if(app.globalData.islogin){
    this.getUserData() 
  }
  else{
    this.setData({
      userlogin:false
    })
  }
},

   
  //查看广告获取更多次数
  getMoreTime(){
    if(this.data.userlogin){
      if (videoAd) {
        videoAd.show().then((res)=>{
          console.log('激励视频 广告显示')
        }).catch(() => {
          // 失败重试
          videoAd.load()
            .then(() => videoAd.show())
            .catch(err => {
              console.log('激励视频 广告显示失败')
            })
        })
      }
    }else{
      wx.showModal({
        title:'请先登录！'
      })
    }

  },
  //激励视频代码
  getVedioAd(){
    // 在页面onLoad回调事件中创建激励视频广告实例
if (wx.createRewardedVideoAd) {
  videoAd = wx.createRewardedVideoAd({
    adUnitId: 'adunit-279bbbdab32884b9'
  })
  videoAd.onLoad(() => { console.log('激励视频 广告加载成功')})
  videoAd.onError((err) => {console.log('激励视频 广告出错')})
  videoAd.onClose((res) => {
    if(res && res.isEnded){
      console.log("完整")
      wx.cloud.callFunction({
        name:'userList',
        data:{
          $url:'changeVC',
          changcount:20,
          choose:1
        }
      }).then((res)=>{
        // console.log(res)
        if(res.result.code==20000){
          wx.showToast({
            title: '次数+20!',
            image:'../../images/smile.png'
          })
          this.getUserData()
        }
      })
    }
    else{
      console.log("不完整")
    }
 
  })
}
  },
  //登录创建用户
  tologin(event){
    const userinfo =event.detail.userInfo
    console.log(userinfo)
   if(userinfo){
    wx.cloud.callFunction({
      name:'userList',
      data: {
       $url: 'createUser',
       userinfo
     }
    }).then((res)=>{ 
      this.setData({
      userlogin:true
      })
      app.globalData.islogin =true
      this.getUserData()
    })
   }else{
    
   }
  }
})