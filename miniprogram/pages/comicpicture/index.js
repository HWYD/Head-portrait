import { compareVersion } from '../../utils/index'
const count = 10;
let interstitialAd = null;
let videoAd = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    //flag:是否请求过;dramaId:剧名id; noMore:是否没有更多图片了,interstitialAdShow是否展示过插屏ad,showAdCount：多少张图片就展示插屏ad
    pictureTypes: [
      { flag: 0, dramaId: "1", name: "海贼王", data: [], noMore: false, interstitialAdShow: false,showAdCount:50},
      { flag: 0, dramaId: "2", name: "火影", data: [], noMore: false, interstitialAdShow: false,showAdCount:50 },
      { flag: 0, dramaId: "3", name: "七龙珠", data: [], noMore: false , interstitialAdShow: false,showAdCount:50},
      { flag: 0, dramaId: "4", name: "犬夜叉", data: [], noMore: false, interstitialAdShow: false,showAdCount:50 },
      { flag: 0, dramaId: "5", name: "美少女战士", data: [], noMore: false, interstitialAdShow: false,showAdCount:50 },
      { flag: 0, dramaId: "6", name: "哆啦A梦", data: [], noMore: false , interstitialAdShow: false,showAdCount:50}
      // { flag: 0, dramaId: "7", name: "蜡笔小新", data: [], noMore: false },
      // { flag: 0, dramaId: "8", name: "猫和老鼠", data: [], noMore: false },
    ]
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
      this.getPictureList(tab);
    }
  },
  //pictureTypes中的type和index
  getPictureList(index) {
    if (this.data.pictureTypes[index].noMore) {
      return;
    }
    wx.cloud
      .callFunction({
        name: "getPictureList",
        data: {
          $url: "pictures",
          type: "comic_picture",
          start: this.data.pictureTypes[index].data.length,
          count,
          dramaId: this.data.pictureTypes[index].dramaId,
        },
      })
      .then((res) => {
        const pictureDataTypeKey = `pictureTypes[${index}].data`;
        const pictureTypesFlagKey = `pictureTypes[${index}].flag`;
        const pictureTypesNoMoreKey = `pictureTypes[${index}].noMore`;
        //如果返回的数据是偶数,拼接一条广告
        let showRet = res.result.data
        if(showRet.length && showRet.length % 2 === 0 ){
          showRet = showRet.concat([{ad:true}])
        }
        this.setData({
          [pictureDataTypeKey]: this.data.pictureTypes[index].data.concat(showRet),
          [pictureTypesFlagKey]: 1,
          [pictureTypesNoMoreKey]: res.result.data.length < count
        })
         //插屏广告
        if(this.data.pictureTypes[index].data.length > this.data.pictureTypes[index].showAdCount && !this.data.pictureTypes[index].interstitialAdShow){
          // console.log('开广告')
          this.showInterstitialAd()
          this.setData({
            [`pictureTypes[${index}].interstitialAdShow`]: true
          })
        }
      })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPictureList(0);
    this.createInterstitialAd()
    // this.getVedioAd();
  },
  toshowImg(event) {
    const imgurl = event.currentTarget.dataset.imgurl;
    wx.navigateTo({
      url: `/pages/picturedownload/index?imgurl=${imgurl}`,
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  getMore(){
    console.log('触底')
    this.getPictureList(this.data.tab);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  // 插屏广告
  createInterstitialAd(){
    const version = wx.getSystemInfoSync().SDKVersion
    if (compareVersion(version, '2.6.0') >= 0) {
      interstitialAd = wx.createInterstitialAd({adUnitId: 'adunit-bcb13b8c9b249a17' })
    }
  },
  //展示插屏广告
  showInterstitialAd(){
    console.log('来')
    if(interstitialAd){
      console.log('3113')
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },
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
