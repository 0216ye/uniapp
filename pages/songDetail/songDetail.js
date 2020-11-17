import PubSub from 'pubsub-js'

import request from '../../utils/request'
//创建小程序实例
let appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//音乐是否播放 false：不播放 true：播放
    song:{},//保存音乐的数据
    musicId:''//保存音乐的Id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前歌曲的id
    let musicId = options.id
    this.setData({
      musicId
    })

    
    //调用歌曲信息函数
    this.getSongDetail(musicId)

    //判断全局音乐是否与当前页面播放的音乐一致
    if ( appInstance.globalData.ismusicPlay && appInstance.globalData.musicId == musicId ){
      console.log('经历了')
      //将当前页面的音乐设置为播放状态
      this.setData({
        isPlay:true
      })
    }

    
    //获取背景音乐的实例
    this.bgMusicManager =  wx.getBackgroundAudioManager()
    //监听背景音频播放/暂停/停止事件
    this.bgMusicManager.onPlay(() => {
      this.isPlayState(true)
      //设置全局播放音乐的ID
      appInstance.globalData.musicId = musicId
    })
    this.bgMusicManager.onPause(() => {
      this.isPlayState(false)
    })
    this.bgMusicManager.onStop(() => {
      this.isPlayState(false)
    })
  },
  /**
   *控制音乐状态的函数 
   */
  isPlayState (isPlay){
    this.setData({
      isPlay
    })
    //设置全局的音乐播放状态
    appInstance.globalData.ismusicPlay = isPlay
  },
  /**
   * 获取歌曲详细信息的功能
   */
  async getSongDetail (musicId){
    let songDetaileData = await request('/song/detail',{ids:musicId})
    if ( songDetaileData ){
      this.setData({
        song:songDetaileData.songs[0]
      })
      //动态显示头部的名字
      wx.setNavigationBarTitle({
        title: this.data.song.ar[0].name
      });
    } 
  },

  /**
   * 控制音乐的播放/暂停的回调
   */
  handleMusicPlay (){
    let isPlay = !this.data.isPlay
    let musicId = this.data.musicId
    // this.setData({
    //   isPlay
    // })
    this.songDetailIsPlay( isPlay,musicId )
  },

  /**
   * 监听音乐播放暂停的功能函数
   */
  async songDetailIsPlay ( isPlay,musicId ){
    //获取音乐的地址
    let result = await request('/song/url',{id:musicId})
    let musicLink = result.data[0].url
    if ( isPlay ){
      //设置背景音乐播放的链接和音乐的标题
      this.bgMusicManager.src = musicLink
      this.bgMusicManager.title = this.data.song.ar[0].name
    }else{
      //暂停音乐
      this.bgMusicManager.pause()
    }

  },

  /**
   * 处理上一首下一首事件 
   */
  handleSwitchMusic (evnet){
    //获取切换的类型
    let type = evnet.currentTarget.dataset.set
    //关闭当前音乐的播放
    this.bgMusicManager.stop()
    //消息的订阅，获取音乐的id
    PubSub.subscribe('musicId',(msg,musicId) => {
      //调用获取歌曲详细数据和音乐播放暂停的函数执行
      this.getSongDetail(musicId)
      this.songDetailIsPlay(true,musicId)
      //取消订阅,否则重复触发
      PubSub.unsubscribe('musicId')
    })
    //消息的发布
    PubSub.publish('switchMusic',type)
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