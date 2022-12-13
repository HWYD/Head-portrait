import { compareVersion } from '../../utils/index'
import config from "../../config/index"
let videoAd = null;
const app = getApp();
let loading = false  //数据请求时，避免重复请求
// 在页面中定义插屏广告
let interstitialAd = null
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    //flag:是否请求过; noMore:是否没有更多图片了,interstitialAdShow是否展示过插屏ad,showAdCount：多少张图片就展示插屏ad
    pictureTypes: [
      { flag: 0, type: "boy_picture", name: "男生", data: [], dataLen: 0, noMore: false },
      { flag: 0, type: "girl_picture", name: "女生", data: [], dataLen: 0,  noMore: false },
      { flag: 0, type: "comic_picture", name: "动漫", data: [], dataLen: 0,  noMore: false },
      { flag: 0, type: "loves_picture", name: "情侣", data: [], dataLen: 0,  noMore: false },
      { flag: 0, type: "funny_picture", name: "搞怪", data: [], dataLen: 0,  noMore: false },
      { flag: 0, type: "pet_picture", name: "萌宠", data: [], dataLen: 0,  noMore: false },
      { flag: 0, type: "sceney_picture", name: "风景", data: [], dataLen: 0,  noMore: false}
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
    if (this.data.pictureTypes[index].noMore || loading) {
      return;
    }
    loading = true
    wx.cloud
      .callFunction({
        name: "getPictureList",
        data: {
          $url: "pictures",
          type: this.data.pictureTypes[index].type,
          start: this.data.pictureTypes[index].dataLen,
          count: config.count
        },
      })
      .then((res) => {
        const pictureDataTypeKey = `pictureTypes[${index}].data`;
        const pictureTypesFlagKey = `pictureTypes[${index}].flag`;
        const pictureTypesNoMoreKey = `pictureTypes[${index}].noMore`;
        const pictureTypesDataLenKey = `pictureTypes[${index}].dataLen`;
        //如果返回的数据是偶数,拼接一条广告
        let showRet = res.result.data
        const resLen = showRet.length
        if(showRet.length && showRet.length % 2 === 0 ){
          showRet = showRet.concat([{ad:true,_id:this.data.pictureTypes[index].dataLen}])
        }
        this.setData({
          [pictureDataTypeKey]: this.data.pictureTypes[index].data.concat(showRet),
          [pictureTypesFlagKey]: 1,
          [pictureTypesNoMoreKey]: resLen < config.count,
          [pictureTypesDataLenKey]: this.data.pictureTypes[index].dataLen + resLen
        });
        //插屏广告
        if(this.data.pictureTypes[index].dataLen % config.showAdCount == 0){
          this.showInterstitialAd()
          this.setData({
            [`pictureTypes[${index}].interstitialAdShow`]: true
          })
        }
        loading = false
      }).catch(()=>{
        loading = false
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPictureList(0);
    this.createInterstitialAd()
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
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  getMore() {
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
