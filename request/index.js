/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-11 18:32:53
 * @LastEditTime: 2023-03-17 21:51:05
 * @LastEditors: Zoe
 */

// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
    
    // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
    let header = { ...params.header };
    if (params.url.includes("/my/")) {
        // 拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }

    ajaxTimes++;
    // 现实加载中效果
    wx.showLoading({
        title: '玩命加载中...',
        mask: true
    })

    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,                  // 解构参数
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    // 关闭正在加载中的图标
                    setTimeout(function () {
                        wx.hideLoading()
                    }, 1000)
                }
            }
        });
    })
}

