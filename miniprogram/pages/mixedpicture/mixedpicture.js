// miniprogram/pages/mixHead/mixHead.js
let count=30
let sort='asc'
let x =0,y=0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mixHead:[],
    x:0,
    y:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMixList()
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
   this.getMixList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getMixList(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'getPictureList',
      data:{
        $url:'pictures',
        start:this.data.mixHead.length,
        sort,
        count
      }
    }).then((res)=>{
      console.log(res)
      this.setData({
        mixHead:this.data.mixHead.concat(res.result.data)
      })
      wx.hideLoading()
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
  sortList(){
    if(sort ==='asc'){
      sort='desc'     
    }
    else{
      sort='asc'
    }
    this.data.mixHead=[]
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.getMixList()  
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
  }
})