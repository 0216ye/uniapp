import request from '../../utils/request'
let isflag = true //用于函数节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:'',//输入框的默认内容
    searchContent:'',//输入框搜索的内容
    hotList:[],//热歌榜数据
    searchList:[],//模糊查询歌曲数据
    searchHistory:[],//查询的历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSearchData()

    //从本地获取查询历史记录
    let searchHistory =  wx.getStorageSync('searchList');
    this.setData({
      searchHistory
    })
      
  },

  /**
   * 获取输入框默认显示&热歌榜
   */
  async getSearchData (){
    let placeData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    //获取失败，给用户提示
    if ( !placeData || !hotListData){
      wx.showToast({
        title: '获取资源失败!',
        icon: 'none',
      })
      return
    }
    this.setData({
      //更新输入框默认内容和热歌榜数据
      placeholder:placeData.data.showKeyword,
      hotList:hotListData.data
    })
    
  },

  /**
   * 输入监听事件
   */
  searchChange (event){
    //获取输入框输入内容
    let value = event.detail.value.trim()
    this.setData({
      searchContent:value
    })
    //获取模糊查询数据
    this.getSongsList(value)
  },
  /**
   * 获取模糊查询歌曲的数据
   */
   getSongsList (keywords){
     let searchHistory = this.data.searchHistory
    //查询内容为空不发送请求,并清除查询数据
    if ( !keywords) {
      this.setData({
        searchList:[]
      })
      return
    }

    //函数节流 : 指定一段时间内，多次触发,只会触发一次执行,
    if ( isflag ){
      isflag = false
      setTimeout(async () => {
        //发送请求，获取模糊查询内容
        let searchListData = await request('/search',{keywords,limit:10})
        if ( !searchListData ){
          wx.showToast({
            title: '获取资源失败!',
            icon: 'none',
          })
          return
        }
        //查询历史记录中存在与当前查询的一样，删除它
        if ( searchHistory.indexOf(keywords) !== -1){
          searchHistory.splice(searchHistory.indexOf(keywords),1);
        }
        //重新将它添加到数组第一位
        searchHistory.unshift(keywords);
        this.setData({
          searchList:searchListData.result.songs,
          searchHistory
        })
        //将查询历史保存到本地
        wx.setStorageSync('searchList', searchHistory);
        //重置节流标识
        isflag = true
      },300)
    }    
  },
  handleCLick(event){
    let id = event.currentTarget.dataset.id
  
     //路由传参数给sonDetail页面
     wx.navigateTo({
      url: '/pages/songDetail/songDetail?id='+id,
    });
  },
  /**
   *清空输入框查询内容 
   */
  clearSearchContent (){
    this.setData({
      searchContent:'',
      searchList:[]
    })
  },

  /**
   * 清除历史记录
   */
  clearSearchHistory (){
    wx.showModal({
      title: '提示',
      content: '是否清除历史记录?',
      success: (res) =>{
        if (res.confirm) {
          //清除data和本地中的数据
          this.setData({
            searchHistory:[]
          })
          wx.removeStorageSync('searchList')
        }
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