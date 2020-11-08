import request from '../../utils/request';
let startY = 0
let move = 0
let moveDestore = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTranformY:"translateY(0rpx)",//用户控制位移的距离
    currentTranstion:'',//控制滑动效果
    userInfo:{}, //保存用户的信息
    recenPlayMusicAll:[] ,//保存用户最近的播放记录
  },

  /**
   * 跳转到登录界面
   */
  toLogin (){
    wx.reLaunch({
      url:"/pages/login/login"
    })
  },

  /**
   * 
   * 发送请求获取最近的播放记录 
   */
  async recenPlayMusic (userId){
    let recenPlayMusicData = await request('/user/record',{uid:userId,type:0})
    let index = 0
    //将获取到是数据截取15个，并在每个item中添加一个唯一ID
    let recenPlayMusicAll = recenPlayMusicData.allData.slice(0,16).map(item => {
      item.id = index++
      return item
    })
    //将数据保存到data中
    this.setData({
      recenPlayMusicAll
    }) 
  },

  //监听手指刚放到屏幕上
  handleTouchStart (event){
    this.setData({
      currentTranstion:''
    })
    //获取手指第一次点击时的位置
    startY = event.touches[0].clientY
  },  


  //监听手指移动
  handleTouchMove (event){
    move = event.touches[0].clientY
    //获取手指移动了多长的距离
    moveDestore = move - startY
    if ( moveDestore < 0 ){
      //不让其往上滑动
      return;
    }
    if ( moveDestore >= 80){
      //最大向下滑动80rpx
      moveDestore = 80
    }
    this.setData({
      currentTranformY:`translateY(${moveDestore}rpx)`
    })
  },


  //监听手指松开
  handleTouchEnd (){
    this.setData({
      //复原和设置过渡
      currentTranformY:'translateY(0rpx)',
      currentTranstion:'transform 1s linear'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从本地读取保存得用户数据
    let userInfoData =  wx.getStorageSync('userInfo')
    if ( userInfoData ){
      let userInfo = JSON.parse(userInfoData)
      this.setData({
        userInfo
      })
      //调用获取最近播放记录的方法,并传入userId
      this.recenPlayMusic(userInfo.userId)
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