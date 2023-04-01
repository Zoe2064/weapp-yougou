/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-18 21:58:51
 * @LastEditors: Zoe
 */
// pages/goods_detail/goods_detail.js

/* 
1 发送请求 获取数据
2 点击轮播图 预览大图
  1 轮播图绑定点击事件
  2 调用小程序的API previewImage
3 点击加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 判断 当前商品是否存在于购物车
    若已存在 修改商品数据 执行购物车数量++
    若不存在 购物车添加一个新元素
  4 弹出提示
4 商品收藏
  1 页面 onShow 的时候 加载缓存中的商品收藏的数据
  2 判断当前是否被收藏
    1 是 改变页面图标
    2 不是。。。
  3 点击商品收藏按钮
    1 判断该商品是否存在于缓存数组中
    2 已存在 将该商品删除
    2 未存在 将商品添加到收藏数组中 存入缓存中
*/

import { request } from "../../request/index.js";

Page({

  data: {
    goods_detail: {},
    isCollect: false
  },

  // 商品对象
  GoodsInfo: {

  },

  onLoad(options) {
  },

  // 点击商品收藏
  handleCollect(){
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 2 判断商品是否被收藏
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3 当 index != -1 表示已收藏
    if(index!==-1) {
      // 已收藏 删除该商品
      collect.splice(index, 1);
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect =  true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });

    }
    // 4 将数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改 data 中的属性
    this.setData({
      isCollect
    });
  },

  // 点击轮播图放大预览
  handlePreviewImage(e) {
    // console.log("test ")
    const urls = this.data.goods_detail.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的 http 链接
      urls // 需要预览的图片 http 链接列表
    })

  },

  // 加入购物车点击事件
  handleCartAdd() {
    // console.log("购物车加购");
    // 1 获取缓存中的购物车数组
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断商品对象是否存在于购物车数组
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    console.log("index: ", index);
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 已经存在购物车数据 执行 num++
      cart[index].num += 1;
      console.log("num + 1");

    }
    // 将购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);

    // 弹窗提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      // 防止用户手抖 疯狂点击按钮
      mask: true,
    });
  },

  // 获取商品列表数据
  async getGoodsDetail(goods_id) {

    const result = await request({ url: "/goods/detail", data: { goods_id } });

    this.GoodsInfo = result.data.message;
    // console.log(GoodsInfo);

    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      goods_detail: {
        goods_name: result.data.message.goods_name,
        goods_price: result.data.message.goods_price,
        // iphone部分手机不识别 webp 图片格式
        goods_introduce: result.data.message.goods_introduce,
        pics: result.data.message.pics
      },
      isCollect
    });
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
    let curPages = getCurrentPages();
    let curPage = curPages[curPages.length - 1];
    let options = curPage.options;
    const { goods_id } = options;
    // console.log(curPage);
    this.getGoodsDetail(goods_id);

  },

})