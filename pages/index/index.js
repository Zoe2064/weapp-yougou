/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:13:16
 * @LastEditTime: 2023-03-20 21:25:16
 * @LastEditors: Zoe
 */

import { request } from "../../request/index.js";

Page({

  data: {
    swiperList: [],  // 轮播图数组
    catesList: [],   // 导航数组
    floorList: [],    // 楼层数组
    value: '',
  },

  onLoad: function (options) {
    this.getSwiperList();
    this.getCatesList();
    this.getFoorList(); 
  },
  
  onSearch(){
    
  },

  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        console.log(result);
        this.setData({
          swiperList: result.data.message
        })
      })
  },

  // 获取楼层数据
  getFoorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        console.log(result);
        this.setData({
          floorList: result.data.message
        })
      })
  },

  getCatesList() {
    request({ url: "/home/catitems" })
      .then(result => {
        console.log(result);
        this.setData({
          catesList: result.data.message
        })
      })
  },



  getSwiperList2() {
    // 1 发送异步请求获取轮播图数据 优化手段通过而es6的 promise 来解决问题
    wx.request({
      url: '/home/catitems',
      success: (result) => {
        this.setData({
          swiperList: result.data.message
        })
      }
    })
  }

})