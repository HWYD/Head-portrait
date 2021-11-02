// miniprogram/pages/getcode/getcode.js
let imagesList = [{ flag: 0, name: 'boysList' }, { flag: 0, name: 'girlsList' }, { flag: 0, name: 'animesList' }, { flag: 0, name: 'boysList' }, { flag: 0, name: 'boysList' }, { flag: 0, name: 'boysList' }, { flag: 0, name: 'boysList' },]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: 0,
    tab: 0,
    animesList:'',
    boysList:''
  },
  //页面切换
  changeItem: function (e) {
    let item = e.target.dataset.item
    this.setData({
      item
    })
    if (imagesList[item].flag==0){
      console.log('shi0')
      this.getApi(imagesList[item].name,item)
    }
    console.log(item)
  },
  changeTab: function (e) {
    let tab = e.detail.current
    this.setData({
      tab 
    })
    if(imagesList[tab].flag==0){
      console.log('shi00')
      this.getApi(imagesList[tab].name,tab)

    }
    console.log(this.data.tab)
  },
getApi(name,index){
console.log(name)
  wx.showLoading({
    title: '加载中',
  })
  wx.cloud.callFunction({
    name: 'getImgList',
    data: {
      $url: name
    }
  }).then((res) => {
    console.log(res)
    this.setData({
     [name]:res.result
    })
    imagesList[index].flag = 1
    wx.hideLoading()
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
      name: 'getImgList',
      data: {
        $url: 'boysList'
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        boysList: res.result
      })
      wx.hideLoading()
    })
  },
  gotodetail(event) {
    // console.log(event)
    // console.log(event.currentTarget.dataset.imglist)
    let hello = event.currentTarget.dataset.imglist
    wx.navigateTo({
      url: `../showImgdel/showImgdel?imgList=${hello}`,

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

  }
})