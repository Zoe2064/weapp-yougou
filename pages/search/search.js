/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-21 20:30:17
 * @LastEditors: Zoe
 */
// pages/search/search.js

/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断
  3 检验通过 将输入值 发送到后台
  4 返回的数据打印到页面上
2 防抖（防止界面抖动） 定时器
  0 防抖 一般用于输入框中 防止重复输入 重复发送请求
    节流 一般用于页面的上拉下拉
  1 定义全局的定时器 id
*/

import { request } from "../../request/index.js";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消按钮 是否显示
    isFocus: false,
    // 输入框的值
    inpValue: ""

  },
  TimeId: -1,

  onCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: []
    });

  },

  onSearch(e) {
    // 1 获取输入框的值
    const { detail } = e;
    // 2 检测合法性
    if (!detail.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      });
      clearTimeout(this.TimeId);

      // 值不合法
      return;
    }
    // console.log(e);
    // 3 准备发送请求获取数据
    this.setData({
      isFocus: true
    });
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(detail);

    }, 1000);

  },

  // 发送请求获取搜索建议数据
  async qsearch(query) {
    const result = await request({ url: "/goods/search", data: { query } });
    console.log(result);
    const { goods } = result.data.message;
    this.setData({
      goods
    });
  },

}) 