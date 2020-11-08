import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[], //初始化导航文本的数据
    currentId: ''
  },

  /**
   *获取导航文本的数据
   */
  async getVideoGroupListData (){
    let videoGroupListData = await request('/video/group/list')
    //获取前15个对象文本数据
    let videoGroupList = videoGroupListData.data.slice(0,14)
    if ( videoGroupList ){
      this.setData({
        videoGroupList,
        //初始化第一个文本选中
        currentId:videoGroupList[0].id
      })
    }
  },

  /**
   * 获取点击当前的item传递过来的id,并保存到data中
   */
  currentItem (event){
    console.log(event)
    //标签传递的id会自动将number转为String，而data-key传递的则不会
    let id = event.currentTarget.id
    this.setData({
      currentId: id*1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData()
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