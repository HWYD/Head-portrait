const db = wx.cloud.database();
const count = 12;
let interstitialAd = null;
let adshow = false;
let videoAd = null;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    pictureData: {
      boy_picture: [],
      girl_picture: [],
      comic_picture: [],
      loves_picture: [],
      funny_picture: [],
      pet_picture: [],
      sceney_picture: [],
    },
    pictureTypes: [
      { flag: 0, type: "boy_picture", name: "男生" },
      { flag: 0, type: "girl_picture", name: "女生" },
      { flag: 0, type: "comic_picture", name: "动漫" },
      { flag: 0, type: "loves_picture", name: "情侣" },
      { flag: 0, type: "funny_picture", name: "搞笑" },
      { flag: 0, type: "pet_picture", name: "萌宠" },
      { flag: 0, type: "sceney_picture", name: "风景" }
    ],
  },
  //页面切换
  changeItem: function (e) {
    let tab = e.target.dataset.tab;
    this.setData({
      tab,
    });
  },
  changeTab: function (e) {
    let tab = e.detail.current;
    this.setData({
      tab,
    });
    if (this.data.pictureTypes[tab].flag == 0) {
      this.getApi(this.data.pictureTypes[tab].type, tab);
    }
  },
  //pictureTypes中的type和index
  getApi(type, index) {
    wx.cloud
      .callFunction({
        name: "getPictureList",
        data: {
          $url: "pictures",
          type,
          start: this.data.pictureData[type].length,
          count,
        },
      })
      .then((res) => {
        const pictureDataTypeKey = `pictureData.${type}`
        const pictureTypesFlagKey = `pictureTypes[${index}].flag`;
        this.setData({
          [pictureDataTypeKey]: this.data.pictureData[type].concat(res.result.data),
          [pictureTypesFlagKey]: 1,
        });
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getApi("boy_picture", 0);
    this.getVedioAd();
  },
  toshowImg(event) {
    const imgurl = event.currentTarget.dataset.imgurl;
    wx.navigateTo({
      url: `/pages/picturedownload/index?imgurl=${imgurl}`,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getApi(this.data.pictureTypes[this.data.tab].type, this.data.tab);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  //激励视频代码
  getVedioAd() {
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: "adunit-279bbbdab32884b9",
      });
      videoAd.onLoad(() => {
        console.log("激励视频 广告加载成功");
      });
      videoAd.onError((err) => {
        console.log("激励视频 广告出错");
      });
      videoAd.onClose((res) => {
        if (res && res.isEnded) {
          console.log("完整");
          wx.cloud
            .callFunction({
              name: "userList",
              data: {
                $url: "changeVC",
                changcount: 20,
                choose: 1,
              },
            })
            .then((res) => {
              // console.log(res)
              if (res.result.code == 20000) {
                wx.showToast({
                  title: "次数+20!",
                  image: "../../images/smile.png",
                });
              }
            });
        } else {
          console.log("不完整");
        }
      });
    }
  },
});
