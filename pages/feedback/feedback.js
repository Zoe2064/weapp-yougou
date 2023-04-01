/*
 * @Description:
 * @Author: Zoe
 * @Date: 2023-03-10 14:40:47
 * @LastEditTime: 2023-04-01 19:38:44
 * @LastEditors: Zoe
 */
// pages/feedback/feedback.js

/* 
1 点击 + 触发 tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径 数组
  3 把图片路径存在 data 的变量中
  4 页面 循环显示 图片数组
2 点击自定义图片组件
  1 获取被点击的元素索引
  2 获取 data 中的图片数组
  3 根据索引数组中删除对应的元素
  4 把数组重新设置回 data 中
3 点击 提交 按钮
  1 获取文本域内容
  2 对内容进行合法性检测
  3 验证通过 用户选择的图片上传到专门的图片服务器 返回图片外网的链接
    1 遍历图片数组
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网链接
  4 文本域 和外网图片路径 提交到服务器 前端模拟
  5 清空当前页面
  6 返回上一页
*/
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false,
      },
    ],
    chooseImgs: [],
    textVal: "",
  },

  // 外网的图片路径数组
  UpLoadImgs: [],

  // 提交按钮点击事件
  handleFormSubmit() {
    // 1 获取文本域内容
    const { textVal, chooseImgs } = this.data;
    // 2 合法性验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: "输入不合法",
        icon: "none",
        mask: true,
      });
      return;
    }
    // 3 准备上传图片到专门服务器
    // 上传文件的 api 不支持多个文件同时上传 遍历数组 挨个上传
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });

    // 判断有没有需要上传的图片数组
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片上传地址
          url: "https://media.mogu.com/image/scale?appKey=15m&w=500&h=500&quality=100",
          // 被上传到文件的路径
          filePath: v,
          //  上传文件名称 后台来获取文件 file
          name: "image",
          // 顺带的文本信息
          formData: {},
          success: (res) => {
            // JSON 解析 string 转 object
            const { url } = JSON.parse(res.data).result;
            this.UpLoadImgs.push(url);
            console.log(this.UpLoadImgs);
            
            // 所有的图片都上传完毕才触发
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();

              console.log("把文本的内容和外网的图片数组 提交到后台中");
              // 所有提交均成功
              // 重置页面
              this.setData({
                textVal: "",
                chooseImgs: [],
              });
              wx.navigateBack({
                delta: 1,
              });
            }
          },
        });
      });
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      wx.navigateBack({
        delta: 1,
      });
    }
  },

  // 文本域 输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value,
    });
  },

  // 删除图片
  handleRemoveImage(e) {
    // 2 获取被点击的组件的索引
    const { index } = e.currentTarget.dataset;
    // 3 获取 data 中的图片数组
    let { chooseImgs } = this.data;
    // 删除元素
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs,
    });
  },

  // + 点击事件 选择图片
  handleChooseImg() {
    // 2 调用小程序内置的选择图片 api
    wx.chooseMedia({
      // 同时选中的图片数量
      count: 9,
      // 媒体类型
      mediaType: ["image", "video"],
      // 图片来源 相册 相机
      sourceType: ["album", "camera"],
      maxDuration: 30,
      camera: "back",
      success: (res) => {
        let tempFilePath = res.tempFiles.map((v) => v.tempFilePath);
        // console.log(tempFilePath);
        this.setData({
          // 图片数组进行拼接
          chooseImgs: [...this.data.chooseImgs, ...tempFilePath],
        });
      },
    });
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    // 3 赋值到data中
    this.setData({
      tabs,
    });
  },
});
