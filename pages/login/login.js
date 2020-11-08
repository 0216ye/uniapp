import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   *用于收集手机号和密码的数据 
   */
  handleInput (event){
    //获取输入的值
    let value = event.detail.value
    //获取标签的id标识，用于区分是手机号/密码框触发的事件
    let type = event.currentTarget.id
    this.setData({
      [type] : value
    })
  },

  /**
   * 用于提交表单，发送登录请求
   */
  async handleSubmit (){
    let {phone,password} = this.data
    //校验表单数据
    if ( !phone ){
      wx.showToast({
        title:"手机号不能为空",
        icon:"none"
      })
      return
    }
    if ( !password ){
      wx.showToast({
        title:"密码不能为空",
        icon:"none"
      })
      return
    }
    let phoneTest = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    if ( !phoneTest.test(phone) ){
      wx.showToast({
        title:"请输入正确手机号",
        icon:"none"
      })
      return
    }
    if ( password.length < 3){
      wx.showToast({
        title:"密码错误",
        icon:"none"
      })
      return
    }
    //表单数据校验通过，真正发送请求
    let result = await request('/login/cellphone',{phone,password})
    //判断是否登录成功
    if ( result.code == 200){
      wx.showToast({
        title:"登录成功!",        
      })
      console.log(JSON.stringify(result.profile))
      wx.setStorageSync("userInfo",JSON.stringify(result.profile))
      //跳转到个人中心页面
      wx.switchTab({
        url:"/pages/profile/profile"
      })

    } else if ( result.code == 400){
      wx.showToast({
        title:"手机号错误!",
        icon:"none"
      })
    } else if ( result.code ==502 ){
      wx.showToast({
        title:result.msg,
        icon:"none"
      })
    }else{
      wx.showToast({
        title:"网络错误，请重新登录",
        icon:"none"
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