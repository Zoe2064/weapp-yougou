/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-19 15:30:21
 * @LastEditors: Zoe
 */
// pages/order/order.js

/* 
1 页面被打开的时候 onShow
  0 onShow 不同于 onLoad 无法在形参上接收 options 参数
  0.5 判断缓存中有无 token
    1 没有 跳转到授权页面
    2 有 往下执行
  1 获取 url 上的参数type
  2 根据 type 决定标签哪个被激活选中
  2 根据 type 发送请求获取订单数据
  3 渲染页面
2 点击不同的标签 重新发送请求来获取和渲染数据
*/


import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      },
    ],
    orders: [],
    type: 0
  },
  // 获取订单列表的方法
  async getOrders(type) {
    let res = await request({ url: "/my/orders/all", data: { type } });
    
    this.setData({
      orders: res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    });

  },

  // 根据标题索引来激活选择 标题数组
  changeTitleByIndex(index) {
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求 type = 1 index = 0
    this.getOrders(index+1);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 判断缓存中有无 token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }

    // 1 获取小程序页面栈-数组 长度最大为 10
    let curPages = getCurrentPages();
    // 2 数组中索引最大的页面就是当前页面
    let currentPage = curPages[curPages.length - 1];
    // console.log(currentPage.options);
    // 获取url上的type参数
    const { type } = currentPage.options;
    // 4 激活选中的标题
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  }

})