/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-18 18:23:21
 * @LastEditors: Zoe
 */
// pages/login/login.js

import { chooseAddress, showModal, showToast, getUserProfile } from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  async getUserProfile(e) {
    const result = await getUserProfile();
    const { userInfo } = result;

    wx.setStorageSync("userinfo", userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})