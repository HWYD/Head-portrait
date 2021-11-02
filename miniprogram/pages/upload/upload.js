 // 输入文字最大的个数
const MAX_WORDS_NUM = 140
// 最大上传图片的个数
const MAX_IMG_NUM = 50
const db = wx.cloud.database()
//content 表示输入的文字内容
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true,  //添加图片的元素是否显示
  },
  onInput(event) {
    // console.log(event.detail.value)
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onChooseImage() {
    // 还能再选图片的个数
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original'],
      // , 'compressed'
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 选完了还能再选图片的个数
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max > 0 ? true : false
        })
      },

    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true
      })
    }
  },
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },
  send() {
    //2、数据->云数据库
    //数据库：文字、图片、openid、昵称、头像、时间
    //1、图片：云存储  fileID 云文件ID
    //promise对象
    // if (content.trim() === '') {
    //   wx.showModal({
    //     title: '请输入内容',
    //     content: '',
    //   })
    //   return
    // }
    wx.showLoading({
      title: '发布中',
      mask: true,
    })
    let promiseArr = []
    let fileIds = []
    //图片上传
    for (let i = 0, len = this.data.images.length; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        //获取文件的扩展名，可以正则表达式
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'boysList/' + Date.now() + '-' + Math.random() * 10000000 + suffix,
          filePath: item,
          success: (res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    //图片上传到云存储后存入数据库
    Promise.all(promiseArr).then((res) => {
      db.collection('boysList').add({
        data: {
          // ...userInfo,
          img_cover: fileIds[0],
          content,
          img: fileIds,
          createTime: db.serverDate(),  //获取服务端的时间
        }
      }).then((res) => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        //返回博客页面并刷新
    wx.navigateBack()
        // const pages = getCurrentPages()
        //  console.log(pages)
        //取到上一个页面
        // const prevPage = pages[pages.length - 2]
        // prevPage.onPullDownRefresh()
        // MAX_IMG_NUM = 9
        // this.setData({
        //   images: []
        // })
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // userInfo = options
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