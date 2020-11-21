import moment from 'moment'

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
    musicId:'',//保存音乐的Id
    musicLink:'',//保存音乐的链接
    currentTiem:'00:00',//当前音乐播放的时间
    durationTime:'00:00',//总的音乐时长
    currentWidth:0,//当前播放进度条的长度
    pattern: false // true为随机 false为循环
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    //获取当前歌曲的id
    let musicId = options.id
    this.setData({
      musicId
    })
    let pattern = this.data.pattern
    
    //调用歌曲信息函数
    this.getSongDetail(musicId)
    //判断全局音乐是否与当前页面播 放的音乐一致
    if ( appInstance.globalData.ismusicPlay && appInstance.globalData.musicId == musicId ){
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
      //从data中获取音乐id，设置给全局播放音乐的ID
      let musicId = this.data.musicId
      appInstance.globalData.musicId = musicId

    })
    this.bgMusicManager.onPause(() => {
      this.isPlayState(false)
    })
    this.bgMusicManager.onStop(() => {
      this.isPlayState(false)
    })

    //监听音乐自然播放结束
    this.bgMusicManager.onEnded(() => {

      //触发消息订阅函数
      this.getPubSubMusicId()
      //消息发布-->通知切换下一首
      PubSub.publish('switchMusic',{type:'next',pattern})
      //将数据复原
      this.setData({
        currentWidth:0,
        currentTiem:'00:00'
      })
    })
    
    //监听音乐的播放进度
    this.bgMusicManager.onTimeUpdate(() => {
      //获取音乐当前播放的时间,moment单位为毫秒,获取到的单位为秒
      let currentTiem = moment(this.bgMusicManager.currentTime*1000).format('mm:ss')
      //当前播放进度条宽度->  (当前播放时间/总的音乐时间)*总的进度条宽度
      let currentWidth = this.bgMusicManager.currentTime/+this.bgMusicManager.duration * 450
      this.setData({
        currentTiem,
        currentWidth
      })
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
    //将获取到的音乐总时长格式化后返回,moment单位是毫秒
    let durationTime = moment(songDetaileData.songs[0].dt).format('mm:ss')
    if ( songDetaileData ){
      this.setData({
        song:songDetaileData.songs[0],
        durationTime,
        musicId
      })
      //动态显示头部的名字
      wx.setNavigationBarTitle({
        title: this.data.song.ar[0].name
      });
    } 
  },

 
  /**
   * 监听音乐播放暂停的功能函数
   */
  async songDetailIsPlay ( isPlay,musicId,musicLink ){

    if ( isPlay ){//true,音乐播放
      //当音乐链接为空时，发送请求，否则不发请求
      if ( !musicLink ){
        //获取音乐的地址
        let result = await request('/song/url',{id:musicId})
        musicLink = result.data[0].url
        //返回的数据没有音乐播放链接
        if ( !musicLink ){
          wx.showToast({
            title: '获取资源失败!',
            icon: 'none',
          })
          return
        }
        this.setData({
          musicLink,
          musicId
        })
      }

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
    let pattern = this.data.pattern
    //获取切换的类型
    let type = evnet.currentTarget.dataset.set
    //关闭当前音乐的播放
    this.bgMusicManager.stop()
    //触发消息订阅函数
    this.getPubSubMusicId()
    //消息的发布
    PubSub.publish('switchMusic',{type,pattern})
  },

   /**
   * 控制音乐的播放/暂停的回调
   */
  handleMusicPlay (){
    let isPlay = !this.data.isPlay
    let {musicId,musicLink} = this.data
    this.songDetailIsPlay( isPlay,musicId,musicLink)
  },


  /**
   * 消息的订阅，获取音乐的id
   */
  getPubSubMusicId (){
    PubSub.subscribe('musicId',(msg,musicId) => {

      appInstance.globalData.musicId = musicId
      //调用获取歌曲详细数据和音乐播放暂停的函数执行
      this.getSongDetail(musicId)
      this.songDetailIsPlay(true,musicId)
      //取消订阅,否则重复触发
      PubSub.unsubscribe('musicId')
    })
  },

  /**
   * 切换播放模式:随机/循环
   */
  handlePattern (){
    let pattern = !this.data.pattern
    this.setData({
      pattern
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