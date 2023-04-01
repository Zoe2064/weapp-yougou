/*
 * @Description: ,
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-17 19:13:04
 * @LastEditors: Zoe
 */
// pages/auth/auth.js


import { request } from "../../request/index.js";
import { login } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 获取用户信息
  async handleGetUserInfo(e) {
    try {
      console.log(e);
      // 1 获取用户信息
      const { encryptedData, rawData, iv, signature } = e.detail;
      // 2 获取小程序登陆成功后的code
      const { code } = await login();
      // console.log(code);
      const loginParams = { encryptedData, rawData, iv, signature, code };
      // 3 发送请求 获取用户的 Token 值
      // const res = await request({url: "/users/wxlogin",data:loginParams,method:"post"});
      // console.log(res);
      let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });

    } catch (error) {
      console.log(error);
    }
  }

})