let imagesList = [{ flag: 0, type: 'boy_picture' }, { flag: 0, type: 'girl_picture' }, { flag: 0, type: 'comic_picture' }, { flag: 0, type: 'loves_picture' }, { flag: 0, type: 'funny_picture' }, { flag: 0, type: 'pet_picture' }, { flag: 0, type: 'sceney_picture' }];
let interstitialAd = null
let adshow =false
const db =wx.cloud.database()
let videoAd = null
let islogin =false
const app =getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    item: 0,
    tab: 0,
    boy_picture: [],
    girl_picture: [],
    comic_picture:[],
    loves_picture:[],
    funny_picture:[],
    pet_picture:[],
    sceney_picture:[],
    modalShow:false,
  },
  //页面切换
  changeItem: function (e) {
    let item = e.target.dataset.item
    this.setData({
      item
    })
    if (imagesList[item].flag == 0) {
      console.log('shi0')
      this.getApi(imagesList[item].type, item)
    }
    console.log(item)
  },
  changeTab: function (e) {
    let tab = e.detail.current
    this.setData({
      tab
    })
    if (imagesList[tab].flag == 0) {
      console.log('shi00')
      this.getApi(imagesList[tab].type, tab)

    }
    console.log(this.data.tab)
  },
  getApi(type, index) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getPictureList',
      data: {
        $url: 'pictures',
        type,
        start: 1,
        count: 20
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        [type]: res.result.data
      })
      imagesList[index].flag = 1
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'getPictureList',
      data: {
        $url: 'pictures',
        type: 'boy_picture',
        start: 1,
        count: 20
      }
    }).then((res) => {
      console.log(res.result)
      this.setData({
        boy_picture: res.result.data
      })
      // imagesList = [{ flag: 1, name: 'boysList' }, { flag: 0, name: 'girlsList' }, { flag: 0, name: 'animesList' }, { flag: 0, name: 'sceneryList' }, { flag: 0, name: 'petsList' }, { flag: 0, name: 'funnyList' }]
      wx.hideLoading()
    })
    this.getVedioAd()

  },
  //测试改变查看次数api
  //changcount是增加或减少的次数，正数+，负数—
  //choose 值为0时，用户使用时减少，为1是，用户看广告增加 
  changeVC(changcount,choose){
    wx.cloud.callFunction({
      name:'userList',
      data:{
        $url:'changeVC',
        changcount:changcount,
        choose:choose
      }
    }).then((res)=>{
      // console.log(res)
     
       return 123
    })
  },
  toshowImg(event){
    // console.log(event.currentTarget.dataset.imginfo)
    const imgurl = event.currentTarget.dataset.imgurl
    wx.navigateTo({
      url: `/pages/picturedownload/index?imgurl=${imgurl}`,
    })
    // const previewList = [imginfo]
    // console.log(previewList)
    // wx.previewImage({
    //   current: previewList[0], // 当前显示图片的http链接
    //   urls: previewList
    // })
  },
  gotodetail(event) {
    let hello = event.currentTarget.dataset.imglist
    if(app.globalData.islogin){
      wx.cloud.callFunction({
        name:'userList',
        data:{
          $url:'changeVC',
          changcount:-5,
          choose:0
        }
      }).then((res)=>{
        if(res.result.code ==20000){
          wx.navigateTo({
            url: `../showImgdel/showImgdel?imgList=${hello}`,
      
          })
        }
        else{
          wx.showModal({
            title:'查看次数不足，前往获取',
            confirmText:'查看广告',
            success:(res)=>{
              //点击确定
             if(res.confirm){
            console.log('确定啦')
            // 用户触发广告后，显示激励视频广告
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
             }
             //点击取消
             if(res.cancel){
              console.log('布拉')
             }
            }
          })
        }
      })
    }else{
      this.setData({
        modalShow: true
      })
    }

  },
  //授权成功
  onLoginSuccess(event){ 
    const userinfo =event.detail
    wx.cloud.callFunction({
      name:'userList',
      data: {
       $url: 'createUser',
       userinfo
     }
    }).then((res)=>{
     app.globalData.islogin =true
      
    })
      },
      //授权失败
      onLoginFalse(){
      wx.showModal({
        title: '授权用户才能查看更多图片',
        content: '',
      })
      },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if(!adshow){
    //   if (wx.createInterstitialAd) {
    //     interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-f6bf56ca178a899a' })
    //     interstitialAd.onLoad(() => {
    //       console.log('onLoad event emit')
    //       adshow =true
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
    let tab =this.data.tab
    this.getApi(imagesList[tab].name, tab)
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
        }
      })
    }
    else{
      console.log("不完整")
    }
 
  })
}
  },
  //判断是否登录
  islogin(){
    wx.getSetting({
      withSubscriptions: true,
      success:(res)=>{
        if(res.authSetting['scope.userInfo']){
            islogin=true       
        }
        else{
          islogin =false
        }
      }
    })
  },
})