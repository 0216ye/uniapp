import request from '../../utils/request.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    interval:2000,//控制轮播切换的时间
    bannerList:[],//存放轮播图的数据
    recommendList:[], //推荐歌曲数据
    topList: [] //排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //发送请求，获取banner轮播图信息&歌曲添加信息,使用await等待Promise返回成功的状态数据
    let bannerList = await request('/banner',{type:2})
    let recommendList = await request('/personalized',{limit:18})
    if ( !bannerList || !recommendList ){
      wx.showToast({
        title: '获取资源失败!',
        icon: 'none',
      })
      return
    }


    let count = 0
    let resultArr = []
    while (count < 5) {
      let topListData =   await request('/top/list',{idx:count++})
      if ( !topListData ){
        wx.showToast({
          title: '获取资源失败!',
          icon: 'none',
        })
        return
      }
      // 获取单个排行榜所需的数据
      let topListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
      resultArr.push(topListItem)
      this.setData({
        topList:resultArr
      })
    }
    this.setData({
      bannerList:bannerList.banners,
      recommendList:recommendList.result
    })
  },

  /**
   * 跳转到推荐页面
   */
  handleToRecommendSong (){
    wx.navigateTo({
      url:'/pages/recommendSong/recommendSong'
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