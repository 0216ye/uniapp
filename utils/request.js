
/**
 * 用于封装发送请求的函数功能模块
 */
import config from './config.js'
export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject) =>{
        wx.request({
            url: config.host+url,
            data,
            method,
            success: (res) => {
              console.log('请求成功:',res)
              resolve(res.data)
            },
            fail: (err) =>{
              console.log('请求失败:',err)
              reject(err)
            }
          })
    })
}