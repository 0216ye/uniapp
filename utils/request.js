
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
            success: (res) => {
              resolve(res.data)
            },
            fail: (err) =>{
              reject(err)
            }
          })
    })
}