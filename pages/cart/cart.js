/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-17 17:47:19
 * @LastEditors: Zoe
 */
// pages/cart/cart.js

/* 
1 获取用户的收货地址
  1 绑定点击事件
  2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress
2 页面加载完毕
  0 onLoad onShow
  1 获取本地存储中的地址数据
  2 把数据 甚至给 data 中的一个变量
3 onShow
  0 回到商品详情页面 第一次添加商品的时候 手动添加属性
    1 num = 1;
    2 checked = true;
  1 获取缓存中的购物车数组
  2 把购物车数据填充到 data 中
4 全选的实现 数据的展示
  1 onShow 获取缓存中的购物车数组
  2 根据购物车中的商品数据 所有商品都被选中 checked=true 全选就被选中
5 总价格和总数量
  1 都需要商品被选中 才计算
  2 获取购物车数组
  3 遍历
  4 判断商品是否被选中
  5 总价格 += 商品单价 * 商品数量
  5 总数量 += 商品数量
  6 计算结果设置回 data 中 
6 商品的选中
  1 绑定 change 事件
  2 获取到被修改的商品对象
  3 商品对象的选中状态 取反
  4 重新填充回 data 与缓存中
  5 重新计算 全选、总价格、总数量等
7 全选与反选
  1 全选复选框绑定事件 change
  2 获取 data 中的全选变量 allChecked
  3 取反 allChecked=！allChecked
  4 遍历购物车数组 使得商品选中状态跟随 allChecked 改变
  5 将购物车数组 与 allChecked 重新设置回 data 将购物车重新设置回缓存中
8 商品数量编辑功能
  1 "+" "-"按钮 绑定同一个点击事件 区分的关键 自定义属性
    "+" "+1"
    "-" "-1"
  2 传递被点击的商品id goods_id
  3 获取 data 中的购物车数组 来获取需要被修改的商品对象
  4 当 购物车数量 =1 同时 用户点击 "-"
    弹窗提示 询问用户 是否要删除
    1 确定 直接执行删除
    2 取消 什么都不做
  4 直接修改商品对象的数量 num
  5 把 cart 数组重新设置回缓存和 data 中 this.setCart
9 点击结算
  1 判断有无收货地址信息
  2 判断用户有无选购商品
  3 经过以上验证 跳转支付页面

  
*/

import { chooseAddress, showModal, showToast } from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },

  // 点击 收货地址
  async handleChooseAddress() {
    // 获取收货地址
    const result = await chooseAddress();
    // console.log(result);
    wx.setStorageSync("address", result);
  },

  // 商品的选中
  handleItemChange(e) {
    // 获取商品被修改的 id
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选、总价格、购买数量
  setCart(cart) {
    let allChecked = true;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    wx.setStorageSync("cart", cart);

  },

  // 商品的全选事件处理
  handleItemAllChecked() {
    // 1 获取 data 中的数据
    let { cart, allChecked } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4 把修改后的值 填充回data或缓存中
    this.setCart(cart);
  },

  // 商品数量编辑
  async handleItemNumEdit(e) {
    // 1 获取传递过来的参数
    const { operation, id } = e.currentTarget.dataset;
    console.log(operation, id);
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({ content: "是否要删除？" });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4 进行数量修改
      cart[index].num += operation;
      // 5 设置回缓存和 data 中
      this.setCart(cart);
    }
  },

  async handlePay() {
    // 1 判断收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还未选择收货地址！" });
      return;
    }
    // 2 判断用户有无选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还未选购商品！" });
      return;
    }
    // 3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
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
    const cart = wx.getStorageSync("cart") || [];

    this.setCart(cart);
    this.setData({
      address
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})