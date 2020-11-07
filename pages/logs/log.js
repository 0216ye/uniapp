// pages/logs/log.js
Page({

  /**
   * 页面的初始数据
   */
  data: { //在data中初始化数据
    msg: '初始化数据',
    userInfo: {}
  },
  //绑定事件的一些方法
  handleParent() {
    console.log('parent')
  },
  handleChild() {
    console.log('Child')
  },

  //路由跳转
  toLogs() {
    wx.navigateTo({
      url: '/pages/logs/log',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    // console.log(this.data.msg) //读取data中的数据
    // this.setData({
    //   msg: '更新后的数据'
    // })
    // console.log(this.data.msg)

    // 必须是在用户已经授权的情况下调用
    wx.getUserInfo({
      //成功回调
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo
        })
      },
      //失败回调
      fail: (err) => {
        console.log(err)
      }
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