// miniprogram/pages/showImgdel/showImgdel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  imagesList:'',
  tips:'点击图片预览，长按保存到手机'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.imgList)
    let getstring = options.imgList
    let imagesList = getstring.split(',')
    this.setData({
      imagesList
    })
  },
  preView(event){
    let imgIndex = event.currentTarget.dataset.imgindex
    console.log(event)
  wx.previewImage({
    urls: this.data.imagesList,
    current: this.data.imagesList[imgIndex]
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  adLoad() {
    console.log('Banner 广告加载成功')
  },
  adError(err) {
    console.log('Banner 广告加载失败', err)
  },
  adClose() {
    console.log('Banner 广告关闭')
  },
  gridLoad(){
    console.log('gird加载成功')
  }
})