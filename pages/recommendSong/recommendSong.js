import PubSub from 'pubsub-js'

import request from '../../utils/request'
//创建小程序实例
let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//页面显示的日期号数
    month:'',//页面显示的月份数
    recommendSongList:[],//保存每日推荐歌曲数据
    index:0 ,//保存的索引
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
    //消息的订阅
    PubSub.subscribe('switchMusic',(msg,data) => {
      let { type,pattern } = data
      let {recommendSongList,index} = this.data
      if ( pattern ){//随机模式
        let random = Math.floor((Math.random()*recommendSongList.length-1)+1);
        (random == index ) && ( random = Math.floor((Math.random()*recommendSongList.length-1)+1))
        index = random
      }else{
        if ( type == 'pre'){ //上一首
          //循环播放
          (index == 0) && (index = recommendSongList.length)
          index -= 1
        }else{ //下一首
          (index == recommendSongList.length-1) && (index = -1)
          index += 1
        }
      }
    
      //更新状态
      this.setData({
        index
      })
      let musicId = recommendSongList[index].id

      //更新全局中的音乐Id
      appInstance.globalData.musicId = musicId
      //消息的发布，将音乐Id传回给songdetail页面
      PubSub.publish('musicId',musicId)
    })
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

  //点击每条歌曲数据时进行跳转
  handleSongDeatail (event){
    let song  = event.currentTarget.dataset.set
    //获取标识id
    let index  = event.currentTarget.dataset.index
    this.setData({
      index
    })

    wx.navigateTo({
      url: '/pages/songDetail/songDetail?id='+song.id,
    });
      
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