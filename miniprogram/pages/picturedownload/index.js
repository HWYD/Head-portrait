// pages/picturedown/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      imgurl: options.imgurl
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  download(){
    wx.getSetting({
      success:(res)=> {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: ()=> {
              this.downloadPicture()
            }
          })
        }else{
          this.downloadPicture()
        }
      }
    })
   
    
  },
  downloadPicture(){
    wx.getImageInfo({
      src: this.data.imgurl,
      success(res){
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) { 
            console.log(res)
            wx.showToast({
              title: '保存成功',
              image: '../../images/smile.png'
            })
          }
        })
      }
    })
  }
})