import request from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[], //初始化导航文本的数据
    navId: '',//保存当前点击的navItem的ID
    videoList:[],//保视频数据
    videoId:'',//保存当前点击图片的ID
    videoUpdateTiem:[], //保存着所有视频的播放记录
    isTriggered:false 
  },

  /**
   *获取导航文本的数据
   */
  async getVideoGroupListData (){
    let videoGroupListData = await request('/video/group/list')
    if ( !videoGroupListData ){
      wx.showToast({
        title: '获取资源失败!',
        icon: 'none',
      })
      return
    }

    //获取前15个对象文本数据
    let videoGroupList = videoGroupListData.data.slice(0,14)

    this.setData({
      videoGroupList,
      //初始化第一个文本选中
      navId:videoGroupList[0].id
    })
    this.getVideoList(this.data.navId)
  },
 
  /**
   * 获取点击当前的item传递过来的id,并保存到data中
   */
  currentItem (event){
    //标签传递的id会自动将number转为String，而data-key传递的则不会
    let id = event.currentTarget.id
    this.setData({
      navId: id*1,
      //清除视频数据，已显示下面loading效果
      videoList:[]
    })
    wx.showLoading({
      title:'正在加载中'
    })
    //切换时，自动获取新的视频数据
    this.getVideoList(this.data.navId)
  },

   /**
   * 获取视频数据
   */
  async getVideoList (id){
    let viodeListData = await request('/video/group',{id,isLogin:true})
    if ( !viodeListData ){
      wx.showToast({
        title: '获取资源失败!',
        icon: 'none',
      })
      return
    }

    //清除loading效果
    wx.hideLoading()
    let index = 0
    let videoList = viodeListData.datas.map( item =>{
      item.id = index++
      return item
    })
    this.setData({
      videoList
    })
  },

  /**
   *监视视频点击播放/继续播放函数
   */
  handlePlay (event){
    let { videoUpdateTiem } = this.data
    let id = event.currentTarget.id
    //将点击的图片的id保存，用于video和image的if判断显示
    this.setData({
      videoId:id
  })
  
    /**
     * 因为使用了image进行了优化,视频页中最多展示一个视频，其他非当前播放的都是使用图片替代，所以以下的代码不使用
     * 多个视频同时播放，只能一个播放  只有当id和对象不跟上次一样才能触发暂停
     * 
      this.id !== id && this.videoContext && this.videoContext.stop()
      将每次创建的video对象保存到this上，单列模式
      this.id = id
    */

    //根据相应的id创建video对象,通过该对象可以控制视频的播放..
    this.videoContext =  wx.createVideoContext(id)
    let videoTime = videoUpdateTiem.find( item => item.id === id)
    //如果能找到与当前播放的视频对应的ID，则将当前视频播放时间跳转到上次保存的记录
    if ( videoTime ){
      this.videoContext.seek(videoTime.currentTime)
    } 
    //点击时，自动播放
    this.videoContext.play()
  },

  /**
   * 监视视频的播放进度
   * 
   */
  handleTPlay (event){
    let { videoUpdateTiem } = this.data
    //获取当前播放视频的Id和记录播放时间，保存到对象中
    let videoTiemOjb = {id:event.currentTarget.id,currentTime:event.detail.currentTime}
    let videoCurrentTiemItme =  videoUpdateTiem.find( item => item.id ===  videoTiemOjb.id )
    //如果保存所有播放记录的数组中有当前播放的商品项，则不添加，只更新播放时间
    if ( videoCurrentTiemItme ){
      videoCurrentTiemItme.currentTime = event.detail.currentTime
    }else{
      //没有，添加到数组中
      videoUpdateTiem.push(videoTiemOjb)
      //更新数据
      this.setData({
        videoUpdateTiem
      })
    }

  },

  /**
   * 视频播放 进度条结束
   */
  handleEnd ( event ){
    let { videoUpdateTiem } = this.data
    //从videoUpdateTiem数组中找到与当前播放视频对应的数组元素下标，并将其从videoUpdateTiem数组中删除
    let index =  videoUpdateTiem.findIndex(item => item.id === event.currentTarget.id )
    videoUpdateTiem.splice(index,1)
    this.setData({
      videoUpdateTiem
    })
  },

  /** 
   *监听scroll-view下拉事件 
  */
  handleRefresh () {
  //延迟一点
    this.getVideoList(this.data.navId)
    setTimeout(() => {
      this.setData({
        isTriggered:false
      })
    },300)

  },
  
  /**
   * 上拉加载功能,因为接口没有返回数据是固定的8条，没有更多数据，只能将原有数据拼接到视频数据数组中
   */
  async handleScrollTolower (){
    let { videoList } = this.data
    console.log('上拉加载')
    //重新获取属性，并拼接到数组中
    let viodeListData = await request('/video/group',{id:this.data.navId,isLogin:true})
    //viodeListData.datas取到的数据原本就是数组,使用扩展运算符解构处理,然后再添加到数组中
    videoList.push(...viodeListData.datas)
    //不再添加
    if ( videoList.length >= 24){
      return
    }
    this.setData({
      videoList
    })

  },


  /**
   * 
   * 跳转到查询页面
   */
  toSearchPage (){
    wx.navigateTo({
      url:'/songPage/pages/search/search'
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
  onShareAppMessage: function ( res ) {
    if ( res.from === 'button'){
      return {
        title:'自定义转发',
        imageUrl:'/static/images/nvsheng.jpg'
      }
    }
    return{
      title:"全局转发"
    }

  }
})