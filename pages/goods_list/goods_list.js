/*
 * @Description: 
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-03-20 20:27:49
 * @LastEditors: Zoe
 */
// pages/goods_list/goods_list.js

/* 
1 用户上滑页面 滚动触底 开始加载下一页数据
  1 找到滚动条触底事件 微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数 
      总页数 = Math.ceil(总条数 / pagesize)
    2 获取到当前的页码 pagenum
    3 判断 当前页吗是否大于等于总页数
      表示没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前页码 ++
    2 重新发送请求
    3 数据请求回来 对 data 数组进行拼接操作！！！！
2 下拉刷新页面
  1 触发下拉刷新事件  在页面 json 文件中开启配置项
    找到 触发下拉刷新的事件 onPullDownRefresh
  2 重置 数据数组
  3 重置页码 设置为 1
  4 重新发送请求
3 当数据重置成功之后，调用此函数，关闭下拉刷新的效果
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
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      },
    ],
    goodsList: []

  },

  // 接口需要传递的参数
  Queryparams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },

  // 总页数
  totalPages: 1,

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  // 获取商品列表数据
  async getGoodsList() {
    const result = await request({ url: "/goods/search", data: this.Queryparams });
    // console.log(result);

    // 获取总条数
    const total = result.data.message.total;

    // 计算总页数
    this.totalPages = Math.ceil(total / this.Queryparams.pagesize);
    // console.log(this.totalPages);

    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...result.data.message.goods]
    });

    // 4 当数据重置成功之后，调用此函数，关闭下拉刷新的效果
    wx.stopPullDownRefresh()
  },

  onLoad(options) {
    // console.log(options);
    this.Queryparams.cid = options.cid||"";
    this.Queryparams.query = options.query||"";
    
    this.getGoodsList()
  },


  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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
    // console.log("下拉刷新");
    // 1 重置数组
    this.setData({
      goodsList: []
    })

    // 2 重置页码
    this.Queryparams.pagenum = 1;

    // 3 重新发送数据请求
    this.getGoodsList();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // console.log('页面触底')

    // 判断是否有下一页数据
    if (this.Queryparams.pagenum >= this.totalPages) {
      // 没有下一页数据
      // console.log("没有下一页数据",);
      wx.showToast({
        title: '数据加载完毕！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    } else {
      // 还有下一页数据
      // console.log("还有下一页数据");
      this.Queryparams.pagenum++;
      this.getGoodsList();
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})