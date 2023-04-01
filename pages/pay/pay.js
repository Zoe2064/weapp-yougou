// pages/pay/pay.js
/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-17 21:54:58
 * @LastEditors: Zoe
 */

/* 
1 页面加载时候
  1 从缓存中获取购物车数据 渲染到页面
  数据特点：checked=true
2 微信支付
  1 哪些人 哪些账号 可以实现微信支付
    1 企业账号
    2 企业账号的小程序后台中 必须给开发者添加白名单
      1 一个 appid 可以绑定多个开发者
      2 开发者可以公用 appid 和其开发权限
3 支付按钮
  1 先判断缓存中有无 token
  2 若无 跳转到授权页面 进行 token 获取
  3 若有 。。。
  4 创建订单 获取订单编号
  5 已经完成微信支付
  6 手动删除缓存中已经被选中了的商品
  7 删除后的购物车数据 填充回缓存
  8 跳转页面
*/

import { chooseAddress, showModal, showToast, requestPayment } from "../../utils/asyncWx.js"
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 1 获取缓存中的收货地址信息
    let address = wx.getStorageSync("address");
    if (address) {
      address.detail_address = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    }
    // 1 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);

    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    });
  },

  // 点击 支付
  async handleOrderPay() {
    try {
      // 1 判断缓存中有无 token
      const token = wx.getStorageSync("token");
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth',
        });
        return;
      }
      // console.log("已经存在 token");
      // 3 创建订单
      // 3.1 准备 请求头参数
      // const header = { Authorization: token };
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.detail_address;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 准备发送请求 创建订单 获取订单编号
      const res1 = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      let { order_number } = res1.data.message
      // console.log(order_number);
      // 5 发起预支付接口
      const res2 = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      const { pay } = res2.data.message
      // console.log(pay);
      // 6 发起微信支付
      await requestPayment(pay);
      // console.log(res3);
      // 7 查询后台订单状态
      const res3 = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      await showToast({ title: '支付成功' });
      // 8 手动删除缓存中已经支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      // 8 支付成功跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order',
      });
    } catch (error) {
      await showToast({ title: '支付失败' });
      console.log(error);
    }
  }
})

