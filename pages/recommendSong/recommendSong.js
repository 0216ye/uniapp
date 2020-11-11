import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//页面显示的日期号数
    month:'',//页面显示的月份数
    recommendSongList:[],//保存每日推荐歌曲数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    //用户没有登录,跳转到登录页面
    if ( !userInfo ){
      wx.showToast({
        title:'请先登录',
        icon:'none',
        success(){
          // 跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    //获取列表数据
    this.getrecommendSong()
  },  
  
  /**
   *  获取每日推荐歌曲数据
   */ 
  async getrecommendSong (){
    let result = await request('/recommend/songs')
    if ( result ){
      this.setData({
        recommendSongList:result.recommend
      })
    } 

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