import { compareVersion } from '../../utils/index'
let count= 12
let sort='asc'
let x =0,y=0
// 在页面中定义插屏广告
let interstitialAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mixedPicture:[],
    noMore: false, //是否没有更多图片了
    x:0,
    y:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPictureList()
    this.createInterstitialAd()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  //  this.getPictureList()
  },
  getMore() {
    console.log("触底");
    this.getPictureList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPictureList(){
    if (this.data.noMore) {
      return;
    }
    wx.cloud.callFunction({
      name:'getPictureList',
      data:{
        $url:'pictures',
        start:this.data.mixedPicture.length,
        sort,
        count
      }
    }).then((res)=>{
      this.setData({
        mixedPicture:this.data.mixedPicture.concat(res.result.data),
        noMore: res.result.data.length < count
      })
    })
    //插屏广告
    if(this.data.mixedPicture.length > (count*3)){
      this.showInterstitialAd()
    }
  },
  toshowImg(event){
    // console.log(event.currentTarget.dataset.imginfo)
    const imgurl = event.currentTarget.dataset.imgurl
    wx.navigateTo({
      url: `/pages/picturedownload/index?imgurl=${imgurl}`,
    })
  },
  sortList(){
    if(sort ==='asc'){
      sort='desc'     
    }
    else{
      sort='asc'
    }
    this.data.mixedPicture=[]
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.getPictureList()  
  },
  changePosition(event){
    console.log(event)
    if(event.detail.source === 'touch'){
      x=event.detail.x
      y=event.detail.y
    }    
  },
  touchEndfn(){
    console.log('结束',x,y)
      this.setData({
        x :0,
        y
      })
  },
    // 插屏广告
    createInterstitialAd(){
      const version = wx.getSystemInfoSync().SDKVersion
      if (compareVersion(version, '2.6.0') >= 0) {
        interstitialAd = wx.createInterstitialAd({adUnitId: 'adunit-f6bf56ca178a899a' })
      }
    },
    //展示插屏广告
    showInterstitialAd(){
      if(interstitialAd){
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    },
})