
/**
 * 用于封装发送请求的函数功能模块
 */
import config from './config.js'
export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject) =>{
        wx.request({
            url: config.host+url,//本地调试
            // url:config.penetrateHost+url,//真机调试
            data,
            method,
            header:{
              cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies') : ''
            },
            success: (res) => {
              console.log(res)
              //当请求视频数据时， 将用户的cookie存入至本地,
              if ( data.isLogin){
                wx.setStorageSync('cookies','MUSIC_U=8d0a733141b0da42572f2ac9431f72818f38648fbc16ff646fcfbf18c81b8d1a33a649814e309366; Expires=Mon 23-Nov-2020 11:50:17 GMT; Path=/')
              }
              resolve(res.data)
            },
            fail: (err) =>{
              reject(err)
            }
          })
    })
}