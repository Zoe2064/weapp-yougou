/*
 * @Description: get
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-12 19:16:30
 * @LastEditors: Zoe
 */
// pages/category/category.js

import { request } from "../../request/index.js";

Page({

  data: {
    leftMenuList: [],   // 左侧的菜单数据
    rightContent: [],   // 右侧的商品数据
    currentIndex: 0,    // 被点击的左侧的菜单
    scrollTop: 0,       //右侧内容的滚动条距离顶部的距离
  },

  cates: [],           // 接口的返回数据

  onLoad(options) {
    /* 
    1 先判断本地存储中有无旧数据
    2 若无旧数据 直接发送新请求
    3 若有旧数据且未过期 使用旧数据
    */
    // this.getCates();

    // 1 获取本地存储中的数据（小程序中也有本地存储技术）
    const cates = wx.getStorageSync("c");
    // 2 判断
    if (!cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      // 有旧数据 定义过期时间 10s 改成 5min
      if (Date.now() - cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 读取本地存储中的旧数据
        this.cates = cates.data;
        let leftMenuList = this.cates.map(v => v.cat_name);
        let rightContent = this.cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })

      }

    }

  },

  async getCates() {
    // request({ url: "/categories" })
    //   .then(result => {

    //     this.cates = result.data.message;

    //     // 把接口数据存入本地存储中
    //     wx.setStorageSync("c", { time: Date.now(), data: this.cates });

    //     // 构造左侧的大菜单数据
    //     let leftMenuList = this.cates.map(v => v.cat_name);
    //     // 构造右侧的商品数据
    //     let rightContent = this.cates[0].children;
    //     this.setData({
    //       leftMenuList,
    //       rightContent
    //     })

    //   })

    // 1 使用 es7 的 async await 发送异步请求
    const result = await request({ url: "/categories" });

    this.cates = result.data.message;

    // 把接口数据存入本地存储中
    wx.setStorageSync("c", { time: Date.now(), data: this.cates });

    // 构造左侧的大菜单数据
    let leftMenuList = this.cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })


  },

  // 左侧菜单的点击事件
  handleItemTap(e) {
    // console.log(e);
    /* 
    1 获取被点击的标题身上的索引
    2 给 data 中的 currentTarget 赋值
    3 根据不同的索引来渲染右侧的商品内容
    */

    const { index } = e.target.dataset;

    // 构造右侧的商品数据
    let rightContent = this.cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0  // 重新设置右侧内容的 scroll-view 标签距离顶部的距离
    })

  },

})